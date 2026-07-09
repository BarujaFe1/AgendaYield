from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class DemoSummary(BaseModel):
    name: str
    description: str
    appointments: int
    clients: int
    professionals: list[str]
    services: list[str]
    date_start: str
    date_end: str
    path: str
    notice: str


class KpiBundle(BaseModel):
    occupancy_rate: float
    no_show_rate: float
    confirmation_rate: float
    idle_slots: int
    lost_revenue: float
    recoverable_revenue: float
    avg_ticket: float
    appointments_total: int


class ProfessionalOccupancy(BaseModel):
    professional: str
    booked: int
    attended: int
    no_shows: int
    cancelled: int
    occupancy_rate: float
    lost_revenue: float


class RiskClient(BaseModel):
    client_id: str
    client_name: str
    professional: str
    service: str
    starts_at: str
    ticket: float
    risk_score: float
    risk_band: Literal["low", "medium", "high"]
    prior_no_shows: int
    confirmation_status: Literal["pending", "confirmed", "declined"]
    recommended_action: str


class ConfirmationItem(BaseModel):
    appointment_id: str
    client_name: str
    professional: str
    starts_at: str
    channel: str
    status: Literal["pending", "confirmed", "declined"]
    hours_until: float


class RecoveryAction(BaseModel):
    id: str
    title: str
    priority: Literal["now", "today", "this_week"]
    impact_brl: float
    owner: str
    detail: str


class FillInSlot(BaseModel):
    slot_id: str
    professional: str
    starts_at: str
    duration_min: int
    estimated_ticket: float
    waitlist_candidates: int
    reason: str


class DashboardResponse(BaseModel):
    studio_name: str
    period_label: str
    kpis: KpiBundle
    occupancy_by_professional: list[ProfessionalOccupancy]
    confirmation_queue: list[ConfirmationItem]
    fill_in_slots: list[FillInSlot]
    weekly_lost_revenue: list[dict[str, float | str]]
    disclaimer: str


class RiskBoardResponse(BaseModel):
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int
    clients: list[RiskClient]
    methodology_note: str


class ActionsResponse(BaseModel):
    actions: list[RecoveryAction]
    estimated_recoverable_brl: float


class MethodologyResponse(BaseModel):
    title: str
    principles: list[str]
    risk_inputs: list[str]
    out_of_scope: list[str]
    notice: str
