# ARBI Website — Build Plan for Claude Code

Oct 21, 2026 · @Saifuddin Sabbir

## Overview and goals

We are building the ARBI online store in three phases: a clickable frontend demo on GitHub Pages first, then a real backend, then security hardening and launch. The layout and shopping flow follow the ARKS store (arks.club) closely; everything visible is ARBI's own.

| Phase | Outcome | Hosting |
| --- | --- | --- |
| 1. Frontend demo | Full storefront with mock products, working cart, demo checkout. Shareable link for the team. | GitHub Pages (static) |
| 2. Backend | Real products, inventory, customers, orders, payments, delivery, admin panel. | VPS or managed cloud |
| 3. Security and launch | Hardened, monitored, legally compliant store on the ARBI domain. | Production + Cloudflare |

**Reference-site rule (important for Claude Code).** Copy the *structure and UX patterns* of ARKS: page layout, section order, menus, drawers, filters, product-page flow. Do **not** copy ARKS's logo, photos, videos, product descriptions, taglines, brand statements, or theme source code. Write all code fresh and use ARBI's own assets and text, or clearly marked placeholders. This keeps ARBI legally safe and gives it its own identity.

**Key architecture decision.** The frontend talks to data only through one API layer (`src/lib/api`). In Phase 1 that layer reads local JSON files; in Phase 2 it calls the real backend. No page component changes when the backend arrives.

## What the ARKS site does (structure to replicate)

ARKS is a Shopify store with a minimal, image-led "quiet luxury" look: white background, black type, uppercase navigation, large photography and very little decoration. Reviewed on 21 Oct 2026.

**Header and navigation**

- Logo, then top nav: Home · Men · Women · Collections · Fragrance · Footwear. Right side: search icon, account icon, cart icon with item count.
- Men and Women open a **mega menu** grouped into columns: Top wear (tees, shirts, polos), Bottom wear (joggers, denim, shorts, pants), Outer wear (sweatshirts, jackets), plus Dresses (women) and themed "Edit" collections.
- Mobile: hamburger opens a **slide-in drawer** with drill-down levels (tap Men → Topwear → Shirts, each level has Back and "View all"), secondary links (About, Contact, Store locator), "Shop by collection" links and social icons.
- Search opens as a **side drawer** with a live search box. Cart opens as a **side drawer** too.

**Homepage, top to bottom**

1. Full-screen **hero video** (two clips, autoplay, muted, looping).
2. **Two split tiles**: "For Him" and "For Her", each a tall image with a heading and an Explore button.
3. **Campaign banner** for one category (footwear), with separate art for mobile (2:3, 1080×1620) and desktop (21:9, 2560×1080).
4. **Colour-way row**: four cards, one per colour of a hero product, each linking to that product.
5. **Second campaign banner** (fragrance) with a one-line tagline.
6. **Three collection cards** (themed "Edits"), each with an image, name and short tagline.
7. **Shop the look**: one lifestyle photo beside a small carousel of the products worn in it, each with Add to bag.
8. Brand statement line, then a **trust strip** of five badges: free shipping, easy returns, secure payment, customer support, cash on delivery.
9. **Footer**: Quick links (Home, About, Contact, FAQ, Store locator), Policies (Privacy, Refunds, Shipping, Terms), Shop by collection, customer support address/email/phone, social icons, copyright.

**Collection page (product listing)**

- Title + product count; Filter button and Sort dropdown (Best selling, Price low→high, Price high→low).
- Filter drawer: Availability, Price range (from/to), Material, Size (letter and waist sizes), Color, Gender, Category, Style; with Clear all and Apply.
- Product grid (4 columns desktop, 2 mobile). Card: main image, **second image on hover**, "Add to bag" quick button, small **colour links** to sibling colours, star rating + count, title, price, "Sold out" badge.
- Numbered pagination (Previous, 1 2 3, Next).

**Product page**

