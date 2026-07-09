from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api import actions, dashboard, demo, health, methodology, risk

app = FastAPI(
    title="AgendaYield API",
    description=(
        "Agenda yield cockpit for service businesses: occupancy, no-show risk, "
        "confirmation backlog, idle capacity and recovery actions."
    ),
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(demo.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(risk.router, prefix="/api")
app.include_router(actions.router, prefix="/api")
app.include_router(methodology.router, prefix="/api")
