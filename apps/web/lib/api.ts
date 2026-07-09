import {
  buildActions,
  buildDashboard,
  buildRiskBoard,
  loadAppointments,
  summarizeDemo,
} from "@/lib/engine/yield";
import type {
  ActionsResponse,
  DashboardResponse,
  DemoSummary,
  RiskBoardResponse,
} from "@/types";

let cached: Awaited<ReturnType<typeof loadAppointments>> | null = null;

async function rows() {
  if (!cached) cached = await loadAppointments();
  return cached;
}

/** Client-side lab API — no remote Python required for the live demo. */
export async function fetchDemo(): Promise<DemoSummary> {
  return summarizeDemo(await rows());
}

export async function fetchDashboard(): Promise<DashboardResponse> {
  return buildDashboard(await rows());
}

export async function fetchRiskBoard(): Promise<RiskBoardResponse> {
  return buildRiskBoard(await rows());
}

export async function fetchActions(): Promise<ActionsResponse> {
  const data = await rows();
  const dash = buildDashboard(data);
  const risk = buildRiskBoard(data);
  return buildActions(dash, risk);
}
