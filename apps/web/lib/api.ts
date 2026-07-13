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

let cachedRows: Awaited<ReturnType<typeof loadAppointments>> | null = null;
let cachedBundle:
  | {
      demo: DemoSummary;
      dashboard: DashboardResponse;
      risk: RiskBoardResponse;
      actions: ActionsResponse;
    }
  | null = null;

async function rows() {
  if (!cachedRows) cachedRows = await loadAppointments();
  return cachedRows;
}

async function bundle() {
  if (!cachedBundle) {
    const data = await rows();
    const dashboard = buildDashboard(data);
    const risk = buildRiskBoard(data);
    cachedBundle = {
      demo: summarizeDemo(data),
      dashboard,
      risk,
      actions: buildActions(dashboard, risk),
    };
  }
  return cachedBundle;
}

/** Client-side lab API — no remote Python required for the live demo. */
export async function fetchDemo(): Promise<DemoSummary> {
  return (await bundle()).demo;
}

export async function fetchDashboard(): Promise<DashboardResponse> {
  return (await bundle()).dashboard;
}

export async function fetchRiskBoard(): Promise<RiskBoardResponse> {
  return (await bundle()).risk;
}

export async function fetchActions(): Promise<ActionsResponse> {
  return (await bundle()).actions;
}

/** Load all cockpit slices once (preferred for the homepage). */
export async function fetchCockpit() {
  return bundle();
}
