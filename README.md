<div align="center">
  <img src="./assets/icon.png" alt="AgendaYield Logo" width="120" height="120" />

  <h1>AgendaYield</h1>
  <p><strong>Yield da agenda para negócios de serviço — ocupação, no-show e receita recuperável.</strong></p>
  <p><em>Agenda yield cockpit for service businesses — occupancy, no-show risk and recoverable revenue.</em></p>

  <p>
    <a href="https://barujafe1.github.io/AgendaYield/"><strong>🌐 Live Demo</strong></a>
    ·
    <a href="./docs/ARCHITECTURE.md">Architecture</a>
    ·
    <a href="./docs/TESTING.md">Testing</a>
    ·
    <a href="./docs/HANDOFF.md">Handoff</a>
  </p>

  <p>
    <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge&logo=nextdotjs" />
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-React-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
    <img alt="FastAPI" src="https://img.shields.io/badge/FastAPI-Optional%20API-009688?style=for-the-badge&logo=fastapi&logoColor=white" />
    <img alt="Lab Only" src="https://img.shields.io/badge/Lab-Only%20Synthetic%20Demo-2DD4A8?style=for-the-badge" />
  </p>
</div>

<p align="center">
  <img src="./assets/hero-cover.png" alt="AgendaYield product overview" width="100%" />
</p>

> **Lab only.** Synthetic studio agenda. **Not** an EMR / medical record system. **Not** production booking software. Public demo computes yield analytics in the browser.

---

## Problem

Small service businesses (esthetics studios, salons, tutors, clinics without heavy EMR needs) lose money when clients forget, fail to confirm, or cancel late. Generic calendars record the booking — they do not show **risk**, **idle capacity**, or **recoverable revenue**.

## Solution

AgendaYield is an **agenda yield cockpit**:

- occupancy & no-show KPIs
- interpretable no-show risk board
- confirmation backlog
- fill-in / waitlist candidates
- recovery actions with estimated BRL impact

## Features

| Area | What you get |
|---|---|
| Yield KPIs | Occupancy, no-show, confirmation, lost & recoverable revenue |
| Risk board | Heuristic score + recommended operational action |
| Confirmation queue | Pending slots ranked by proximity |
| Fill-in list | Idle slots from no-show/cancel |
| Actions | Now / today / this-week playbook with impact estimate |
| Method panel | Formulas & caveats visible in the UI |

## Architecture

```text
Synthetic agenda JSON/CSV
        │
        ├─ apps/web (Next.js)  → client engine → Live Demo
        └─ apps/api (FastAPI)  → optional REST parity
```

Details: [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) · decisions: [docs/TECHNICAL_DECISIONS.md](./docs/TECHNICAL_DECISIONS.md)

## Stack

- **Web:** Next.js 15, React 19, TypeScript, Recharts
- **API (optional):** FastAPI, Pydantic, Pandas
- **Quality:** Vitest, Pytest, Ruff, GitHub Actions CI
- **Deploy:** GitHub Pages (canonical demo), Vercel-ready

## Quick start

### Live demo
https://barujafe1.github.io/AgendaYield/

### Local (same mode as demo)

```bash
cd apps/web
npm ci
npm run dev
```

### Optional API

```bash
python scripts/generate_assets_and_seed.py
cd apps/api
python -m venv .venv
.venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Or on Windows: `start.bat`

### Environment

Copy [`.env.example`](./.env.example). Public lab needs **no secrets**.  
Never commit `.env` / `.env.local`.

## Tests

```bash
# Web engine
cd apps/web && npm test && npm run typecheck && npm run lint && npm run build

# API
cd apps/api && pytest -q && ruff check app tests
```

See [docs/TESTING.md](./docs/TESTING.md) and [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md).

## Trade-offs

| Choice | Benefit | Cost |
|---|---|---|
| Frontend-first demo | Stable public URL | Dual TS/Python engines |
| Heuristic score | Explainable | Not production-calibrated |
| Synthetic seed | Safe / reproducible | Illustrative screenshots |
| Recoverable ≈ 55% | Clear ROI story | Explicitly an estimate |

## Roadmap

- **MVP lab (now):** CSV/demo, cockpit, risk, actions, Pages demo, CI
- **Phase 2:** Google Calendar, automated reminders, deposit/signal templates
- **Phase 3:** demand forecast, payments, multi-unit

## Status

**Lab demo — portfolio quality pass.** Public Pages demo HTTP 200. FastAPI optional. Not production SaaS.

## What this project demonstrates

- Product framing around **economic loss** (empty slots), not “another calendar”
- Interpretable analytics + operational action list
- Frontend-first deploy strategy for reliable demos
- Monorepo hygiene: tests, CI, docs, env safety
- Explicit responsible boundaries (no EMR / no medical data)

## How I’d present this in an interview (5 min)

1. **Buyer pain:** every empty slot is revenue that doesn’t come back.  
2. **Demo:** open KPIs → risk board → confirmation queue → recovery actions.  
3. **Method:** walk the heuristic score weights; stress it’s not black-box ML.  
4. **Engineering:** client engine + optional FastAPI parity; Pages deploy.  
5. **Non-goals:** not competing with full clinic EMR or marketplaces.  
6. **Next:** Calendar sync + reminder automation once yield UX is proven.

## Author

**Felipe Alirio Baruja** · [Portfolio](https://barujafe.vercel.app/) · [GitHub](https://github.com/BarujaFe1) · [LinkedIn](https://www.linkedin.com/in/barujafe/)

## License

MIT — see [LICENSE](./LICENSE).
