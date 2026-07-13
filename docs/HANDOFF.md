# AgendaYield — Handoff

## Branch
`chore/portfolio-quality-pass`

## What was found
- Thin but coherent MVP lab (Next.js client engine + optional FastAPI).
- Public demo already on GitHub Pages.
- Gaps: no Vitest coverage, no CI beyond Pages, ruff unused imports, monolithic page, weak loading/empty/a11y, docs skewed to marketing only.
- Secrets: `.env.local` / `.vercel` present locally but **gitignored** — no commit of tokens.

## What was fixed / improved
- Ruff F401 cleanup in API.
- Exported `riskScore` / `band`; documented weekend parity TS↔Python.
- Single cockpit bundle cache in `lib/api.ts` (`fetchCockpit`).
- Vitest suite for yield engine formulas.
- ESLint config for `next lint`.
- UX: LAB banner, section nav, KPI hints, skeleton, empty states, table captions/`scope`, method panel, mobile table scroll.
- Root `package.json` scripts; CI workflow (web + api).
- Docs: AUDIT_REPORT, ARCHITECTURE, TECHNICAL_DECISIONS, TESTING, DEPLOYMENT; README rewrite.

## Commands run
- `npm run typecheck` / `npm run build` (web) — pre-pass green
- `pytest -q` (api) — 4 passed
- `ruff check --fix` — cleaned
- Post-pass: install vitest/eslint-config-next, `npm test`, lint, typecheck, build (see below in final verification)

## Still missing / residual risks
- Screenshots remain procedural placeholders (not product photography).
- Dual-engine drift if future score changes aren’t mirrored.
- Vercel Hobby quota can still block CLI deploys; Pages is canonical.
- No E2E browser tests.
- Recoverable revenue remains a labeled estimate (55%).

## Portfolio suggestions
- Keep card **lab: true / featured: false** until richer UI captures exist.
- Demo URL: https://barujafe1.github.io/AgendaYield/
- Pitch: yield/no-show ROI, not calendar replacement.

## Suggested commit message
```text
chore: improve portfolio quality, docs, tests and stability
```

## Next steps
1. Merge branch after CI green.
2. Optionally re-deploy Vercel when quota allows.
3. Capture real UI screenshots from Pages demo into `assets/screenshots/`.
4. Add portfolio card caveats if not already present on the personal site.
