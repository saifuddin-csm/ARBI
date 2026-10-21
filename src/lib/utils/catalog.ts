// Pure catalogue helpers shared by the API layer (build time) and client components
// (collection filters, search). No Node or browser APIs here.
import type { CollectionFilter, Gender, Product, ProductSummary } from "@/types";

export type SortKey = "featured" | "best-selling" | "newest" | "price-asc" | "price-desc";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
];

export const PAGE_SIZE = 24;

export type Filters = {
  availability?: "in" | "out";
  minPrice?: number;
  maxPrice?: number;
  sizes: string[];
  colors: string[];
  categories: string[];
  fabrics: string[];
  genders: Gender[];
};

export const EMPTY_FILTERS: Filters = {
  sizes: [],
  colors: [],
  categories: [],
  fabrics: [],
  genders: [],
};

const SIZE_ORDER = [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "28",
  "30",
  "32",
  "34",
  "36",
  "38",
  "One size",
];

export function sizeRank(size: string): number {
  const i = SIZE_ORDER.indexOf(size);
  return i === -1 ? SIZE_ORDER.length : i;
}

export function matchesCollection(product: Product, filter: CollectionFilter): boolean {
  if ("productSlugs" in filter) return filter.productSlugs.includes(product.slug);
  if (filter.gender && product.gender !== filter.gender) return false;
  if (filter.category && !filter.category.includes(product.category)) return false;
  if (filter.tag && !product.collections.includes(filter.tag)) return false;
  if (filter.badge && !(product.badges ?? []).includes(filter.badge)) return false;
  return true;
}

export function filterProducts(products: ProductSummary[], f: Filters): ProductSummary[] {
  return products.filter((p) => {
    if (f.availability === "in" && !p.inStock) return false;
    if (f.availability === "out" && p.inStock) return false;
    if (f.minPrice !== undefined && p.price < f.minPrice) return false;
    if (f.maxPrice !== undefined && p.price > f.maxPrice) return false;
    if (f.sizes.length && !p.variants.some((v) => v.stock > 0 && f.sizes.includes(v.size)))
      return false;
    if (f.colors.length && !f.colors.includes(p.color.name)) return false;
    if (f.categories.length && !f.categories.includes(p.category)) return false;
    if (f.fabrics.length && !f.fabrics.includes(p.fabric)) return false;
    if (f.genders.length && !f.genders.includes(p.gender)) return false;
    return true;
  });
}

export function sortProducts(products: ProductSummary[], sort: SortKey): ProductSummary[] {
  const list = [...products];
  switch (sort) {
    case "best-selling":
      return list.sort((a, b) => (a.bestSellerRank ?? 999) - (b.bestSellerRank ?? 999));
    case "newest":
      return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    default:
      // Featured: in-stock first, keeping catalogue order.
      return list.sort((a, b) => Number(b.inStock) - Number(a.inStock));
  }
}

export function paginate<T>(items: T[], page: number, size = PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const current = Math.min(Math.max(1, page), pageCount);
  return { items: items.slice((current - 1) * size, current * size), page: current, pageCount };
}

export type FilterOptions = {
  sizes: string[];
  colors: { name: string; hex: string }[];
  categories: string[];
  fabrics: string[];
  genders: Gender[];
  priceRange: { min: number; max: number };
};

export function getFilterOptions(products: ProductSummary[]): FilterOptions {
  const sizes = new Set<string>();
  const colors = new Map<string, string>();
  const categories = new Set<string>();
  const fabrics = new Set<string>();
  const genders = new Set<Gender>();
  let min = Infinity;
  let max = 0;
  for (const p of products) {
    p.variants.forEach((v) => sizes.add(v.size));
    colors.set(p.color.name, p.color.hex);
    categories.add(p.category);
    fabrics.add(p.fabric);
    genders.add(p.gender);
    min = Math.min(min, p.price);
    max = Math.max(max, p.price);
  }
  return {
    sizes: [...sizes].sort((a, b) => sizeRank(a) - sizeRank(b)),
    colors: [...colors]
      .map(([name, hex]) => ({ name, hex }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    categories: [...categories].sort(),
    fabrics: [...fabrics].sort(),
    genders: [...genders].sort(),
    priceRange: { min: Number.isFinite(min) ? min : 0, max },
  };
}

const list = (v: string | null) => (v ? v.split(",").filter(Boolean) : []);
const num = (v: string | null) => {
  const n = v === null || v === "" ? NaN : Number(v);
  return Number.isFinite(n) ? n : undefined;
};

/** Reads filters, sort and page from URL query params (shareable collection links). */
export function parseCatalogParams(params: URLSearchParams) {
  const availability = params.get("availability");
  const sort = params.get("sort") as SortKey | null;
  const filters: Filters = {
    availability: availability === "in" || availability === "out" ? availability : undefined,
    minPrice: num(params.get("min")),
    maxPrice: num(params.get("max")),
    sizes: list(params.get("size")),
    colors: list(params.get("color")),
    categories: list(params.get("category")),
    fabrics: list(params.get("fabric")),
    genders: list(params.get("gender")) as Gender[],
  };
  return {
    filters,
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "featured",
    page: Math.max(1, num(params.get("page")) ?? 1),
  };
}

export function buildCatalogParams(filters: Filters, sort: SortKey, page: number): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.availability) p.set("availability", filters.availability);
  if (filters.minPrice !== undefined) p.set("min", String(filters.minPrice));
  if (filters.maxPrice !== undefined) p.set("max", String(filters.maxPrice));
  if (filters.sizes.length) p.set("size", filters.sizes.join(","));
  if (filters.colors.length) p.set("color", filters.colors.join(","));
  if (filters.categories.length) p.set("category", filters.categories.join(","));
  if (filters.fabrics.length) p.set("fabric", filters.fabrics.join(","));
  if (filters.genders.length) p.set("gender", filters.genders.join(","));
  if (sort !== "featured") p.set("sort", sort);
  if (page > 1) p.set("page", String(page));
  return p;
}

export function countActiveFilters(f: Filters): number {
  return (
    (f.availability ? 1 : 0) +
    (f.minPrice !== undefined || f.maxPrice !== undefined ? 1 : 0) +
    f.sizes.length +
    f.colors.length +
    f.categories.length +
    f.fabrics.length +
    f.genders.length
  );
}

/** Case- and accent-insensitive search over title, colour, category, fabric and tags. */
export function matchesQuery(haystack: string, query: string): boolean {
  const norm = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const words = norm(query).split(/\s+/).filter(Boolean);
  const text = norm(haystack);
  return words.length > 0 && words.every((w) => text.includes(w));
}

export function categoryLabel(category: string): string {
  const labels: Record<string, string> = {
    pants: "Chinos",
    tees: "T-shirts",
    cargo: "Cargo pants",
  };
  return labels[category] ?? category.charAt(0).toUpperCase() + category.slice(1);
}
