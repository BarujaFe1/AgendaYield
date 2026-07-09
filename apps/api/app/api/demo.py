from fastapi import APIRouter

from app.models.schemas import DemoSummary
from app.services.demo_data import load_demo_summary

router = APIRouter(tags=["demo"])


@router.get("/demo", response_model=DemoSummary)
async def demo_dataset():
    """Return summary of the synthetic studio agenda demo dataset."""
    return load_demo_summary()
