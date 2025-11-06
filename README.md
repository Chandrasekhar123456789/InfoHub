# InFoHub

Vercel-ready single-page app (React + Vite) with serverless API routes.

## What it contains
- `api/` : Vercel serverless functions (weather, currency, quote)
- `src/` : React app (Weather, Currency, Quote modules)
- `vercel.json` : Vercel configuration
- `server.js` : small local dev server replicating serverless endpoints for convenience
- `package.json` : scripts for dev/build

## Local development (quick)
1. Install dependencies:
   npm install

2. Start local dev (runs local API server + vite):
   npm run dev

   - Local backend runs on http://localhost:3000
   - Vite frontend runs on http://localhost:5173 (proxied to backend for /api)

3. Open http://localhost:5173

## Deploy to Vercel
1. Install Vercel CLI or use the Vercel dashboard.
2. Run `vercel` and follow prompts OR connect this repo to Vercel.
3. The `api/*.js` files will be deployed as serverless functions automatically.

## Notes
- Weather uses wttr.in (no API key)
- Currency uses exchangerate.host (no API key)
- Quotes use api.quotable.io
- Geolocation: app requests browser permission; falls back to Udaipur on denial.
