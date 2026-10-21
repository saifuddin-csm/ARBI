import { describe, expect, it } from "vitest";

import { getCollectionProducts, getProduct, getProducts, getSiblings, toSummary } from "@/lib/api";
import {
  EMPTY_FILTERS,
  buildCatalogParams,
  filterProducts,
  getFilterOptions,
  matchesQuery,
  paginate,
  parseCatalogParams,
  sortProducts,
} from "@/lib/utils/catalog";

const summaries = async () => (await getProducts()).map(toSummary);

describe("mock catalogue", () => {
  it("has about 40 products across men, women and at least 6 categories", async () => {
    const products = await getProducts();
    expect(products.length).toBeGreaterThanOrEqual(38);
    expect(new Set(products.map((p) => p.gender))).toEqual(new Set(["men", "women", "unisex"]));
    expect(new Set(products.map((p) => p.category)).size).toBeGreaterThanOrEqual(6);
  });

  it("gives every product unique slugs and SKUs", async () => {
    const products = await getProducts();
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
    const skus = products.flatMap((p) => p.variants.map((v) => v.sku));
    expect(new Set(skus).size).toBe(skus.length);
  });
});

describe("sibling colour lookup", () => {
  it("returns every colour of the style group and marks the current one", async () => {
    const product = (await getProduct("mens-linen-classic-shirt-sand"))!;
    const siblings = getSiblings(product);
    expect(siblings.map((s) => s.color.name)).toEqual(["White", "Sand", "Sky", "Olive"]);
    expect(siblings.filter((s) => s.current).map((s) => s.slug)).toEqual([
      "mens-linen-classic-shirt-sand",
    ]);
  });

  it("does not mix style groups", async () => {
    const product = (await getProduct("womens-relaxed-linen-shirt-white"))!;
    expect(getSiblings(product).every((s) => s.slug.startsWith("womens-relaxed-linen-shirt"))).toBe(
      true,
    );
  });
});

describe("collections", () => {
  it("matches by gender, category list and edit tag", async () => {
    const men = await getCollectionProducts("men");
    expect(men.length).toBeGreaterThan(0);
    expect(men.every((p) => p.gender === "men")).toBe(true);

    const bottoms = await getCollectionProducts("bottoms");
    expect(new Set(bottoms.map((p) => p.category))).toEqual(
      new Set(["pants", "denim", "joggers", "shorts"]),
    );

    const linen = await getCollectionProducts("linen-edit");
    expect(linen.length).toBeGreaterThan(0);
    expect(linen.every((p) => /linen/i.test(p.fabric))).toBe(true);
  });
});

describe("filterProducts", () => {
  it("filters by size only when that size is in stock", async () => {
    const all = await summaries();
    const result = filterProducts(all, { ...EMPTY_FILTERS, sizes: ["32"] });
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.variants.some((v) => v.size === "32" && v.stock > 0))).toBe(true);
  });

  it("combines colour, category, price and availability", async () => {
    const all = await summaries();
    const result = filterProducts(all, {
      ...EMPTY_FILTERS,
      colors: ["White"],
      categories: ["shirts"],
      maxPrice: 1800,
      availability: "in",
    });
    expect(result.map((p) => p.slug)).toEqual(
      expect.arrayContaining(["mens-oxford-button-down-shirt-white"]),
    );
    expect(result.every((p) => p.color.name === "White" && p.category === "shirts")).toBe(true);
    expect(result.every((p) => p.price <= 1800 && p.inStock)).toBe(true);
  });

  it("finds sold-out products with availability=out", async () => {
    const out = filterProducts(await summaries(), { ...EMPTY_FILTERS, availability: "out" });
    expect(out.map((p) => p.slug)).toContain("mens-coach-jacket-olive");
  });
});

describe("sortProducts", () => {
  it("sorts by price both ways", async () => {
    const all = await summaries();
    const asc = sortProducts(all, "price-asc").map((p) => p.price);
    const desc = sortProducts(all, "price-desc").map((p) => p.price);
    expect(asc).toEqual([...asc].sort((a, b) => a - b));
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it("sorts newest first and best sellers by rank", async () => {
    const all = await summaries();
    const newest = sortProducts(all, "newest").map((p) => p.createdAt);
    expect(newest).toEqual([...newest].sort().reverse());
    expect(sortProducts(all, "best-selling")[0].bestSellerRank).toBe(1);
  });

  it("puts sold-out items last for featured", async () => {
    const featured = sortProducts(await summaries(), "featured");
    expect(featured.at(-1)!.inStock).toBe(false);
  });
});

describe("paginate", () => {
  it("splits into pages of 24 and clamps the page number", () => {
    const items = Array.from({ length: 43 }, (_, i) => i);
    expect(paginate(items, 1)).toMatchObject({ page: 1, pageCount: 2 });
    expect(paginate(items, 2).items).toHaveLength(19);
    expect(paginate(items, 9).page).toBe(2);
  });
});

describe("URL params", () => {
  it("round-trips filters, sort and page", () => {
    const filters = { ...EMPTY_FILTERS, sizes: ["M", "L"], colors: ["Black"], minPrice: 500 };
    const params = buildCatalogParams(filters, "price-asc", 2);
    expect(params.toString()).toBe("min=500&size=M%2CL&color=Black&sort=price-asc&page=2");
    expect(parseCatalogParams(params)).toEqual({ filters, sort: "price-asc", page: 2 });
  });

  it("ignores unknown sort values", () => {
    expect(parseCatalogParams(new URLSearchParams("sort=bogus")).sort).toBe("featured");
  });
});

describe("filter options and search", () => {
  it("orders sizes naturally", async () => {
    const { sizes } = getFilterOptions(await summaries());
    expect(sizes.slice(0, 6)).toEqual(["XS", "S", "M", "L", "XL", "XXL"]);
  });

  it("matches every word, case- and accent-insensitively", () => {
    expect(matchesQuery("Piqué Polo Navy polos", "pique navy")).toBe(true);
    expect(matchesQuery("Piqué Polo Navy polos", "pique black")).toBe(false);
    expect(matchesQuery("anything", "  ")).toBe(false);
  });
});
