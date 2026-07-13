# AgendaYield — Testing

## Web (Vitest)

```bash
cd apps/web
npm ci
npm test
```

Covers:
- risk score / bands
- occupancy & lost revenue formulas
- risk board prioritization
- recovery actions impact
- demo summary aggregation

Config: `apps/web/vitest.config.ts`  
Suites: `apps/web/lib/engine/*.test.ts`

## API (Pytest)

```bash
cd apps/api
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
pytest -q
ruff check app tests
```

Covers health, demo, dashboard, risk board, actions, methodology endpoints.

## Manual checklist (lab)

1. Open `/` — LAB ONLY banner visible  
2. KPIs render with tooltips/hints  
3. Risk board shows high/medium/low badges  
4. Confirmation queue + fill-in tables scroll on mobile  
5. Method section explains formulas  
6. Broken seed path shows actionable error  

## CI

`.github/workflows/ci.yml` runs web lint/typecheck/test/build and API ruff/pytest.
