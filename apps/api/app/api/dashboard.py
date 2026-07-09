from fastapi import APIRouter

from app.models.schemas import DashboardResponse
from app.services.yield_analytics import build_dashboard

router = APIRouter(tags=["dashboard"])


@router.get("/dashboard", response_model=DashboardResponse)
async def dashboard():
    """Yield cockpit: occupancy, lost revenue, confirmation queue and fill-in slots."""
    return build_dashboard()
