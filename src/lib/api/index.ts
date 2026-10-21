// Data access layer. Phase 1 reads the mock JSON in content/ at build time; Phase 2 swaps
// these implementations for backend calls with the same signatures. Pages and components
// call only these functions and never import content JSON themselves.
//
// Server-only: this module reads the filesystem (see media.ts). Client components receive
// its results as props, or fetch /search-index.json.
import collectionsJson from "../../../content/collections.json";
import faqJson from "../../../content/faq.json";
import homeJson from "../../../content/home.json";
import navigationJson from "../../../content/navigation.json";
import ordersJson from "../../../content/orders.json";
import pagesJson from "../../../content/pages.json";
import productsJson from "../../../content/products.json";
import reviewsJson from "../../../content/reviews.json";
import siteJson from "../../../content/site.json";
import sizeChartsJson from "../../../content/size-charts.json";
import storesJson from "../../../content/stores.json";
import { categoryLabel, matchesCollection, matchesQuery, sizeRank } from "@/lib/utils/catalog";
import type {
  Collection,
  CollectionFilter,
  ContentPage,
  FaqGroup,
  HomeSection,
  MediaInput,
  NavItem,
  Navigation,
  Order,
  Product,
  ProductSummary,
  Review,
  SearchEntry,
  SiteSettings,
  SizeChart,
  Store,
} from "@/types";

import { resolveMedia, resolveVideo } from "./media";

export { placeholderPath } from "./media";

// ---------------------------------------------------------------------------------------
// Raw JSON shapes (images not yet resolved)

type RawProduct = Omit<Product, "images"> & { images: MediaInput[] };
type RawCollection = Omit<Collection, "banner" | "card"> & {
  banner?: { mobile: MediaInput; desktop: MediaInput };
  card?: MediaInput;
};
type RawHomeSection = { type: HomeSection["type"]; data: Record<string, unknown> };

const rawProducts = productsJson as unknown as RawProduct[];
const rawCollections = collectionsJson as unknown as RawCollection[];

// ---------------------------------------------------------------------------------------
// Products

let productCache: Product[] | undefined;

function allProducts(): Product[] {
  productCache ??= rawProducts.map((p) => ({
    ...p,
    variants: [...p.variants].sort((a, b) => sizeRank(a.size) - sizeRank(b.size)),
    images: p.images.map((img) => resolveMedia(img, { width: 1200, height: 1600 })),
  }));
  return productCache;
}

export function isInStock(p: Pick<Product, "variants">): boolean {
  return p.variants.some((v) => v.stock > 0);
}

/** Colour siblings of a product: every product sharing its styleGroup, including itself. */
export function getSiblings(
  product: Pick<Product, "styleGroup" | "slug">,
  products = allProducts(),
) {
  return products
    .filter((p) => p.styleGroup === product.styleGroup)
    .map((p) => ({ slug: p.slug, color: p.color, current: p.slug === product.slug }));
}

export function toSummary(p: Product): ProductSummary {
  return {
    id: p.id,
    slug: p.slug,
    title: p.title,
    styleGroup: p.styleGroup,
    color: p.color,
    gender: p.gender,
    category: p.category,
    fabric: p.fabric,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    images: p.images.slice(0, 2),
    colors: getSiblings(p),
    variants: p.variants,
    badges: p.badges ?? [],
    rating: p.rating,
    reviewCount: p.reviewCount,
    createdAt: p.createdAt,
    bestSellerRank: p.bestSellerRank,
    inStock: isInStock(p),
  };
}

export async function getProducts(): Promise<Product[]> {
  return allProducts();
}

export async function getProductSlugs(): Promise<string[]> {
  return allProducts().map((p) => p.slug);
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  return allProducts().find((p) => p.slug === slug);
}

export async function getProductSummaries(slugs: string[]): Promise<ProductSummary[]> {
  return slugs
    .map((s) => allProducts().find((p) => p.slug === s))
    .filter((p): p is Product => Boolean(p))
    .map(toSummary);
}

/** "You may also like": same category first, then same gender; one colour per style. */
export async function getRelatedProducts(product: Product, limit = 8): Promise<ProductSummary[]> {
  const seen = new Set([product.styleGroup]);
  const score = (p: Product) =>
    (p.category === product.category ? 2 : 0) + (p.gender === product.gender ? 1 : 0);
  return allProducts()
    .filter((p) => p.styleGroup !== product.styleGroup && isInStock(p))
    .sort((a, b) => score(b) - score(a) || (a.bestSellerRank ?? 99) - (b.bestSellerRank ?? 99))
    .filter((p) => (seen.has(p.styleGroup) ? false : (seen.add(p.styleGroup), true)))
    .slice(0, limit)
    .map(toSummary);
}

// ---------------------------------------------------------------------------------------
// Collections

function resolveCollection(c: RawCollection): Collection {
  return {
    ...c,
    banner: c.banner && {
      mobile: resolveMedia(c.banner.mobile, { width: 1080, height: 1620 }),
      desktop: resolveMedia(c.banner.desktop, { width: 2560, height: 1080 }),
    },
    card: c.card && resolveMedia(c.card),
  };
}

export async function getCollections(): Promise<Collection[]> {
  return rawCollections.map(resolveCollection);
}

export async function getCollectionSlugs(): Promise<string[]> {
  return rawCollections.map((c) => c.slug);
}

export async function getCollection(slug: string): Promise<Collection | undefined> {
  const c = rawCollections.find((x) => x.slug === slug);
  return c && resolveCollection(c);
}

