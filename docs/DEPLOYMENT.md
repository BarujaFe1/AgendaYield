# AgendaYield — Deployment

## Live demo (current)

**URL:** https://barujafe1.github.io/AgendaYield/

- Workflow: `.github/workflows/pages.yml`
- Build: `apps/web` with `GITHUB_PAGES=true` → static `out/`
- `next.config.ts` sets `basePath` / `assetPrefix` to `/AgendaYield` only when `GITHUB_PAGES=true`

## Local lab (same mode as Pages)

```bash
cd apps/web
npm ci
npm run dev
```

Open http://localhost:3000

## Optional API

```bash
# from repo root
python scripts/generate_assets_and_seed.py
cd apps/api
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Vercel (ready, quota-sensitive)

Project: `agenda-yield`  
Root directory: `apps/web`  
Framework: Next.js  

```bash
# from repo root (with Vercel CLI auth)
vercel link --project agenda-yield
vercel deploy --prod
```

If Hobby daily deployment quota is exceeded, keep Pages as canonical demo.

## Environment

Copy `.env.example` → `.env.local` only if you need overrides.

```bash
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

Public lab does **not** require API URL (client engine).

## Secrets

Never commit `.env`, `.env.local`, or `.vercel/*.local`.  
`.gitignore` already covers them.
