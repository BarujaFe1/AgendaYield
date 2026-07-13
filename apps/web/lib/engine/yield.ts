import type {
  ActionsResponse,
  Appointment,
  DashboardResponse,
  DemoSummary,
  RiskBoardResponse,
  RiskClient,
} from "./types";

export const DISCLAIMER =
  "AgendaYield estimates occupancy, no-show risk and recoverable revenue from synthetic agenda events. Lab only — not a clinic EMR, marketplace, or medical system.";

function parseDate(iso: string): Date {
  return new Date(iso);
}

/** Interpretable no-show risk in [0, 1]. Keep in sync with Python `_risk_score`. */
export function riskScore(row: Appointment): number {
  const prior = row.prior_no_shows;
  const conf = row.confirmation_status;
  const lead = row.lead_time_hours;
  const starts = parseDate(row.starts_at);
  // JS getDay(): 0=Sun … 6=Sat. Weekend = Sun/Sat (parity with Python dayofweek 5/6).
  const weekday = starts.getDay();
  const hour = starts.getHours();

  let score = 0.12 + Math.min(0.45, prior * 0.14);
  if (conf === "pending") score += 0.22;
  else if (conf === "declined") score += 0.35;
  if (lead < 12) score += 0.08;
  else if (lead > 96) score += 0.05;
  if (weekday === 0 || weekday === 6) score += 0.04;
  if (hour >= 18) score += 0.03;
  if (row.attendance_status === "no_show") score = Math.max(score, 0.55);
  return Math.min(0.97, Math.max(0.03, score));
}

export function band(score: number): "low" | "medium" | "high" {
  if (score >= 0.65) return "high";
  if (score >= 0.4) return "medium";
  return "low";
}

function actionFor(b: string, conf: string): string {
  if (b === "high" && conf === "pending") {
    return "Enviar confirmação urgente + oferecer encaixe se não confirmar";
  }
  if (b === "high") return "Cobrar sinal / reforçar lembrete e preparar lista de encaixe";
  if (b === "medium") return "Confirmar por WhatsApp e monitorar até T-4h";
  return "Manter lembrete padrão";
}

