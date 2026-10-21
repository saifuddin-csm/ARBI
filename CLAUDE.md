@AGENTS.md

# ARBI storefront — rules for Claude Code

ARBI is a **menswear-only** brand: no women's products, collections or copy. The main
nav is Home · Shop · Collections · Accessories.

ARBI is a clothing brand's online store. `docs/BUILD_PLAN.md` is the source of truth;
read the relevant section before starting a milestone.

## Hard rules

- **Reference-site rule.** Replicate the STRUCTURE and UX of the reference store described
  in the plan (section order, menus, drawers, filters, product-page flow). Never copy the
  reference brand's logo, images, videos, product text, taglines, brand statements or
  source code. Write all code from scratch; use ARBI assets or clearly marked placeholders.
- **Stack:** Next.js (App Router, TypeScript strict), Tailwind CSS v4, Zustand, Embla
  Carousel, React Hook Form + Zod, Lucide icons. Static export for GitHub Pages.
- **Data access only through `src/lib/api`.** Mock JSON in `content/` now, real backend
  (Medusa v2) in Phase 2. Components and pages never import JSON directly.
- **Mobile-first, WCAG 2.2 AA, Lighthouse mobile >= 90.** Visible focus rings,
  keyboard-operable drawers/menus/modals (focus trap + Esc), alt text on every image,
  respect `prefers-reduced-motion` (hero video pauses).
- **Prices via `formatPrice()`** (`src/lib/utils/formatPrice.ts`). Default currency BDT (৳).
  Prices are stored as **whole taka, VAT-inclusive** (1290 = ৳1,290).
- **Milestones** (plan section "Milestones for Claude Code") are an internal checklist; the
  Phase 1 demo is built in one run without stopping between them. After each milestone:
  run `npm run lint`, `npm run typecheck`, `npm test`, `npm run format:check`,
  `npm run build`; commit. At the end, push and summarise what to check on the preview.
- **Home page is a brand overview** (hero, category tiles, campaign banners, editorial,
  edits, lookbook, brand statement), modelled on the reference store's home. It must not
  show product names, prices, ratings or colours.
- **Images and videos are swappable placeholders.** Most slots currently hold stand-in
  Pexels photos listed in `docs/stock-photos.json` / `docs/CREDITS.md`. Content JSON references real paths
  under `/images/...` and `/videos/...`. At build time `src/lib/api` uses the real file if
  it exists in `public/` (any of .webp/.avif/.jpg/.jpeg/.png), otherwise the generated SVG
  in `/placeholders/...` (`scripts/generate-placeholders.mjs`, runs before dev/build).
  `docs/ASSETS.md` lists every expected filename.

## Key decisions

- **Static export:** `next.config.ts` has `output: 'export'`, `trailingSlash: true`,
  `images.unoptimized: true`, and `basePath`/`assetPrefix` from `NEXT_PUBLIC_BASE_PATH`.
  CI fills it from `actions/configure-pages` (`/<repo-name>`); it is empty locally and
  on a custom domain. `cacheComponents` is intentionally off (no server at runtime).
- **No server-only features:** no Server Actions, cookies, headers, redirects, rewrites,
  proxy/middleware, ISR or route handlers that read the request. Every dynamic route
  (`/products/[slug]`, `/collections/[slug]`) needs `generateStaticParams` fed by
  `src/lib/api`, with `dynamicParams = false`.
- **Search, filters and sort run in the browser:** read query params in a client
  component wrapped in `<Suspense>`; filters sync to the URL.
- **Assets from `public/`:** `next/link` adds basePath itself, but raw `<img>`, `<video>`,
  CSS urls and mock-data image paths must go through `assetPath()`
  (`src/lib/utils/assetPath.ts`). Optimise images before committing (WebP/AVIF, max 2000 px).
- **Theme tokens** live only in `src/styles/globals.css` (`--color-bg`, `--color-text`,
  `--color-muted`, `--color-line`, `--color-accent`, `--color-sale`, `--radius`,
  `--container`, fonts). Components use the matching Tailwind utilities (`bg-bg`,
  `text-muted`, `border-line`, `bg-accent`, `text-sale`, `rounded-brand`, `font-display`,
  `container-page`, `label-caps`), never raw hex values.
- **Design rules:** white background, black type, photo-first; uppercase nav/buttons/labels
  with 0.08–0.12em tracking (`label-caps`); large light headings; section spacing 64 px
  mobile / 120 px desktop; product images 3:4; banners 2:3 mobile and 21:9 desktop; solid
  black primary buttons, outlined secondary, full-width on mobile; subtle motion only
  (≤300 ms, no bounce). Breakpoints 640/768/1024/1280/1536.