- Image gallery (about 5 photos) on the left; details on the right.
- Title, small attribute tags (fabric, occasion, weight), price with "inclusive of all taxes" note, short one-line description.
- **Colour selector**: each colour is a separate product page; swatches link between them.
- Size buttons (S–XXL) and a **Size chart modal** with three tabs: size table (CM/Inches toggle), How to measure (illustration + numbered steps), and size FAQs.
- Quantity, Add to cart, Buy now (express checkout).
- Three trust badges (delivery time, returns, secure payment).
- Accordions: About the product, Product details (origin, manufacturer), Shipping and returns.
- **Sticky mini add-to-cart bar** on scroll, a short brand note block, then the footer.

**Cart drawer**

- Empty state with Continue shopping; line items; order instructions (note) field; free shipping and returns reminders; total with tax note; View cart and Checkout buttons.

## ARBI sitemap and page specs

Phase 1 builds every page below with mock data; pages marked "demo" show realistic UI but do not save anything real.

| Route | Page | Phase 1 |
| --- | --- | --- |
| `/` | Home | Full |
| `/collections/[slug]` | Collection listing (men, women, shirts, tees, all, etc.) | Full: filters, sort, pagination client-side |
| `/products/[slug]` | Product detail | Full: gallery, colours, sizes, size chart, add to cart |
| `/cart` | Cart page | Full (cart saved in browser) |
| `/checkout` | Checkout | Demo: form + order summary, fake "order placed" screen |
| `/search?q=` | Search results | Full (searches mock JSON) |
| `/account/login`, `/account/register` | Login / register | Demo UI only |
| `/account` | My orders, addresses, profile | Demo with sample orders |
| `/track-order` | Order tracking | Demo (order no. + phone/email) |
| `/pages/about` | About ARBI | Full (placeholder copy) |
| `/pages/contact` | Contact form + details | Demo form |
| `/pages/faq` | FAQ accordion | Full |
| `/pages/store-locator` | Stores list + map embed | Full (if ARBI has stores; else hide) |
| `/pages/size-guide` | All size charts | Full |
| `/policies/privacy`, `/refund`, `/shipping`, `/terms` | Legal pages | Placeholder text, marked DRAFT |
| `/404` | Not found | Full |

**Global components (every page)**

- Announcement bar (optional, dismissible): e.g. free delivery threshold or launch offer.
- Header: logo, desktop mega menu, search drawer, account link, cart drawer with count badge. Becomes compact and sticky on scroll.
- Mobile drawer menu with drill-down levels, Back buttons, "View all" at each level, social icons.
- Footer: brand line, trust strip (5 badges), Quick links, Policies, Shop by collection, Customer support (address, email, phone/WhatsApp), socials, payment-method icons, copyright.
- Demo banner on Phase 1 only: "Preview build: no real orders".

**Home page sections (ARBI version)**

1. Hero: autoplay muted looping video (MP4/WebM + poster image), headline + CTA. Falls back to an image if no video.
2. Split tiles: "ARBI for Him" / "ARBI for Her" → men and women landing.
3. Campaign banner 1 (configurable category), separate mobile 2:3 and desktop 21:9 images.
4. Colour-way or featured-products row (4 cards, horizontal scroll on mobile).
5. Campaign banner 2 (configurable).
6. Collection cards: three ARBI collections with ARBI's own names and taglines.
7. Shop the look: lookbook image + carousel of linked products with quick add.
8. New arrivals / best sellers carousel (ARBI addition).
9. Brand statement + trust strip, then footer.

All home sections are driven by one config file (`content/home.json`) so the order and content can change without code edits, and later from the admin panel.

**Collection page** — banner (optional), breadcrumb, title + count, filter drawer (availability, price range, size, colour, category, fabric, fit/style, gender), sort (featured, best selling, newest, price ↑, price ↓), 2/3/4-column grid, product cards with hover image, quick add (opens size picker), colour dots, rating, price/sale price, Sold out / New / Sale badges, pagination of 24 per page. Filters sync to the URL query so links can be shared.

