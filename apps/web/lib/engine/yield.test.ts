import { describe, expect, it } from "vitest";
import {
  band,
  buildActions,
  buildDashboard,
  buildRiskBoard,
  riskScore,
  summarizeDemo,
} from "@/lib/engine/yield";
import type { Appointment } from "@/lib/engine/types";

function apt(partial: Partial<Appointment>): Appointment {
  return {
    appointment_id: "APT-1",
    client_id: "CLI-1",
    client_name: "Demo Client",
    professional: "Ana Ribeiro",
    service: "Consulta estética",
    starts_at: "2026-05-05T10:00:00", // Tuesday
    duration_min: 30,
    ticket: 200,
    confirmation_status: "confirmed",
    attendance_status: "attended",
    prior_no_shows: 0,
    lead_time_hours: 48,
    channel: "whatsapp",
    ...partial,
  };
}

describe("riskScore / band", () => {
  it("starts near baseline for a clean confirmed weekday slot", () => {
    const score = riskScore(apt({}));
    expect(score).toBeGreaterThanOrEqual(0.12);
    expect(score).toBeLessThan(0.4);
    expect(band(score)).toBe("low");
  });

  it("raises risk for pending confirmation + prior no-shows", () => {
    const score = riskScore(
      apt({
        confirmation_status: "pending",
        prior_no_shows: 2,
        lead_time_hours: 6,
      }),
    );
    expect(score).toBeGreaterThanOrEqual(0.65);
    expect(band(score)).toBe("high");
  });

  it("floors historical no-shows at 0.55", () => {
    const score = riskScore(apt({ attendance_status: "no_show" }));
    expect(score).toBeGreaterThanOrEqual(0.55);
  });
});

describe("buildDashboard", () => {
  const rows: Appointment[] = [
    apt({
      appointment_id: "A1",
      attendance_status: "attended",
      confirmation_status: "confirmed",
      ticket: 100,
    }),
    apt({
      appointment_id: "A2",
      attendance_status: "no_show",
      confirmation_status: "pending",
      prior_no_shows: 2,
      ticket: 250,
      starts_at: "2026-05-09T19:00:00", // Saturday evening
    }),
    apt({
      appointment_id: "A3",
      attendance_status: "cancelled",
      confirmation_status: "declined",
      ticket: 150,
    }),
    apt({
      appointment_id: "A4",
      attendance_status: "scheduled",
      confirmation_status: "pending",
      prior_no_shows: 3,
      ticket: 400,
      starts_at: "2026-05-20T11:00:00",
    }),
  ];

  it("computes occupancy excluding cancelled from denominator", () => {
    const dash = buildDashboard(rows);
    // attended=1, cancelled=1 → booked = 3, occupancy = 1/3
    expect(dash.kpis.appointments_total).toBe(4);
    expect(dash.kpis.occupancy_rate).toBeCloseTo(1 / 3, 4);
    expect(dash.kpis.lost_revenue).toBeCloseTo(400, 2); // 250 + 150
  });

  it("estimates recoverable from high-risk pending tickets", () => {
    const dash = buildDashboard(rows);
    expect(dash.kpis.recoverable_revenue).toBeGreaterThan(0);
    expect(dash.confirmation_queue.length).toBeGreaterThan(0);
    expect(dash.fill_in_slots.length).toBeGreaterThan(0);
  });
});

describe("buildRiskBoard + actions", () => {
  it("prioritizes scheduled high-risk clients and builds recovery actions", () => {
    const rows = [
      apt({
        appointment_id: "S1",
        attendance_status: "scheduled",
        confirmation_status: "pending",
        prior_no_shows: 3,
        ticket: 500,
      }),
      apt({
        appointment_id: "S2",
        attendance_status: "attended",
        confirmation_status: "confirmed",
        ticket: 120,
      }),
    ];
    const risk = buildRiskBoard(rows);
    expect(risk.high_risk_count).toBeGreaterThanOrEqual(1);
    expect(risk.clients[0]?.risk_band).toBe("high");

    const dash = buildDashboard(rows);
    const actions = buildActions(dash, risk);
    expect(actions.actions.length).toBeGreaterThanOrEqual(2);
    expect(actions.estimated_recoverable_brl).toBeGreaterThan(0);
  });
});

describe("summarizeDemo", () => {
  it("summarizes unique clients and pros", () => {
    const summary = summarizeDemo([
      apt({ client_id: "C1", professional: "Ana Ribeiro" }),
      apt({ client_id: "C2", professional: "Bruno Costa", appointment_id: "X2" }),
      apt({ client_id: "C1", professional: "Ana Ribeiro", appointment_id: "X3" }),
    ]);
    expect(summary.appointments).toBe(3);
    expect(summary.clients).toBe(2);
    expect(summary.professionals).toEqual(["Ana Ribeiro", "Bruno Costa"]);
  });
});
