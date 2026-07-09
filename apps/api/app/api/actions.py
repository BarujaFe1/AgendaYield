from fastapi import APIRouter

from app.models.schemas import ActionsResponse
from app.services.yield_analytics import build_actions

router = APIRouter(tags=["actions"])


@router.get("/actions", response_model=ActionsResponse)
async def recovery_actions():
    """Prioritized recovery actions with estimated BRL impact."""
    return build_actions()
