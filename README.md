# Festivo Deals

Festival and shopping-event price-comparison site. React 18, TypeScript, Vite, Tailwind CSS 3, React Router 6. **All data is fictional demo data**: no live prices, coupons or affiliates.

## Run
```
npm install
npm run dev        # http://localhost:5173
npm run typecheck
npm run build      # outputs dist/
npm run preview
```
Requires Node 18+. No paid services, database or API keys needed.

## Features
Home, product list (search, category/store/price filters, sorting), product page with price-comparison table, 18 categories, 12 festivals/events, 4 demo stores, About/disclosure, responsive nav, loading/error/empty states, 404.

## Structure
- `src/data.ts`: demo categories, festivals, stores, generated products
- `src/provider.ts`: `DataProvider` interface and demo implementation
- `src/ui.tsx`: layout, product card, price table; `src/pages/pages.tsx`: all pages

## Deploy
`npm run build`, then upload `dist/` to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages). `public/_redirects` handles SPA routing on Netlify/Cloudflare; other hosts need an equivalent rewrite to `index.html`.

## Going live
1. Implement `DataProvider` in `src/provider.ts` against a legitimate feed or affiliate API.
2. Call it through a small server/serverless proxy so API keys stay secret.
3. Show real fetch timestamps, remove demo badges, add affiliate disclosure on `/about`.
4. Move filtering/sorting server-side if the catalogue gets large.
