from __future__ import annotations

import pandas as pd

from app.services.demo_data import get_appointments

DISCLAIMER = (
    "AgendaYield estimates occupancy, no-show risk and recoverable revenue from "
    "synthetic or imported agenda events. It is an operational yield cockpit — "
    "not a clinic EMR, not a marketplace, and not medical advice."
)


def _risk_score(row: pd.Series) -> float:
    """Simple interpretable no-show risk score in [0, 1]."""
    prior = float(row["prior_no_shows"])
    conf = str(row["confirmation_status"])
    lead = float(row["lead_time_hours"])
    # pandas dayofweek: Mon=0 … Sun=6. Weekend = Sat/Sun (5, 6).
    # Keep parity with TS `Date#getDay()` weekend check (0 or 6).
    weekday = int(row["starts_at"].dayofweek)
    hour = int(row["starts_at"].hour)

    score = 0.12 + min(0.45, prior * 0.14)
    if conf == "pending":
        score += 0.22
    elif conf == "declined":
        score += 0.35
    if lead < 12:
        score += 0.08
    elif lead > 96:
        score += 0.05
    if weekday in (5, 6):
        score += 0.04
    if hour >= 18:
        score += 0.03
    if str(row["attendance_status"]) == "no_show":
        # Keep historical truth visible but do not force score to 1 for past rows.
        score = max(score, 0.55)
    return float(min(0.97, max(0.03, score)))


def _band(score: float) -> str:
    if score >= 0.65:
        return "high"
    if score >= 0.40:
        return "medium"
    return "low"


def _action_for(band: str, conf: str) -> str:
    if band == "high" and conf == "pending":
        return "Enviar confirmação urgente + oferecer encaixe se não confirmar"
    if band == "high":
        return "Cobrar sinal / reforçar lembrete e preparar lista de encaixe"
    if band == "medium":
        return "Confirmar por WhatsApp e monitorar até T-4h"
    return "Manter lembrete padrão"


def build_dashboard() -> dict:
    df = get_appointments().copy()
    df["risk_score"] = df.apply(_risk_score, axis=1)
    df["risk_band"] = df["risk_score"].map(_band)

    total = len(df)
    attended = int((df["attendance_status"] == "attended").sum())
    no_shows = int((df["attendance_status"] == "no_show").sum())
    cancelled = int((df["attendance_status"] == "cancelled").sum())
    confirmed = int((df["confirmation_status"] == "confirmed").sum())
    idle = int((df["attendance_status"].isin(["no_show", "cancelled"])).sum())
    lost = float(
        df.loc[df["attendance_status"].isin(["no_show", "cancelled"]), "ticket"].sum()
    )
    recoverable = float(
        df.loc[
            (df["risk_band"] == "high") & (df["confirmation_status"] == "pending"),
            "ticket",
        ].sum()
        * 0.55
    )
    booked_slots = total - cancelled
    occupancy = attended / booked_slots if booked_slots else 0.0

    kpis = {
        "occupancy_rate": round(occupancy, 4),
        "no_show_rate": round(no_shows / total, 4) if total else 0.0,
        "confirmation_rate": round(confirmed / total, 4) if total else 0.0,
        "idle_slots": idle,
        "lost_revenue": round(lost, 2),
        "recoverable_revenue": round(recoverable, 2),
        "avg_ticket": round(float(df["ticket"].mean()), 2),
        "appointments_total": total,
    }

    occ_rows = []
    for pro, g in df.groupby("professional"):
        booked = int(len(g) - (g["attendance_status"] == "cancelled").sum())
        att = int((g["attendance_status"] == "attended").sum())
        ns = int((g["attendance_status"] == "no_show").sum())
        can = int((g["attendance_status"] == "cancelled").sum())
        occ_rows.append(
            {
                "professional": pro,
                "booked": booked,
                "attended": att,
                "no_shows": ns,
                "cancelled": can,
                "occupancy_rate": round(att / booked, 4) if booked else 0.0,
                "lost_revenue": round(
                    float(
                        g.loc[
                            g["attendance_status"].isin(["no_show", "cancelled"]),
                            "ticket",
                        ].sum()
                    ),
                    2,
                ),
            }
        )
    occ_rows.sort(key=lambda r: r["occupancy_rate"])

    now = df["starts_at"].min() + (df["starts_at"].max() - df["starts_at"].min()) / 2
    pending = df[df["confirmation_status"] == "pending"].copy()
    pending["hours_until"] = (pending["starts_at"] - now).dt.total_seconds() / 3600.0
    pending = pending.sort_values("hours_until")
    confirmation_queue = [
        {
            "appointment_id": str(r.appointment_id),
            "client_name": str(r.client_name),
            "professional": str(r.professional),
            "starts_at": r.starts_at.isoformat(),
            "channel": str(r.channel),
            "status": str(r.confirmation_status),
            "hours_until": round(float(r.hours_until), 1),
        }
        for r in pending.head(12).itertuples()
    ]

    fill_src = df[df["attendance_status"].isin(["no_show", "cancelled"])].head(8)
    fill_in_slots = [
        {
            "slot_id": f"SLOT-{i+1:03d}",
            "professional": str(r.professional),
            "starts_at": r.starts_at.isoformat(),
            "duration_min": int(r.duration_min),
            "estimated_ticket": float(r.ticket),
            "waitlist_candidates": int(1 + (i % 4)),
            "reason": "Horário ocioso por falta/cancelamento — candidato a encaixe",
        }
        for i, r in enumerate(fill_src.itertuples())
    ]

    df["week"] = df["starts_at"].dt.to_period("W").astype(str)
    weekly = (
        df.loc[df["attendance_status"].isin(["no_show", "cancelled"])]
        .groupby("week")["ticket"]
        .sum()
        .reset_index()
    )
    weekly_lost = [
        {"week": str(r.week), "lost_revenue": round(float(r.ticket), 2)}
        for r in weekly.itertuples()
    ]

    return {
        "studio_name": "Studio Aurora Aesthetic",
        "period_label": f"{df['starts_at'].min().date()} → {df['starts_at'].max().date()}",
        "kpis": kpis,
        "occupancy_by_professional": occ_rows,
        "confirmation_queue": confirmation_queue,
        "fill_in_slots": fill_in_slots,
        "weekly_lost_revenue": weekly_lost,
        "disclaimer": DISCLAIMER,
    }