function weekKey(d: Date): string {
  const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((tmp.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${tmp.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function summarizeDemo(rows: Appointment[]): DemoSummary {
  const starts = rows.map((r) => parseDate(r.starts_at).getTime());
  const pros = [...new Set(rows.map((r) => r.professional))].sort();
  const services = [...new Set(rows.map((r) => r.service))].sort();
  const clients = new Set(rows.map((r) => r.client_id));
  return {
    name: "Studio Agenda Demo",
    description:
      "Synthetic aesthetic studio agenda with confirmations, attendance outcomes and ticket values for yield / no-show analytics.",
    appointments: rows.length,
    clients: clients.size,
    professionals: pros,
    services,
    date_start: new Date(Math.min(...starts)).toISOString().slice(0, 10),
    date_end: new Date(Math.max(...starts)).toISOString().slice(0, 10),
    path: "public/data/studio_agenda_demo.json",
    notice:
      "Synthetic portfolio demo. No real patient/client records. Not a medical records system.",
  };
}

export function buildDashboard(rows: Appointment[]): DashboardResponse {
  const scored = rows.map((r) => {
    const score = riskScore(r);
    return { ...r, risk_score: score, risk_band: band(score) };
  });

  const total = scored.length;
  const attended = scored.filter((r) => r.attendance_status === "attended").length;
  const noShows = scored.filter((r) => r.attendance_status === "no_show").length;
  const cancelled = scored.filter((r) => r.attendance_status === "cancelled").length;
  const confirmed = scored.filter((r) => r.confirmation_status === "confirmed").length;
  const idle = scored.filter((r) =>
    ["no_show", "cancelled"].includes(r.attendance_status),
  ).length;
  const lost = scored
    .filter((r) => ["no_show", "cancelled"].includes(r.attendance_status))
    .reduce((s, r) => s + r.ticket, 0);
  const recoverable =
    scored
      .filter((r) => r.risk_band === "high" && r.confirmation_status === "pending")
      .reduce((s, r) => s + r.ticket, 0) * 0.55;
  const bookedSlots = total - cancelled;
  const occupancy = bookedSlots ? attended / bookedSlots : 0;
  const avgTicket = total ? scored.reduce((s, r) => s + r.ticket, 0) / total : 0;

  const byPro = new Map<string, typeof scored>();
  for (const r of scored) {
    const list = byPro.get(r.professional) ?? [];
    list.push(r);
    byPro.set(r.professional, list);
  }

  const occupancy_by_professional = [...byPro.entries()]
    .map(([professional, g]) => {
      const can = g.filter((x) => x.attendance_status === "cancelled").length;
      const booked = g.length - can;
      const att = g.filter((x) => x.attendance_status === "attended").length;
      const ns = g.filter((x) => x.attendance_status === "no_show").length;
      const lostPro = g
        .filter((x) => ["no_show", "cancelled"].includes(x.attendance_status))
        .reduce((s, x) => s + x.ticket, 0);
      return {
        professional,
        booked,
        attended: att,
        no_shows: ns,
        cancelled: can,
        occupancy_rate: booked ? Number((att / booked).toFixed(4)) : 0,
        lost_revenue: Number(lostPro.toFixed(2)),
      };
    })
    .sort((a, b) => a.occupancy_rate - b.occupancy_rate);

  const minT = Math.min(...scored.map((r) => parseDate(r.starts_at).getTime()));
  const maxT = Math.max(...scored.map((r) => parseDate(r.starts_at).getTime()));
  const now = minT + (maxT - minT) / 2;

  const confirmation_queue = scored
    .filter((r) => r.confirmation_status === "pending")
    .map((r) => ({
      appointment_id: r.appointment_id,
      client_name: r.client_name,
      professional: r.professional,
      starts_at: r.starts_at,
      channel: r.channel,
      status: r.confirmation_status,
      hours_until: Number(((parseDate(r.starts_at).getTime() - now) / 3600000).toFixed(1)),
    }))
    .sort((a, b) => a.hours_until - b.hours_until)
    .slice(0, 12);

  const fill_src = scored
    .filter((r) => ["no_show", "cancelled"].includes(r.attendance_status))
    .slice(0, 8);
  const fill_in_slots = fill_src.map((r, i) => ({
    slot_id: `SLOT-${String(i + 1).padStart(3, "0")}`,
    professional: r.professional,
    starts_at: r.starts_at,
    duration_min: r.duration_min,
    estimated_ticket: r.ticket,
    waitlist_candidates: 1 + (i % 4),
    reason: "Horário ocioso por falta/cancelamento — candidato a encaixe",
  }));

  const weeklyMap = new Map<string, number>();
  for (const r of scored) {
    if (!["no_show", "cancelled"].includes(r.attendance_status)) continue;
    const key = weekKey(parseDate(r.starts_at));
    weeklyMap.set(key, (weeklyMap.get(key) ?? 0) + r.ticket);
  }
  const weekly_lost_revenue = [...weeklyMap.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, lost_revenue]) => ({
      week,
      lost_revenue: Number(lost_revenue.toFixed(2)),
    }));

  return {
    studio_name: "Studio Aurora Aesthetic",
    period_label: `${new Date(minT).toISOString().slice(0, 10)} → ${new Date(maxT)
      .toISOString()
      .slice(0, 10)}`,
    kpis: {
      occupancy_rate: Number(occupancy.toFixed(4)),
      no_show_rate: total ? Number((noShows / total).toFixed(4)) : 0,
      confirmation_rate: total ? Number((confirmed / total).toFixed(4)) : 0,
      idle_slots: idle,
      lost_revenue: Number(lost.toFixed(2)),
      recoverable_revenue: Number(recoverable.toFixed(2)),
      avg_ticket: Number(avgTicket.toFixed(2)),
      appointments_total: total,
    },
    occupancy_by_professional,
    confirmation_queue,
    fill_in_slots,
    weekly_lost_revenue,
    disclaimer: DISCLAIMER,
  };
}

export function buildRiskBoard(rows: Appointment[]): RiskBoardResponse {
  const scored = rows.map((r) => {
    const score = riskScore(r);
    return { ...r, risk_score: score, risk_band: band(score) };
  });
  let upcoming = scored.filter((r) => r.attendance_status === "scheduled");
  if (upcoming.length === 0) upcoming = scored;
  upcoming = [...upcoming].sort((a, b) => b.risk_score - a.risk_score);

  const clients: RiskClient[] = upcoming.slice(0, 20).map((r) => ({
    client_id: r.client_id,
    client_name: r.client_name,
    professional: r.professional,
    service: r.service,
    starts_at: r.starts_at,
    ticket: r.ticket,
    risk_score: Number(r.risk_score.toFixed(3)),
    risk_band: r.risk_band,
    prior_no_shows: r.prior_no_shows,
    confirmation_status: r.confirmation_status,
    recommended_action: actionFor(r.risk_band, r.confirmation_status),
  }));

  return {
    high_risk_count: upcoming.filter((r) => r.risk_band === "high").length,
    medium_risk_count: upcoming.filter((r) => r.risk_band === "medium").length,
    low_risk_count: upcoming.filter((r) => r.risk_band === "low").length,
    clients,
    methodology_note:
      "Risk score is a transparent heuristic: prior no-shows, confirmation lag, lead time, weekend/evening slots. Portfolio MVP — not a black-box ML model.",
  };
}

export function buildActions(
  dash: DashboardResponse,
  risk: RiskBoardResponse,
): ActionsResponse {
  const actions = [];
  const high = risk.clients.filter((c) => c.risk_band === "high");
  if (high.length) {
    actions.push({
      id: "ACT-001",
      title: "Confirmar clientes high-risk pendentes",
      priority: "now" as const,
      impact_brl: Number(
        (high.slice(0, 5).reduce((s, c) => s + c.ticket, 0) * 0.5).toFixed(2),
      ),
      owner: "Recepção",
      detail: `${high.length} horários com risco alto — priorizar WhatsApp/SMS.`,
    });
  }
  if (dash.fill_in_slots.length) {
    actions.push({
      id: "ACT-002",
      title: "Abrir lista de encaixe para buracos",
      priority: "today" as const,
      impact_brl: Number(
        (
          dash.fill_in_slots.slice(0, 4).reduce((s, x) => s + x.estimated_ticket, 0) * 0.4
        ).toFixed(2),
      ),
      owner: "Gestor de agenda",
      detail: "Oferecer horários ociosos para waitlist e clientes flexíveis.",
    });
  }
  actions.push({
    id: "ACT-003",
    title: "Revisar ocupação por profissional",
    priority: "this_week" as const,
    impact_brl: Number((dash.kpis.lost_revenue * 0.15).toFixed(2)),
    owner: "Dono / gestor",
    detail: "Rebalancear grade e campanhas nos profissionais com mais ociosidade.",
  });
  actions.push({
    id: "ACT-004",
    title: "Ativar depósito/sinal em serviços de ticket alto",
    priority: "this_week" as const,
    impact_brl: Number((dash.kpis.avg_ticket * 6).toFixed(2)),
    owner: "Financeiro",
    detail: "Reduzir no-show em procedimentos acima do ticket médio.",
  });

  return {
    actions,
    estimated_recoverable_brl: Number(
      actions.reduce((s, a) => s + a.impact_brl, 0).toFixed(2),
    ),
  };
}

export async function loadAppointments(): Promise<Appointment[]> {
  // Relative URL keeps GitHub Pages basePath (/AgendaYield) working.
  const res = await fetch("data/studio_agenda_demo.json", { cache: "force-cache" });
  if (!res.ok) throw new Error(`Failed to load demo agenda (${res.status})`);
  return res.json() as Promise<Appointment[]>;
}
