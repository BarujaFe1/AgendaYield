"use client";

import { useEffect, useState, useTransition } from "react";
import { LostRevenueChart } from "@/components/LostRevenueChart";
import { fetchActions, fetchDashboard, fetchDemo, fetchRiskBoard } from "@/lib/api";
import type {
  ActionsResponse,
  DashboardResponse,
  DemoSummary,
  RiskBoardResponse,
} from "@/types";

function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export default function HomePage() {
  const [demo, setDemo] = useState<DemoSummary | null>(null);
  const [dash, setDash] = useState<DashboardResponse | null>(null);
  const [risk, setRisk] = useState<RiskBoardResponse | null>(null);
  const [actions, setActions] = useState<ActionsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      try {
        const [d, board, r, a] = await Promise.all([
          fetchDemo(),
          fetchDashboard(),
          fetchRiskBoard(),
          fetchActions(),
        ]);
        setDemo(d);
        setDash(board);
        setRisk(r);
        setActions(a);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load AgendaYield API");
      }
    });
  }, []);

  const k = dash?.kpis;

  return (
    <main>
      <section className="hero">
        <p className="muted">Calendar yield · no-show risk · recovery actions</p>
        <h1 className="brand">AgendaYield</h1>
        <p className="lede">
          Cockpit de yield para agendas de serviços: ocupação, risco de falta, confirmações
          pendentes, receita perdida e ações para recuperar horários ociosos.
        </p>
        {demo && (
          <p className="muted">
            Demo: {demo.name} · {demo.appointments} atendimentos · {demo.clients} clientes ·{" "}
            {demo.professionals.length} profissionais
          </p>
        )}
      </section>

      {error && <div className="error">{error}</div>}
      {pending && !dash && <p className="muted">Carregando cockpit…</p>}

      {k && (
        <section className="panel">
          <h2>Yield KPIs</h2>
          <div className="grid">
            <div className="kpi">
              <div className="label">Ocupação</div>
              <div className="value">{pct(k.occupancy_rate)}</div>
            </div>
            <div className="kpi">
              <div className="label">No-show</div>
              <div className="value">{pct(k.no_show_rate)}</div>
            </div>
            <div className="kpi">
              <div className="label">Confirmação</div>
              <div className="value">{pct(k.confirmation_rate)}</div>
            </div>
            <div className="kpi">
              <div className="label">Receita perdida</div>
              <div className="value">{brl(k.lost_revenue)}</div>
            </div>
            <div className="kpi">
              <div className="label">Recuperável</div>
              <div className="value">{brl(k.recoverable_revenue)}</div>
            </div>
            <div className="kpi">
              <div className="label">Buracos</div>
              <div className="value">{k.idle_slots}</div>
            </div>
          </div>
          <p className="notice">{dash?.disclaimer}</p>
        </section>
      )}

      <div className="two-col">
        <section className="panel">
          <h2>Receita perdida por semana</h2>
          {dash && <LostRevenueChart data={dash.weekly_lost_revenue} />}
        </section>

        <section className="panel">
          <h2>Ações de recuperação</h2>
          {actions?.actions.map((a) => (
            <div className="action-card" key={a.id}>
              <div className="action-meta">
                <span className={`badge ${a.priority}`}>{a.priority}</span>
                <strong>{brl(a.impact_brl)}</strong>
                <span className="muted">{a.owner}</span>
              </div>
              <h3>{a.title}</h3>
              <p className="muted" style={{ margin: 0 }}>
                {a.detail}
              </p>
            </div>
          ))}
          {actions && (
            <p className="notice">
              Impacto estimado total: <strong>{brl(actions.estimated_recoverable_brl)}</strong>
            </p>
          )}
        </section>
      </div>

      <section className="panel">
        <h2>No-show risk board</h2>
        {risk && (
          <p className="muted" style={{ marginTop: 0 }}>
            High {risk.high_risk_count} · Medium {risk.medium_risk_count} · Low{" "}
            {risk.low_risk_count}
          </p>
        )}
        <table>
          <thead>
            <tr>
              <th>Cliente</th>
              <th>Serviço</th>
              <th>Risco</th>
              <th>Ticket</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {risk?.clients.slice(0, 10).map((c) => (
              <tr key={`${c.client_id}-${c.starts_at}`}>
                <td>
                  {c.client_name}
                  <div className="muted">
                    {c.professional} · {c.prior_no_shows} faltas prévias
                  </div>
                </td>
                <td>{c.service}</td>
                <td>
                  <span className={`badge ${c.risk_band}`}>
                    {c.risk_band} · {(c.risk_score * 100).toFixed(0)}
                  </span>
                </td>
                <td>{brl(c.ticket)}</td>
                <td>{c.recommended_action}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {risk && <p className="notice">{risk.methodology_note}</p>}
      </section>

      <div className="two-col">
        <section className="panel">
          <h2>Ocupação por profissional</h2>
          <table>
            <thead>
              <tr>
                <th>Profissional</th>
                <th>Ocupação</th>
                <th>No-shows</th>
                <th>Perda</th>
              </tr>
            </thead>
            <tbody>
              {dash?.occupancy_by_professional.map((p) => (
                <tr key={p.professional}>
                  <td>{p.professional}</td>
                  <td>{pct(p.occupancy_rate)}</td>
                  <td>{p.no_shows}</td>
                  <td>{brl(p.lost_revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="panel">
          <h2>Lista de confirmação</h2>
          <table>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Quando</th>
                <th>Canal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {dash?.confirmation_queue.map((c) => (
                <tr key={c.appointment_id}>
                  <td>
                    {c.client_name}
                    <div className="muted">{c.professional}</div>
                  </td>
                  <td>
                    {new Date(c.starts_at).toLocaleString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    <div className="muted">{c.hours_until.toFixed(0)}h</div>
                  </td>
                  <td>{c.channel}</td>
                  <td>{c.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <section className="panel">
        <h2>Lista de encaixe</h2>
        <table>
          <thead>
            <tr>
              <th>Slot</th>
              <th>Profissional</th>
              <th>Início</th>
              <th>Ticket est.</th>
              <th>Waitlist</th>
            </tr>
          </thead>
          <tbody>
            {dash?.fill_in_slots.map((s) => (
              <tr key={s.slot_id}>
                <td>{s.slot_id}</td>
                <td>{s.professional}</td>
                <td>
                  {new Date(s.starts_at).toLocaleString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>{brl(s.estimated_ticket)}</td>
                <td>{s.waitlist_candidates}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </main>
  );
}
