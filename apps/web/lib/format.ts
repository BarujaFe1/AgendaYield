export function brl(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function pct(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

export function priorityLabel(priority: "now" | "today" | "this_week") {
  if (priority === "now") return "Agora";
  if (priority === "today") return "Hoje";
  return "Esta semana";
}
