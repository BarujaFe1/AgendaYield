from pathlib import Path

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
ROOT = Path(__file__).resolve().parents[3]
SEED = ROOT / "data" / "seed" / "studio_agenda_demo.csv"


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_demo_and_dashboard_require_seed():
    assert SEED.exists(), "Run scripts/generate_assets_and_seed.py before tests"
    demo = client.get("/api/demo")
    assert demo.status_code == 200
    body = demo.json()
    assert body["appointments"] > 0
    assert "Studio" in body["name"]

    dash = client.get("/api/dashboard")
    assert dash.status_code == 200
    kpis = dash.json()["kpis"]
    assert 0 <= kpis["occupancy_rate"] <= 1
    assert kpis["lost_revenue"] >= 0


def test_risk_board_and_actions():
    risk = client.get("/api/risk-board")
    assert risk.status_code == 200
    payload = risk.json()
    assert "clients" in payload
    assert payload["high_risk_count"] + payload["medium_risk_count"] + payload[
        "low_risk_count"
    ] >= 0

    actions = client.get("/api/actions")
    assert actions.status_code == 200
    assert actions.json()["estimated_recoverable_brl"] >= 0


def test_methodology():
    res = client.get("/api/methodology")
    assert res.status_code == 200
    assert "EMR" in " ".join(res.json()["out_of_scope"]) or any(
        "EMR" in x or "medical" in x.lower() for x in res.json()["out_of_scope"]
    )
