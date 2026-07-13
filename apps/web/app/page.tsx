"use client";

import { useEffect, useState, useTransition } from "react";
import { CockpitSkeleton } from "@/components/CockpitSkeleton";
import { KpiGrid } from "@/components/KpiGrid";
import { LostRevenueChart } from "@/components/LostRevenueChart";
import { SectionNav } from "@/components/SectionNav";
import { fetchCockpit } from "@/lib/api";
import { brl, pct, priorityLabel } from "@/lib/format";
import type {
  ActionsResponse,
  DashboardResponse,
  DemoSummary,
  RiskBoardResponse,
} from "@/types";

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
        const bundle = await fetchCockpit();
        setDemo(bundle.demo);
        setDash(bundle.dashboard);
        setRisk(bundle.risk);
        setActions(bundle.actions);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load AgendaYield lab data");
      }
    });
  }, []);

  const k = dash?.kpis;
  const loading = pending && !dash && !error;

  return (
    <main>
      <div className="lab-banner" role="note">
        <strong>LAB ONLY</strong>
        <span>
          Dados sintéticos do Studio Aurora. Não é EMR/prontuário. Não é booking de produção.
        </span>
      </div>

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
            {demo.professionals.length} profissionais · {demo.date_start} → {demo.date_end}
          </p>
        )}
        <SectionNav />
      </section>

      {error && (
        <div className="error" role="alert">
          <strong>Falha ao carregar o lab.</strong> {error}
          <div className="error-hint">
            Confira se `apps/web/public/data/studio_agenda_demo.json` existe. Em local:{" "}
            <code>npm run seed</code> na raiz e reinicie o dev server.
          </div>
        </div>
      )}

      {loading && <CockpitSkeleton />}

      {k && dash && (
        <>
          <section className="panel" id="kpis">
            <h2>Yield KPIs</h2>
            <p className="panel-lede">
              {dash.studio_name} · {dash.period_label}
            </p>
            <KpiGrid kpis={k} />
            <p className="notice">{dash.disclaimer}</p>
          </section>

          <div className="two-col">
            <section className="panel" id="revenue">
              <h2>Receita perdida por semana</h2>
              {dash.weekly_lost_revenue.length ? (
                <LostRevenueChart data={dash.weekly_lost_revenue} />
              ) : (
                <p className="empty">Sem perdas registradas no período demo.</p>
              )}
            </section>

            <section className="panel" id="actions">
              <h2>Ações de recuperação</h2>
              {actions?.actions.length ? (
                actions.actions.map((a) => (
                  <div className="action-card" key={a.id}>
                    <div className="action-meta">
                      <span className={`badge ${a.priority}`}>{priorityLabel(a.priority)}</span>
                      <strong>{brl(a.impact_brl)}</strong>
                      <span className="muted">{a.owner}</span>
                    </div>
                    <h3>{a.title}</h3>
                    <p className="muted" style={{ margin: 0 }}>
                      {a.detail}
                    </p>
                  </div>
                ))
              ) : (
                <p className="empty">Nenhuma ação priorizada neste snapshot.</p>
              )}
              {actions && (
                <p className="notice">
                  Impacto estimado total:{" "}
                  <strong>{brl(actions.estimated_recoverable_brl)}</strong>
                </p>
              )}
            </section>
          </div>

          <section className="panel" id="risk">
            <h2>No-show risk board</h2>
            {risk && (
              <p className="muted" style={{ marginTop: 0 }}>
                High {risk.high_risk_count} · Medium {risk.medium_risk_count} · Low{" "}
                {risk.low_risk_count}
              </p>
            )}
            <div className="table-wrap">
              <table>
                <caption className="sr-only">
                  Clientes ranqueados por risco de no-show com ação recomendada
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Cliente</th>
                    <th scope="col">Serviço</th>
                    <th scope="col">Risco</th>
                    <th scope="col">Ticket</th>
                    <th scope="col">Ação</th>
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
            </div>
            {risk && <p className="notice">{risk.methodology_note}</p>}
          </section>

          <div className="two-col">
            <section className="panel" id="occupancy">
              <h2>Ocupação por profissional</h2>
              <div className="table-wrap">
                <table>
                  <caption className="sr-only">Ocupação, no-shows e perda por profissional</caption>
                  <thead>
                    <tr>
                      <th scope="col">Profissional</th>
                      <th scope="col">Ocupação</th>
                      <th scope="col">No-shows</th>
                      <th scope="col">Perda</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.occupancy_by_professional.map((p) => (
                      <tr key={p.professional}>
                        <td>{p.professional}</td>
                        <td>{pct(p.occupancy_rate)}</td>
                        <td>{p.no_shows}</td>
                        <td>{brl(p.lost_revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel" id="confirmations">
              <h2>Lista de confirmação</h2>
              {dash.confirmation_queue.length ? (
                <div className="table-wrap">
                  <table>
                    <caption className="sr-only">
                      Confirmações pendentes ordenadas por proximidade do horário
                    </caption>
                    <thead>
                      <tr>
                        <th scope="col">Cliente</th>
                        <th scope="col">Quando</th>
                        <th scope="col">Canal</th>
                        <th scope="col">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dash.confirmation_queue.map((c) => (
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
                </div>
              ) : (
                <p className="empty">Nenhuma confirmação pendente neste snapshot.</p>
              )}
            </section>
          </div>

          <section className="panel" id="fill-in">
            <h2>Lista de encaixe</h2>
            {dash.fill_in_slots.length ? (
              <div className="table-wrap">
                <table>
                  <caption className="sr-only">
                    Horários ociosos candidatos a encaixe / waitlist
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col">Slot</th>
                      <th scope="col">Profissional</th>
                      <th scope="col">Início</th>
                      <th scope="col">Ticket est.</th>
                      <th scope="col">Waitlist</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dash.fill_in_slots.map((s) => (
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
              </div>
            ) : (
              <p className="empty">Sem buracos elegíveis para encaixe neste snapshot.</p>
            )}
          </section>

          <section className="panel" id="method">
            <h2>Método (lab)</h2>
            <ul className="method-list">
              <li>
                <strong>Ocupação</strong> = attended / (total − cancelled)
              </li>
              <li>
                <strong>Risco</strong> = heurística transparente (faltas prévias, confirmação, lead
                time, fim de semana/noite) — não é ML caixa-preta
              </li>
              <li>
                <strong>Recuperável</strong> ≈ 55% dos tickets high-risk ainda pendentes
                (estimativa de portfólio)
              </li>
              <li>
                <strong>Relógio demo</strong> = ponto médio do período sintético (para ranquear
                confirmações)
              </li>
            </ul>
            <p className="notice">
              Escopo fora: EMR/dado médico, marketplace de reservas, lembretes automáticos reais
              no MVP público.
            </p>
          </section>
        </>
      )}
    </main>
  );
}