- **Data model:** each colour is its own product linked by `styleGroup`; sizes are variants
  with their own stock. Types in `src/types` match the plan's `Product`, `Collection`,
  `SizeChart`, `HomeSection`, `CartItem`. Home page sections are driven by
  `content/home.json`.
- **State:** Zustand stores in `src/store` (cart, recentlyViewed, demo account + last
  order) persisted to localStorage with `skipHydration`; `StoreHydrator` loads them after
  mount and `useHydrated()` guards UI that depends on them. Guard browser APIs so
  prerendering doesn't touch `window`.
- **Performance (Lighthouse mobile ≥ 90):** keep client JS small. `ProductCard` is
  server-renderable with only `QuickAdd` hydrating; client lists (collection filters) take
  server-rendered cards as props. Drawers/modals that start closed (search, mobile menu,
  filters, size chart, lightbox) load via `next/dynamic` + `useMountOnOpen`. No RHF/Zod on
  components shown on every page. Inter uses `display: "optional"`; the taka sign (৳)
  falls back to installed Bengali system fonts instead of a web font.
- **Forms:** React Hook Form + Zod schemas from `src/lib/schemas` (shared with the Phase 2
  backend). Phase 1 forms validate and show demo confirmations; nothing is sent.
- **Preview build:** `robots: noindex` in root metadata. The site-wide "Preview build"
  banner was removed at the owner's request; demo notes remain on checkout, account and
  form confirmations.
- **Real business details:** ARBI Chattogram (address, email) live in `content/site.json`
  (`support`) and `content/stores.json`. Phone, WhatsApp and opening hours are still
  placeholders.
- **Brand assets:** cut out (transparent) from the owner's raster logo, rendered by
  `<Logo variant=…>`: `arbi-logo` = compact header lockup (wordmark + signature, tagline
  dropped for space), `arbi-logo-full` = full lockup with "Clothes for you", and
  `arbi-logo-white` = full lockup in white ink for the black footer (all in
  `public/brand/`, `.webp` + `.png`). Favicon/apple icon (`src/app/icon.png`,
  `apple-icon.png`) use the "A" with its red swoosh on the brand cream (#F0E9E0). The
  source is only 411 px wide; ask for an SVG before launch.
  Font is Inter as a placeholder; accent `#c8102e` is a placeholder derived from the logo red.

## Layout

```
.github/workflows/deploy.yml  CI: lint, typecheck, unit, format, build, links, e2e, deploy
content/                      mock JSON (products, collections, home, site, nav, pages, ...)
docs/ASSETS.md                generated list of image/video files to upload
public/                       brand/, images/ (uploads), videos/ (uploads), .nojekyll
scripts/                      generate-placeholders, check-links, serve-out
src/app/                      routes (incl. search-index.json route)
src/components/               ui/, layout/, home/, collection/, product/, cart/, checkout/,
                              account/, content/, search/
src/lib/api/                  data access layer (mock now, backend later) + media.ts
src/lib/hooks/                useDialog, useAddToCart, useSearchIndex, useMountOnOpen
src/lib/schemas/              Zod schemas (checkout, auth, contact, track order)
src/lib/utils/                formatPrice, assetPath, catalog (filter/sort/paginate), seo, cn
src/store/                    Zustand stores + StoreHydrator
src/styles/globals.css        Tailwind + design tokens
src/types/                    shared types
tests/unit/                   Vitest + Testing Library
tests/e2e/                    Playwright (mobile + desktop) against the static export
```

## Commands

- `npm run dev` — dev server (generates placeholders first)
- `npm run build` — static export to `out/`
- `npm test` / `npm run test:e2e` — unit / Playwright (build first; set
  `NEXT_PUBLIC_BASE_PATH` the same for build and e2e)
- `npm run check:links` — broken internal link check over `out/`
- `npm run serve` — serve `out/` like GitHub Pages on :4173 (gzip, base path, 404.html)

## Local environment

Node >= 20.9 is required (Next.js 16). `.nvmrc` pins 22, and CI uses Node 22. Locally,
Playwright uses the installed Microsoft Edge (`channel: "msedge"`); CI installs Chromium.
On Windows, set `NEXT_PUBLIC_BASE_PATH` from PowerShell/cmd — Git Bash rewrites `/ARBI`
into a Windows path.
