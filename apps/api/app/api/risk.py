from fastapi import APIRouter

from app.models.schemas import RiskBoardResponse
from app.services.yield_analytics import build_risk_board

router = APIRouter(tags=["risk"])


@router.get("/risk-board", response_model=RiskBoardResponse)
async def risk_board():
    """No-show risk board with interpretable heuristic scores."""
    return build_risk_board()
