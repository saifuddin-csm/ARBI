# ARBI storefront

Phase 1 frontend demo of the ARBI online store: a complete, clickable storefront with mock
data, deployed to GitHub Pages. No real orders or payments — everything checkout-related is
a demo. See [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md) for the full plan and
[`CLAUDE.md`](CLAUDE.md) for the project rules.

**Preview:** https://saifuddin-csm.github.io/ARBI/

## Adding photos and videos

Every image slot currently shows a stand-in stock photo from Pexels (free licence; see
[`docs/CREDITS.md`](docs/CREDITS.md)) or a labelled placeholder. Replace them with ARBI's own photos:

1. Open [`docs/ASSETS.md`](docs/ASSETS.md). It lists every file the site looks for, its
   size, and what it shows (for example `public/images/products/mens-linen-classic-shirt-sand-1.webp`).
2. Save your photo with exactly that name in that folder. `.webp`, `.avif`, `.jpg`,
   `.jpeg` or `.png` all work. Keep the longest side at or under 2000 px.
3. Commit and push. The next deploy shows your photo instead of the placeholder.

Home hero video: add `public/videos/hero.mp4` (10–20 s, muted, under 8 MB) and optionally
`public/videos/hero.webm`. The hero image becomes its poster.

## Editing content

All text, products and page sections live in `content/`:

| File                                                        | What it controls                                                            |
| ----------------------------------------------------------- | --------------------------------------------------------------------------- |
| `products.json`                                             | Products, colours, sizes, stock, prices (whole taka, VAT-inclusive)         |
| `collections.json`                                          | Collections, their filters, banners and card images                         |
| `home.json`                                                 | Home page sections — reorder or edit them here                              |
| `navigation.json`                                           | Mega menu, mobile menu and footer links                                     |
| `site.json`                                                 | Announcement bar, brand statement, delivery rates, contact details, socials |
| `pages.json`, `faq.json`, `size-charts.json`, `stores.json` | About, policies, FAQ, size charts, stores                                   |

## Running locally

Requires Node 20.9+ (Node 22 recommended).

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build      # static export in out/
npm test           # unit tests
npm run test:e2e   # Playwright (after a build)
```

Pushing to `main` runs lint, type checks, unit tests, the build, a broken-link check and
the Playwright checkout flow, then deploys to GitHub Pages.
