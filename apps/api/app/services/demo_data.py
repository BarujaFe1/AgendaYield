from __future__ import annotations

from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[4]
SEED_PATH = ROOT / "data" / "seed" / "studio_agenda_demo.csv"


def _load_frame() -> pd.DataFrame:
    if not SEED_PATH.exists():
        raise FileNotFoundError(
            f"Demo seed not found at {SEED_PATH}. Run scripts/generate_assets_and_seed.py"
        )
    df = pd.read_csv(SEED_PATH)
    df["starts_at"] = pd.to_datetime(df["starts_at"])
    return df


def load_demo_summary() -> dict:
    df = _load_frame()
    return {
        "name": "Studio Agenda Demo",
        "description": (
            "Synthetic aesthetic studio agenda with confirmations, attendance outcomes "
            "and ticket values for yield / no-show analytics."
        ),
        "appointments": int(len(df)),
        "clients": int(df["client_id"].nunique()),
        "professionals": sorted(df["professional"].unique().tolist()),
        "services": sorted(df["service"].unique().tolist()),
        "date_start": df["starts_at"].min().date().isoformat(),
        "date_end": df["starts_at"].max().date().isoformat(),
        "path": str(SEED_PATH.relative_to(ROOT)).replace("\\", "/"),
        "notice": (
            "Synthetic portfolio demo. No real patient/client records. "
            "Not a medical records system."
        ),
    }


def get_appointments() -> pd.DataFrame:
    return _load_frame()
