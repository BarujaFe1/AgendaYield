# AgendaYield — Architecture

## Overview

AgendaYield is a **monorepo lab** with two runnable surfaces:

1. **Public lab (source of truth for demo):** `apps/web` — Next.js static/export app that loads synthetic agenda JSON and computes yield KPIs, risk board and recovery actions **in the browser**.
2. **Optional API:** `apps/api` — FastAPI + Pandas for local REST exploration and parity with the client engine.

```text
CSV/JSON seed (synthetic studio agenda)
        │
        ├─► apps/web/public/data/*.json  ──► client engine (yield.ts) ──► cockpit UI
        │
        └─► data/seed/*.csv              ──► FastAPI services           ──► /api/*
```

## Why frontend-first?

- Stable public demo without hosting a Python process (GitHub Pages / Vercel static).
- Instant recruiter click-through.
- FastAPI remains for interviews that dig into API design / pandas analytics.

## Domains

| Concept | Meaning |
|---|---|
| Occupancy | attended / (total − cancelled) |
| No-show rate | no_show / total |
| Lost revenue | sum(ticket) for no_show + cancelled |
| Recoverable | ~55% of high-risk × pending tickets (portfolio estimate) |
| Risk score | interpretable heuristic in `[0,1]` with bands low/medium/high |

## Key modules

### Web
- `lib/engine/yield.ts` — pure analytics functions (+ tests)
- `lib/api.ts` — cockpit facade with single-bundle cache
- `app/page.tsx` — cockpit composition
- `components/*` — KPI grid, chart, skeleton, nav

### API
- `services/yield_analytics.py` — pandas parity of the same KPIs/score
- `services/demo_data.py` — CSV loader
- `api/*` — REST routers (`/dashboard`, `/risk-board`, `/actions`, …)

## Non-goals (MVP lab)

- EMR / medical records
- Marketplace of public bookings
- Real WhatsApp/SMS providers in the public demo
- Multi-tenant auth / billing enforcement
