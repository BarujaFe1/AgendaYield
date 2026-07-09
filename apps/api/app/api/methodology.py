from fastapi import APIRouter

from app.models.schemas import MethodologyResponse
from app.services.yield_analytics import build_methodology

router = APIRouter(tags=["methodology"])


@router.get("/methodology", response_model=MethodologyResponse)
async def methodology():
    """Product methodology, risk inputs and explicit out-of-scope boundaries."""
    return build_methodology()