def build_risk_board() -> dict:
    df = get_appointments().copy()
    df["risk_score"] = df.apply(_risk_score, axis=1)
    df["risk_band"] = df["risk_score"].map(_band)
    upcoming = df[df["attendance_status"] == "scheduled"].copy()
    if upcoming.empty:
        upcoming = df.copy()
    upcoming = upcoming.sort_values("risk_score", ascending=False)

    clients = [
        {
            "client_id": str(r.client_id),
            "client_name": str(r.client_name),
            "professional": str(r.professional),
            "service": str(r.service),
            "starts_at": r.starts_at.isoformat(),
            "ticket": float(r.ticket),
            "risk_score": round(float(r.risk_score), 3),
            "risk_band": str(r.risk_band),
            "prior_no_shows": int(r.prior_no_shows),
            "confirmation_status": str(r.confirmation_status),
            "recommended_action": _action_for(str(r.risk_band), str(r.confirmation_status)),
        }
        for r in upcoming.head(20).itertuples()
    ]
    bands = upcoming["risk_band"].value_counts().to_dict()
    return {
        "high_risk_count": int(bands.get("high", 0)),
        "medium_risk_count": int(bands.get("medium", 0)),
        "low_risk_count": int(bands.get("low", 0)),
        "clients": clients,
        "methodology_note": (
            "Risk score is a transparent heuristic: prior no-shows, confirmation lag, "
            "lead time, weekend/evening slots. Portfolio MVP — not a black-box ML model."
        ),
    }


def build_actions() -> dict:
    risk = build_risk_board()
    dash = build_dashboard()
    actions = []
    high = [c for c in risk["clients"] if c["risk_band"] == "high"]
    if high:
        impact = round(sum(c["ticket"] for c in high[:5]) * 0.5, 2)
        actions.append(
            {
                "id": "ACT-001",
                "title": "Confirmar clientes high-risk pendentes",
                "priority": "now",
                "impact_brl": impact,
                "owner": "Recepção",
                "detail": f"{len(high)} horários com risco alto — priorizar WhatsApp/SMS.",
            }
        )
    if dash["fill_in_slots"]:
        impact = round(sum(s["estimated_ticket"] for s in dash["fill_in_slots"][:4]) * 0.4, 2)
        actions.append(
            {
                "id": "ACT-002",
                "title": "Abrir lista de encaixe para buracos",
                "priority": "today",
                "impact_brl": impact,
                "owner": "Gestor de agenda",
                "detail": "Oferecer horários ociosos para waitlist e clientes flexíveis.",
            }
        )
    actions.append(
        {
            "id": "ACT-003",
            "title": "Revisar ocupação por profissional",
            "priority": "this_week",
            "impact_brl": round(dash["kpis"]["lost_revenue"] * 0.15, 2),
            "owner": "Dono / gestor",
            "detail": "Rebalancear grade e campanhas nos profissionais com mais ociosidade.",
        }
    )
    actions.append(
        {
            "id": "ACT-004",
            "title": "Ativar depósito/sinal em serviços de ticket alto",
            "priority": "this_week",
            "impact_brl": round(dash["kpis"]["avg_ticket"] * 6, 2),
            "owner": "Financeiro",
            "detail": "Reduzir no-show em procedimentos acima do ticket médio.",
        }
    )
    return {
        "actions": actions,
        "estimated_recoverable_brl": round(sum(a["impact_brl"] for a in actions), 2),
    }


def build_methodology() -> dict:
    return {
        "title": "AgendaYield methodology",
        "principles": [
            "Yield first: maximize occupied paid slots, not just booking volume.",
            "Every empty slot has an economic cost (lost revenue).",
            "Confirmation and attendance history are first-class signals.",
            "Actions must be operationally executable by a small studio team.",
            "No medical records / EMR scope in the MVP.",
        ],
        "risk_inputs": [
            "prior_no_shows",
            "confirmation_status",
            "lead_time_hours",
            "weekday / evening slot",
            "ticket value (for recovery prioritization)",
        ],
        "out_of_scope": [
            "Full clinic EMR / sensitive medical data",
            "Marketplace of public bookings",
            "Replacing Google Calendar as system of record in phase 1",
            "Black-box credit-style ML scoring without explainability",
        ],
        "notice": DISCLAIMER,
    }
