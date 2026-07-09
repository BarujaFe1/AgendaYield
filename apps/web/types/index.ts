export type KpiBundle = {
  occupancy_rate: number;
  no_show_rate: number;
  confirmation_rate: number;
  idle_slots: number;
  lost_revenue: number;
  recoverable_revenue: number;
  avg_ticket: number;
  appointments_total: number;
};

export type ProfessionalOccupancy = {
  professional: string;
  booked: number;
  attended: number;
  no_shows: number;
  cancelled: number;
  occupancy_rate: number;
  lost_revenue: number;
};

export type ConfirmationItem = {
  appointment_id: string;
  client_name: string;
  professional: string;
  starts_at: string;
  channel: string;
  status: "pending" | "confirmed" | "declined";
  hours_until: number;
};

export type FillInSlot = {
  slot_id: string;
  professional: string;
  starts_at: string;
  duration_min: number;
  estimated_ticket: number;
  waitlist_candidates: number;
  reason: string;
};

export type DashboardResponse = {
  studio_name: string;
  period_label: string;
  kpis: KpiBundle;
  occupancy_by_professional: ProfessionalOccupancy[];
  confirmation_queue: ConfirmationItem[];
  fill_in_slots: FillInSlot[];
  weekly_lost_revenue: Array<{ week: string; lost_revenue: number }>;
  disclaimer: string;
};

export type RiskClient = {
  client_id: string;
  client_name: string;
  professional: string;
  service: string;
  starts_at: string;
  ticket: number;
  risk_score: number;
  risk_band: "low" | "medium" | "high";
  prior_no_shows: number;
  confirmation_status: "pending" | "confirmed" | "declined";
  recommended_action: string;
};

export type RiskBoardResponse = {
  high_risk_count: number;
  medium_risk_count: number;
  low_risk_count: number;
  clients: RiskClient[];
  methodology_note: string;
};

export type RecoveryAction = {
  id: string;
  title: string;
  priority: "now" | "today" | "this_week";
  impact_brl: number;
  owner: string;
  detail: string;
};

export type ActionsResponse = {
  actions: RecoveryAction[];
  estimated_recoverable_brl: number;
};

export type DemoSummary = {
  name: string;
  description: string;
  appointments: number;
  clients: number;
  professionals: string[];
  services: string[];
  date_start: string;
  date_end: string;
  path: string;
  notice: string;
};
