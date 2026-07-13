import { brl, pct } from "@/lib/format";
import type { KpiBundle } from "@/types";

export function KpiGrid({ kpis }: { kpis: KpiBundle }) {
  const items = [
    { label: "Ocupação", value: pct(kpis.occupancy_rate), hint: "Compareceu / (total − cancelados)" },
    { label: "No-show", value: pct(kpis.no_show_rate), hint: "Faltas / total de eventos" },
    { label: "Confirmação", value: pct(kpis.confirmation_rate), hint: "Confirmados / total" },
    { label: "Receita perdida", value: brl(kpis.lost_revenue), hint: "Tickets de falta + cancelamento" },
    { label: "Recuperável", value: brl(kpis.recoverable_revenue), hint: "~55% dos high-risk pendentes" },
    { label: "Buracos", value: String(kpis.idle_slots), hint: "Slots ociosos (falta/cancelamento)" },
  ];

  return (
    <div className="grid" role="list" aria-label="Yield KPIs">
      {items.map((item) => (
        <div className="kpi" role="listitem" key={item.label} title={item.hint}>
          <div className="label">{item.label}</div>
          <div className="value">{item.value}</div>
          <div className="kpi-hint">{item.hint}</div>
        </div>
      ))}
    </div>
  );
}