**Product page** — gallery (thumbnails + swipe on mobile + click to zoom/fullscreen), title, tags, price (sale price with strike-through), "VAT included" note, colour swatches linking sibling products, size buttons with out-of-stock sizes crossed out, size chart modal (table with CM/Inch toggle, how to measure, FAQs), quantity, Add to cart, Buy now, delivery estimate, trust badges, accordions (description, fabric and care, shipping and returns), sticky add-to-cart bar, "You may also like", "Recently viewed", reviews section (static in Phase 1).

**Cart drawer** — slides in after Add to cart, line items with size/colour, quantity stepper, remove, order note, free-delivery progress bar, subtotal, View cart, Checkout.

## Design system

The look is minimal and photo-first, like ARKS, but every value lives in one theme file so ARBI's brand colours and fonts drop in later without touching components.

**Brand tokens (placeholders until ARBI's brand guide arrives)**

| Token | Placeholder value | Use |
| --- | --- | --- |
| `--color-bg` | #FFFFFF | Page background |
| `--color-text` | #111111 | Body text, icons |
| `--color-muted` | #6B6B6B | Secondary text, labels |
| `--color-line` | #E5E5E5 | Borders, dividers |
| `--color-accent` | ARBI brand colour (TBD) | Buttons, badges, links on hover |
| `--color-sale` | #B42318 | Sale price, error states |
| `--font-display` | TBD (e.g. a geometric or grotesk sans) | Logo-adjacent headings, nav, uppercase labels |
| `--font-body` | TBD (e.g. Inter or similar) | Body, prices, forms |
| `--radius` | 0–4 px | Sharp, premium feel |
| `--container` | 1440 px max, 16 px mobile gutter, 40 px desktop | Layout width |

**Rules**

- Navigation, buttons and section labels in uppercase with 0.08–0.12em letter spacing.
- Headings large and light; generous whitespace (section spacing 64 px mobile, 120 px desktop).
- Photography carries the page: product images at 3:4 portrait, campaign banners at 2:3 (mobile) and 21:9 (desktop).
- Buttons: solid black primary, outlined secondary, full-width on mobile.
- Motion: subtle only — image fade/zoom on hover (≤300 ms), drawer slide-ins, no bouncing.
- Breakpoints: 640 / 768 / 1024 / 1280 / 1536 px. Mobile-first; most traffic will be phones.
- Currency formatting through one helper (`formatPrice`), default ৳ BDT (see open questions).
- Accessibility: WCAG 2.2 AA contrast, visible focus rings, keyboard-operable drawers/menus/modals (focus trap + Esc), alt text on all images, `prefers-reduced-motion` respected (hero video pauses).

**Core components to build** — Button, IconButton, Badge, PriceTag, ProductCard, ProductGrid, ColorSwatch, SizeSelector, QuantityStepper, Drawer (left/right), Modal, Accordion, Tabs, Carousel, MegaMenu, MobileMenu, FilterPanel, SortSelect, Pagination, Breadcrumb, TrustStrip, Newsletter form, Toast, Skeleton loaders.

## Phase 1: frontend stack and GitHub Pages deployment

Use Next.js with static export: it runs on GitHub Pages today, gives good SEO for product pages, and becomes the production frontend in Phase 2 by switching off static export.

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | Next.js (latest stable, App Router) + TypeScript | Static export now, server rendering later; strong SEO |
| Styling | Tailwind CSS with theme tokens from the design system | Fast, consistent, easy to re-brand |
| State | Zustand (cart, wishlist, recently viewed) persisted to localStorage | Tiny, simple; swaps to server cart in Phase 2 |
| Carousels | Embla Carousel | Lightweight, touch-friendly |
| Forms + validation | React Hook Form + Zod | Same Zod schemas reused by the backend later |
| Icons | Lucide | Clean line icons matching the minimal look |
| Testing | Vitest + Testing Library (units), Playwright (key flows) | Catches regressions before the team sees them |
| Quality | ESLint, Prettier, TypeScript strict, Lighthouse CI | Keeps Claude Code's output tidy |

**GitHub Pages specifics (Claude Code must handle these)**

- `next.config`: `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`, and `basePath`/`assetPrefix` set from an env var (e.g. `/arbi-web` for `username.github.io/arbi-web`; empty when a custom domain is used).
- Every dynamic route (`/products/[slug]`, `/collections/[slug]`) needs `generateStaticParams` reading the mock JSON, so all pages are pre-built.
- Search, filters and sort run in the browser (read query params in a client component wrapped in `Suspense`).
- Add `public/.nojekyll`; build a custom `404.html`.
- Deploy with a GitHub Actions workflow on push to `main`: install → lint → test → `next build` → upload `out/` → deploy to Pages (official `configure-pages`, `upload-pages-artifact`, `deploy-pages` actions).
- Add `<meta name="robots" content="noindex">` on the preview so Google does not index the demo.
- Optimise images before committing (WebP/AVIF, max 2000 px), since Next image optimisation is off in static export.

**Folder structure**

```
arbi-web/
  .github/workflows/deploy.yml
  public/            # logo, icons, images, videos, .nojekyll
  content/           # mock data: products.json, collections.json, home.json, size-charts.json, navigation.json, pages/*.md
  src/
    app/             # routes (layout, page files per route above)
    components/      # ui/ (atoms) , layout/ (header, footer, menus), product/, collection/, cart/, home/ (one per section)
    lib/
      api/           # data access layer: mock now, real backend in Phase 2
      utils/         # formatPrice, slugify, filters, seo helpers
    store/           # Zustand stores: cart, wishlist, recentlyViewed
    styles/          # globals.css, theme tokens
    types/           # Product, Collection, CartItem, Order ...
  tests/             # unit + playwright
  CLAUDE.md          # project rules for Claude Code (copy key parts of this plan)
```

## Data model and mock data

The same TypeScript types define the mock JSON in Phase 1 and the database tables in Phase 2. Each colour is its own product (as on ARKS), linked to its siblings by a shared `styleGroup`; sizes are variants with their own stock.

```ts
type Product = {
  id: string; slug: string; title: string;
  styleGroup: string;            // links colour siblings, e.g. "linen-classic-shirt"
  color: { name: string; hex: string };
  gender: 'men' | 'women' | 'unisex';
  category: string;              // shirts, tees, polos, pants, denim, joggers, shorts, jackets, sweatshirts, dresses, accessories
  style?: string; fabric: string; fit?: string;
  tags: string[];                // shown as chips: "100% Cotton", "Lightweight"
  price: number; compareAtPrice?: number;   // in smallest unit or whole BDT, decide once
  images: { src: string; alt: string }[];   // first two used on cards (hover swap)
  shortDescription: string; description: string;
  details: { label: string; value: string }[];  // origin, care, manufacturer
  sizeChartId: string;
  variants: { sku: string; size: string; stock: number }[];
  collections: string[];         // slugs
  badges?: ('new' | 'sale' | 'bestseller')[];
  rating?: number; reviewCount?: number;
  createdAt: string; bestSellerRank?: number;
};

type Collection = { slug: string; title: string; description?: string; banner?: { mobile: string; desktop: string }; filter: { gender?: string; category?: string[]; tag?: string } | { productSlugs: string[] } };
type SizeChart = { id: string; name: string; unit: 'cm'; columns: string[]; rows: { size: string; values: number[] }[]; howToMeasure: { title: string; text: string }[]; image?: string };
type HomeSection = { type: 'hero' | 'splitTiles' | 'banner' | 'productRow' | 'collectionCards' | 'shopTheLook' | 'carousel' | 'trustStrip'; data: unknown };
type CartItem = { sku: string; productId: string; size: string; qty: number };
```

Phase 2 adds: Customer, Address, Order, OrderItem, Payment, Shipment, Review, Coupon, InventoryMovement, AdminUser, AuditLog.

**Mock data to generate** — about 40 products across men and women (at least 6 categories, 2–5 colours each, sizes S–XXL and waist 28–38), 12 collections, 4 size charts, navigation config, home config, 5 sample orders. Images: ARBI's own photos when available; until then use licensed stock (e.g. Unsplash/Pexels, with credits in `CREDITS.md`) or neutral grey placeholders. Never ARKS images.

## Phase 2: backend

Recommended: Medusa v2 as the commerce backend, with the Next.js frontend switched from static export to server rendering. It gives products, variants, inventory, carts, orders, customers, discounts and an admin dashboard out of the box, so Claude Code builds integrations instead of re-inventing a shop.

**Backend options compared**

| Option | What it is | Cost | Effort | Fit for ARBI |
| --- | --- | --- | --- | --- |
| **A. Medusa v2 (recommended)** | Open-source (MIT) TypeScript headless commerce engine with Store API, Admin API and admin dashboard; needs PostgreSQL + Redis ([Railway guide](https://railway.com/deploy/medusajs-v2-shopify-alternative--medusa)) | Free self-hosted; managed Medusa Cloud from about $29/mo ([ecommerceguide](https://ecommerceguide.com/platforms/medusa/), Oct 2026) | Medium | Full control, no per-sale fees, same language as the frontend |
| B. Custom API | NestJS or Express + Prisma + PostgreSQL, built from scratch | Hosting only | High | Maximum freedom, but admin panel, inventory, orders all hand-built |
| C. Shopify headless | What ARKS itself runs on; Next.js frontend on Shopify Storefront API | Monthly plan + app fees | Low | Fastest, but confirm local payment gateway and courier support first |

**Architecture (Option A)**

- Frontend: Next.js (server rendering + ISR) on Vercel or the same VPS.
- Backend: Medusa server + worker, PostgreSQL (managed, daily backups), Redis (sessions, events, jobs).
- Media: Cloudinary or Cloudflare R2/S3 for product images and videos, served via CDN.
- Search: Medusa product search to start; Meilisearch when the catalogue grows.
- Email: Resend / SendGrid / SES (order confirmation, shipping, password reset). SMS: a local SMS gateway for OTP and order updates.
- Edge: Cloudflare in front of everything (DNS, CDN, WAF, DDoS, bot protection).

**Features to build**

1. Customer accounts: email + password and phone OTP login, addresses, order history, wishlist sync, guest checkout.
2. Catalogue admin: products, colours (style groups), sizes, stock per size, collections, size charts, home-page sections editable from admin.
3. Server-side cart and checkout: delivery zones and rates, coupon codes, order notes, COD option, order confirmation page + email/SMS.
4. Payments (assuming Bangladesh market — confirm): **SSLCommerz** hosted payment page covers cards plus bKash, Nagad and Rocket in one integration; every payment notification must be checked with its Validation API before marking an order paid ([SSLCommerz docs](https://developer.sslcommerz.com/doc/v4/)). Optional direct bKash tokenized checkout later. **Cash on delivery** as a payment method with extra fraud checks. Note Nagad and Upay only accept calls from whitelisted server IPs, so the backend needs a fixed outbound IP ([bdpaygate notes](https://packagist.org/packages/byteminus/laravel-bdpaygate)).
5. Delivery: courier API integration with **Steadfast, Pathao and RedX** (create consignment, track, receive status webhooks) ([BC CourierHub](https://www.xpay.sh/directory/woocommerce/plugins/bc-courierhub-bd/)). Treat "delivered, pending approval" courier statuses as not final, since they can still turn into returns ([developer note](https://ca.linkedin.com/in/nayao)).
6. Orders admin: status pipeline (placed → confirmed → packed → shipped → delivered / returned / cancelled), invoices, packing slips, refunds, exchanges.
7. Returns and exchanges request flow for customers.
8. Reviews with moderation; newsletter signup (Mailchimp/Brevo).
9. Analytics: GA4, Meta Pixel + Conversions API (server-side), purchase events.
10. Staff roles: owner, manager, order handler, content editor.

**Switch-over from Phase 1** — remove `output: 'export'`, replace the mock implementations in `src/lib/api` with Medusa JS SDK calls, move the cart from localStorage to a Medusa cart ID cookie, connect checkout to the payment flow. Page components stay as they are.

## Phase 3: security measures

The biggest risks for a clothing store are tampered prices, fake payment confirmations, stolen admin accounts, COD fraud and leaked customer data; every item below targets one of those.

| Area | Measure | Done by |
| --- | --- | --- |
| Transport | HTTPS everywhere, HSTS, TLS 1.2+ only, HTTP→HTTPS redirect | Cloudflare + server |
| Headers | Content-Security-Policy, `frame-ancestors 'none'`, X-Content-Type-Options, Referrer-Policy, Permissions-Policy | Next.js middleware / server |
| Pricing integrity | Never trust prices, totals, discounts or stock sent by the browser; backend recalculates every order | Backend |
| Payments | Use hosted payment pages (card data never touches ARBI servers); validate every IPN/callback with the gateway's validation API; verify amount + currency + order ID; idempotent handlers so a callback replay can't double-mark | Backend |
| Auth | Argon2/bcrypt password hashing; HttpOnly + Secure + SameSite cookies; short sessions with rotation; CSRF protection on state-changing requests; account lockout and OTP rate limits | Backend |
| Admin | Separate admin URL behind Cloudflare Access or IP allowlist; mandatory 2FA; role-based permissions; audit log of every admin action | Backend + Cloudflare |
| Abuse | Rate limiting on login, OTP, checkout, contact and search; Cloudflare Turnstile on forms; WAF managed rules; bot fight mode | Cloudflare + backend |
| COD fraud | Phone OTP before COD orders; limit open COD orders per phone; block lists; optional courier fraud-score check; partial advance payment for high-value COD | Backend |
| Input | Server-side validation with Zod on every endpoint; ORM / parameterised queries; sanitise rich text; validate file type and size on uploads | Backend |
| Secrets | `.env` never committed; secrets in host's secret manager; separate keys for dev / staging / production; rotate on staff changes | Team |
| Dependencies | Dependabot, `npm audit` in CI, lockfile committed, pin major versions | CI |
| Data | Collect only needed customer data; encrypt backups; DB not publicly reachable; least-privilege DB users | Backend + host |
| Monitoring | Sentry for errors, uptime monitor, alerts on payment failures and spikes in failed logins | Team |
| Backups | Daily automated DB backups, 30-day retention, monthly test restore | Host |
| Legal | Privacy policy, terms, refund and shipping policy, cookie notice; follow local e-commerce and data-protection rules (confirm with a lawyer) | Owner |
| Before launch | OWASP Top 10 review, run OWASP ZAP scan, test payment flows in sandbox, independent pen test if budget allows | Team / vendor |

## Launch checklist

Go live only when every box is ticked on the staging site first.

- [ ] Domain bought, DNS on Cloudflare, SSL active, `www` and bare domain both redirect to one canonical URL
- [ ] Staging and production environments separate, each with its own database and keys
- [ ] All ARBI content in place: logo, product photos, descriptions, size charts, About, policies — no placeholders or stock photos left where real ones exist
- [ ] Payment gateway switched from sandbox to live; one real low-value order paid, refunded, and reconciled
- [ ] COD order placed, shipped through the courier API, status webhook received
- [ ] Order confirmation email and SMS arrive and look right on a phone
- [ ] SEO: unique titles and meta descriptions, Open Graph images, `sitemap.xml`, `robots.txt` (remove the preview `noindex`), Product structured data (price, availability), Google Search Console verified
- [ ] Analytics: GA4 and Meta Pixel firing purchase events once per order
- [ ] Performance: Lighthouse ≥ 90 on mobile for home, collection and product pages; images WebP/AVIF and lazy-loaded
- [ ] Accessibility pass: keyboard-only navigation of menu, drawers, size chart, checkout
- [ ] Security table above completed; admin 2FA on for every staff account
- [ ] Backups running and one restore tested
- [ ] Uptime and error alerts going to the team's phone/email
- [ ] Customer support channels live (email, phone, WhatsApp) and listed in the footer

## Milestones for Claude Code

Give Claude Code one milestone at a time and review the GitHub Pages link before moving on. Each milestone ends with a commit, passing CI and a live preview.

**Phase 1 — frontend demo**

1. **Project setup** — Next.js + TS + Tailwind, ESLint/Prettier, theme tokens, `CLAUDE.md`, GitHub Actions deploy to Pages with basePath.
   - Done when: an empty ARBI-branded page loads at the Pages URL, CI is green.
2. **Data layer and mock content** — types, \~40 mock products, collections, size charts, navigation and home JSON; `src/lib/api` functions (`getProducts`, `getProduct`, `getCollection`, `search`, `getHome`).
   - Done when: unit tests cover filtering, sorting and sibling-colour lookup.
3. **Layout shell** — announcement bar, header, desktop mega menu, mobile drill-down drawer, search drawer, footer with trust strip.
   - Done when: all menus work by mouse, touch and keyboard at 375 px, 768 px and 1440 px.
4. **Home page** — all nine sections driven by `home.json`; hero video with poster and reduced-motion fallback.
   - Done when: reordering sections in JSON reorders the page; Lighthouse mobile ≥ 90.
5. **Collection pages** — grid, product card (hover image, quick add, colour dots, badges), filter drawer, sort, pagination, URL-synced filters.
   - Done when: every collection slug is pre-built and filters/sort survive a page refresh.
6. **Product page** — gallery with zoom, colour siblings, size selector with stock, size-chart modal (3 tabs, CM/Inch), add to cart, buy now, accordions, sticky bar, related + recently viewed.
   - Done when: out-of-stock sizes can't be added; size chart is keyboard accessible.
7. **Cart and demo checkout** — cart drawer + page, quantity, remove, note, free-delivery progress, checkout form with validation, demo order-success page.
   - Done when: cart persists across reloads; Playwright test covers browse → add → checkout.
8. **Remaining pages** — search results, account (demo), track order (demo), About, Contact, FAQ, store locator, size guide, policies, 404.
   - Done when: no broken internal links (link checker in CI).
9. **Polish and team review** — animations, skeletons, empty states, SEO meta, favicon/OG image, demo banner, `noindex`.
   - Done when: team signs off the preview.

**Phase 2 — backend**

10. Medusa v2 setup (Postgres, Redis), import mock catalogue, admin access.
11. Swap `src/lib/api` to Medusa; server cart; customer accounts with email + phone OTP.
12. Checkout: delivery zones/rates, coupons, COD, payment gateway (sandbox), order emails/SMS.
13. Courier integration and order status webhooks; returns/exchanges flow.
14. Admin extras: home-page content editor, size charts, staff roles; analytics events.

**Phase 3 — security and launch**

15. Apply the security table; staging environment; ZAP scan and fixes.
16. Live payment and courier keys, launch checklist, go live on the ARBI domain.

## Assets needed and open questions

Phase 1 can start today with placeholders; these items replace them and settle the Phase 2 choices.

**Assets from the ARBI team**

- [ ] Logo: SVG, plus white version and a square icon/favicon
- [ ] Brand colours and fonts (or approval of the placeholder palette)
- [ ] Hero video (MP4, 10–20 s, under 8 MB) and poster image
- [ ] Campaign banners: mobile 1080×1620 and desktop 2560×1080
- [ ] Product photos: 4–6 per colour, 3:4 portrait, same background and lighting
- [ ] Product list (spreadsheet): name, category, colours, sizes, price, fabric, description, stock
- [ ] Size charts per product type (cm)
- [ ] Collection names and one-line taglines (ARBI's own)
- [ ] About text, brand statement, policies, contact details, social links, store addresses (if any)

**Open questions**

- [ ] Market and currency: assumed Bangladesh, prices in ৳ BDT, VAT-inclusive. Correct?
- [ ] Categories: will ARBI sell women's wear, footwear, fragrance, accessories from day one, or menswear only?
- [ ] Delivery pricing: flat rate, free above a threshold, or by zone?
- [ ] Payments at launch: SSLCommerz + COD only, or also direct bKash/Nagad?
- [ ] Backend choice: Medusa (recommended), custom API, or Shopify?
- [ ] Physical stores: show a store locator or hide it?
- [ ] Language: English only, or English + Bangla toggle?
- [ ] Domain name and GitHub repo name (sets the Pages URL and basePath)

## Kickoff prompt for Claude Code

Export this doc as Markdown, save it in the new repo as `docs/BUILD_PLAN.md`, then paste the prompt below into Claude Code.

```markdown
You are building the frontend for ARBI, a clothing brand's online store.
Read docs/BUILD_PLAN.md fully before writing any code. It is the source of truth.

Rules:
- Replicate the STRUCTURE and UX of the reference store described in the plan
  (section order, menus, drawers, filters, product-page flow). Do NOT copy any of
  the reference brand's logo, images, videos, product text, taglines or source code.
  Write all code from scratch and use ARBI assets or clearly marked placeholders.
- Stack: Next.js (App Router, TypeScript strict), Tailwind CSS, Zustand, Embla,
  React Hook Form + Zod, Lucide icons. Static export for GitHub Pages.
- All data access goes through src/lib/api (mock JSON now, real backend later).
  Components never import JSON directly.
- Mobile-first, WCAG 2.2 AA, Lighthouse mobile >= 90.
- Currency via formatPrice() helper, default BDT (৳).
- Work one milestone at a time from the "Milestones for Claude Code" section.
  After each milestone: run lint + tests + build, commit, and summarise what
  changed and what I should check on the preview link.

First steps:
1. Create CLAUDE.md with the rules above and the key decisions from the plan.
2. Complete Milestone 1 (project setup + GitHub Pages deploy workflow).
   The repo name is <REPO_NAME>, so basePath is /<REPO_NAME>.
3. Stop and tell me the Pages URL so I can check it before Milestone 2.
```

**Tips for working with Claude Code**

- Keep each request to one milestone; ask for a plan first on the bigger ones (home, product page, checkout).
- Put ARBI photos in `public/images/` with clear names (`linen-shirt-white-1.webp`) so Claude Code can wire them in.
- When something looks off, send a screenshot with the page and screen width.
- Turn on GitHub Pages in repo Settings → Pages → Source: GitHub Actions before the first deploy.

## Sources

- [ARKS homepage](https://arks.club/), [ARKS men's collection](https://arks.club/collections/men), [ARKS product page example](https://arks.club/products/mens-linen-classic-collar-shirt-natural) — structure reviewed 21 Oct 2026
- [Medusa v2 on Railway](https://railway.com/deploy/medusajs-v2-shopify-alternative--medusa)
- [Medusa platform profile, ecommerceguide](https://ecommerceguide.com/platforms/medusa/)
- [SSLCommerz developer documentation v4](https://developer.sslcommerz.com/doc/v4/)
- [laravel-bdpaygate (gateway IP whitelisting notes)](https://packagist.org/packages/byteminus/laravel-bdpaygate)
- [BC CourierHub BD (Steadfast, Pathao, RedX APIs and webhooks)](https://www.xpay.sh/directory/woocommerce/plugins/bc-courierhub-bd/)
- [Developer note on courier status handling](https://ca.linkedin.com/in/nayao)
