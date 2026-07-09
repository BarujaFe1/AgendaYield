import type {
  ActionsResponse,
  DashboardResponse,
  DemoSummary,
  RiskBoardResponse,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, { cache: "no-store" });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(detail || `Request failed: ${path}`);
  }
  return res.json();
}

export function fetchDemo(): Promise<DemoSummary> {
  return getJson("/api/demo");
}

export function fetchDashboard(): Promise<DashboardResponse> {
  return getJson("/api/dashboard");
}

export function fetchRiskBoard(): Promise<RiskBoardResponse> {
  return getJson("/api/risk-board");
}

export function fetchActions(): Promise<ActionsResponse> {
  return getJson("/api/actions");
}
