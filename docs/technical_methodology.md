# AgendaYield — Technical Methodology

## Risk score (MVP)
Interpretable heuristic in `[0, 1]`:

| Signal | Effect |
|---|---|
| `prior_no_shows` | +0.14 per prior event (capped) |
| confirmation `pending` | +0.22 |
| confirmation `declined` | +0.35 |
| lead time < 12h | +0.08 |
| lead time > 96h | +0.05 |
| weekend | +0.04 |
| evening (>= 18h) | +0.03 |

Bands:
- **high** ≥ 0.65
- **medium** ≥ 0.40
- **low** < 0.40

## Yield KPIs
- **Occupancy** = attended / (total - cancelled)
- **No-show rate** = no_shows / total
- **Lost revenue** = sum(ticket) for no_show + cancelled
- **Recoverable revenue** ≈ 55% of high-risk pending tickets (portfolio estimate)

## Architecture
- `apps/api` FastAPI services compute dashboard, risk board and actions from CSV seed
- `apps/web` Next.js cockpit consumes REST endpoints
- No secrets required for local demo

## Responsible boundaries
AgendaYield is an operational analytics product for service businesses. It must not store clinical notes or sensitive medical data in the MVP, and it does not automate individual credit-like decisions.
