# AgendaYield — Technical Decisions

## ADR-001 — Frontend-first public demo
**Decision:** Ship the live demo as a Next.js static app that computes yield analytics client-side.  
**Why:** Pages/Vercel static hosting is free/stable; no API cold starts; recruiter UX.  
**Trade-off:** Dual implementation (TS + Python) needs parity discipline.

## ADR-002 — Interpretable heuristic score (not ML)
**Decision:** Use transparent weights (prior no-shows, confirmation, lead time, weekend/evening).  
**Why:** Portfolio clarity + responsible analytics; easy to defend in interviews.  
**Trade-off:** Not calibrated on real production outcomes.

## ADR-003 — Synthetic seed only in public paths
**Decision:** Demo uses `studio_agenda_demo` only; uploads stay gitignored.  
**Why:** No PII / medical risk; reproducible demos.  
**Trade-off:** Screenshots/KPIs are illustrative.

## ADR-004 — Recoverable revenue as an estimate
**Decision:** Recoverable ≈ 55% of high-risk pending ticket sum.  
**Why:** Makes ROI tangible without claiming causal certainty.  
**Trade-off:** Must be labeled as estimate in UI/docs.

## ADR-005 — Naive appointment timestamps
**Decision:** Seed timestamps omit `Z` and are treated as local wall-clock.  
**Why:** Matches how small businesses think about “10:00 na agenda”.  
**Trade-off:** Week keys / local display can shift across timezones — acceptable for lab.

## ADR-006 — GitHub Pages + Vercel readiness
**Decision:** Pages is the stable public URL; Vercel project `agenda-yield` (root `apps/web`) remains configured for future Hobby deploys.  
**Why:** Hobby daily deploy quotas previously blocked Vercel publish.
