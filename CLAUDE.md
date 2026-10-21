@AGENTS.md

# ARBI storefront — rules for Claude Code

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
- **One milestone at a time** (plan section "Milestones for Claude Code"). After each:
  run `npm run lint`, `npm run typecheck`, `npm test`, `npm run format:check`,
  `npm run build`; commit; summarise what changed and what to check on the preview link;
  then stop for review.

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
- **State:** Zustand stores in `src/store` (cart, wishlist, recentlyViewed) persisted to
  localStorage; guard browser APIs so prerendering doesn't touch `window`.
- **Preview build:** `robots: noindex` in root metadata and a "Preview build: no real
  orders" demo banner (`src/components/layout/DemoBanner.tsx`) on every page.
- **Brand assets:** logo at `public/brand/arbi-logo.webp` (+ `.png`), rendered by
  `<Logo />`; favicon/apple icon at `src/app/icon.png` and `src/app/apple-icon.png`.
  Font is Inter as a placeholder; accent `#c8102e` is a placeholder derived from the logo red.

## Layout

```
.github/workflows/deploy.yml  CI: lint, typecheck, test, format, build, deploy to Pages
content/                      mock JSON (products, collections, home, size charts, nav)
public/                       brand/, images/, videos/, .nojekyll
src/app/                      routes
src/components/               ui/, layout/, product/, collection/, cart/, home/
src/lib/api/                  data access layer (mock now, backend later)
src/lib/utils/                formatPrice, assetPath, filters, seo helpers
src/store/                    Zustand stores
src/styles/globals.css        Tailwind + design tokens
src/types/                    shared types
tests/unit/                   Vitest + Testing Library; Playwright e2e arrives in Milestone 7
```

## Local environment

Node >= 20.9 is required (Next.js 16). `.nvmrc` pins 22, and CI uses Node 22.