export function productsForFilter(filter: CollectionFilter, products = allProducts()): Product[] {
  return products.filter((p) => matchesCollection(p, filter));
}

export async function getCollectionProducts(slug: string): Promise<ProductSummary[]> {
  const c = rawCollections.find((x) => x.slug === slug);
  return c ? productsForFilter(c.filter).map(toSummary) : [];
}

// ---------------------------------------------------------------------------------------
// Search

export async function getSearchIndex(): Promise<SearchEntry[]> {
  return allProducts().map((p) => ({
    slug: p.slug,
    title: p.title,
    colorName: p.color.name,
    category: p.category,
    gender: p.gender,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    image: p.images[0],
    keywords: [
      p.title,
      p.color.name,
      p.category,
      categoryLabel(p.category),
      p.fabric,
      p.gender,
      p.gender === "men" ? "mens him" : p.gender === "women" ? "womens her" : "",
      p.style ?? "",
      ...p.tags,
    ].join(" "),
  }));
}

export async function search(query: string): Promise<SearchEntry[]> {
  const index = await getSearchIndex();
  return index.filter((e) => matchesQuery(e.keywords, query));
}

// ---------------------------------------------------------------------------------------
// Home

function collectionsBySlug(slugs: string[]): Collection[] {
  return slugs
    .map((slug) => rawCollections.find((c) => c.slug === slug))
    .filter((c): c is RawCollection => Boolean(c))
    .map(resolveCollection);
}

function resolveSection(s: RawHomeSection, site: SiteSettings): HomeSection | undefined {
  const d = s.data as Record<string, never>;
  switch (s.type) {
    case "hero": {
      const video = d.video as { mp4?: string; webm?: string } | undefined;
      const mp4 = resolveVideo(video?.mp4);
      const webm = resolveVideo(video?.webm);
      return {
        type: "hero",
        data: {
          heading: d.heading,
          subheading: d.subheading,
          cta: d.cta,
          image: resolveMedia(d.image, { width: 2560, height: 1440 }),
          mobileImage: resolveMedia(d.mobileImage, { width: 1080, height: 1920 }),
          video: mp4 || webm ? { mp4, webm } : undefined,
        },
      };
    }
    case "categoryTiles":
    case "collectionCards":
      return {
        type: s.type,
        data: {
          eyebrow: d.eyebrow,
          heading: d.heading,
          collections: collectionsBySlug(d.collections as string[]),
        },
      };
    case "editorial":
      return {
        type: "editorial",
        data: {
          eyebrow: d.eyebrow,
          heading: d.heading,
          text: d.text,
          cta: d.cta,
          image: resolveMedia(d.image, { width: 1600, height: 2000 }),
        },
      };
    case "lookbook":
      return {
        type: "lookbook",
        data: {
          eyebrow: d.eyebrow,
          heading: d.heading,
          text: d.text,
          cta: d.cta,
          images: (d.images as MediaInput[]).map((m) => resolveMedia(m)),
        },
      };
    case "banner":
      return {
        type: "banner",
        data: {
          eyebrow: d.eyebrow,
          heading: d.heading,
          text: d.text,
          cta: d.cta,
          mobile: resolveMedia(d.mobile, { width: 1080, height: 1620 }),
          desktop: resolveMedia(d.desktop, { width: 2560, height: 1080 }),
        },
      };
    case "brandStatement":
      return { type: "brandStatement", data: { text: d.text ?? site.brandStatement } };
    case "trustStrip":
      return { type: "trustStrip", data: { badges: site.trustBadges } };
    default:
      return undefined;
  }
}

/** Home sections in the order given by content/home.json. */
export async function getHome(): Promise<HomeSection[]> {
  const site = await getSite();
  return (homeJson.sections as RawHomeSection[])
    .map((s) => resolveSection(s, site))
    .filter((s): s is HomeSection => Boolean(s));
}

// ---------------------------------------------------------------------------------------
// Site, navigation and content pages

export async function getSite(): Promise<SiteSettings> {
  return siteJson as SiteSettings;
}

export async function getNavigation(): Promise<Navigation> {
  const nav = navigationJson as unknown as Omit<Navigation, "main"> & {
    main: (Omit<NavItem, "feature"> & {
      feature?: { title: string; href: string; image: MediaInput };
    })[];
  };
  return {
    ...nav,
    main: nav.main.map((item) => ({
      ...item,
      feature: item.feature && { ...item.feature, image: resolveMedia(item.feature.image) },
    })),
  };
}

export async function getSizeCharts(): Promise<SizeChart[]> {
  return sizeChartsJson as SizeChart[];
}

export async function getSizeChart(id: string | undefined): Promise<SizeChart | undefined> {
  return id ? (sizeChartsJson as SizeChart[]).find((c) => c.id === id) : undefined;
}

export async function getPage(slug: string): Promise<ContentPage | undefined> {
  return (pagesJson as ContentPage[]).find((p) => p.slug === slug);
}

export async function getFaqs(): Promise<FaqGroup[]> {
  return faqJson as FaqGroup[];
}

export async function getStores(): Promise<Store[]> {
  return storesJson as Store[];
}

/** Phase 1 demo orders for the account page and order tracking. */
export async function getSampleOrders(): Promise<Order[]> {
  return ordersJson as Order[];
}

/** Static sample reviews (Phase 1); Phase 2 loads moderated reviews per product. */
export async function getReviews(_productId: string): Promise<Review[]> {
  void _productId;
  return reviewsJson as Review[];
}
