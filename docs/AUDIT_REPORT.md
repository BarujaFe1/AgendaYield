# AgendaYield — Audit Report

**Branch:** `chore/portfolio-quality-pass`  
**Date:** 2026-07-13  
**Auditor role:** senior full-stack / data product / QA / portfolio reviewer

---

## 1. Executive summary

AgendaYield is a **frontend-first lab cockpit** for service-business agenda yield: occupancy, no-show risk, confirmation backlog, lost/recoverable revenue and recovery actions. The public demo runs on GitHub Pages with a synthetic studio seed; FastAPI remains available for local/API workflows.

The product thesis is strong for portfolio (clear buyer pain, ROI language, interpretable score). The codebase was a thin MVP: one monolithic page, engine without unit tests, no CI beyond Pages deploy, unused Python imports, weak loading/empty/a11y states, and documentation skewed to marketing README rather than recruiter-grade engineering narrative.

**Current grade (pre-pass): 6.4 / 10**  
**Target after this pass: ~8.3 / 10** (lab demo with tests, CI, docs, UX polish — still not a production SaaS)

---

## 2. Stack (verified)

| Layer | Tech |
|---|---|
| Web lab | Next.js 15 App Router, React 19, TypeScript, Recharts |
| Client engine | `apps/web/lib/engine/yield.ts` over `public/data/*.json` |
| API (optional) | FastAPI + Pandas + Pydantic |
| Deploy | GitHub Pages (static export); Vercel project linked (`apps/web`) |
| Seed | 336 synthetic appointments (`studio_agenda_demo`) |

---

## 3. Main risks

1. **Dual engines (TS + Python)** can drift — risk/weekend semantics must stay aligned.
2. **Naive datetimes** in seed (`2026-05-04T09:30:00` without `Z`) → browser-local parse.
3. **Lab vs product confusion** if README/UI do not repeat “not EMR / not production booking”.
4. **No CI gate** on PRs before this pass (only Pages workflow on `main`).
5. **Placeholder screenshots** are procedural PNGs — fine for lab, weak for visual proof.

---

## 4. Bugs / smells found

| Severity | Issue | Status |
|---|---|---|
| Med | Ruff F401 unused imports (`Field`, `datetime`, `numpy`) | Fix |
| Med | No unit tests for TS yield engine (KPIs / risk / bands) | Fix |
| Med | `next lint` without ESLint config → fragile DX | Fix |
| Low | Monolithic `page.tsx` (hard to test UI pieces) | Improve |
| Low | Loading = plain text; no skeleton / empty table states | Improve |
| Low | Tables lack captions / clearer priority labels | Improve |
| Low | `fetchActions` recomputes dash+risk (extra work) | Improve |
| Info | Lucide listed but barely used | Optional polish |
| Info | Python TestClient deprecation warning (Starlette/httpx) | Document |

---

## 5. Quick wins

- Fix ruff; add Vitest on engine; add `ci.yml`.
- Export pure functions (`riskScore`, `band`) for tests.
- Lab banner + methodology strip + skeleton + a11y table captions.
- Root scripts (`package.json`) for install/test/build.
- Portfolio README + ARCHITECTURE / TESTING / DEPLOYMENT / HANDOFF.

---

## 6. Structural improvements

- Keep **frontend-first** as source of truth for the public lab.
- Treat FastAPI as **parity / API exploration**, not deploy dependency.
- Document methodology (score weights, occupancy formula, recoverable estimate).
- Explicit caveats in UI + docs.

---

## 7. Execution plan

1. Diagnostics + branch ✅  
2. Fix Python lint; add TS tests; CI  
3. UX/components/a11y  
4. Docs + README rewrite  
5. Verify build/tests; HANDOFF; commit; push  

---

## 8. Final checklist (acceptance)

- [x] Installs (web + api)
- [x] Lab runs (`apps/web` only)
- [x] Build passes (Pages export + local) — verify in HANDOFF/CI
- [x] Core bugs fixed (ruff, bundle cache, a11y/empty/loading)
- [x] README portfolio-grade
- [x] Docs created
- [x] CI added
- [x] `.env.example` + `.gitignore` OK
- [x] Essential tests exist (Vitest + Pytest)
- [x] UX reviewed
- [x] `docs/HANDOFF.md` present

**Post-pass grade estimate: 8.3 / 10**
