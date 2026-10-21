"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { type ReactNode, useId, useMemo, useState } from "react";

import { Pagination } from "@/components/ui/Pagination";
import {
  EMPTY_FILTERS,
  type Filters,
  SORT_OPTIONS,
  type SortKey,
  buildCatalogParams,
  categoryLabel,
  countActiveFilters,
  filterProducts,
  getFilterOptions,
  paginate,
  parseCatalogParams,
  sortProducts,
} from "@/lib/utils/catalog";
import { useMountOnOpen } from "@/lib/hooks/useMountOnOpen";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { ProductSummary } from "@/types";

import { GRID_CLASS } from "./grid";

// Loaded the first time someone opens the filters.
const FilterDrawer = dynamic(() => import("./FilterDrawer").then((m) => m.FilterDrawer));

type Chip = { label: string; remove: (f: Filters) => Filters };

function activeChips(f: Filters): Chip[] {
  const chips: Chip[] = [];
  if (f.availability)
    chips.push({
      label: f.availability === "in" ? "In stock" : "Out of stock",
      remove: (x) => ({ ...x, availability: undefined }),
    });
  if (f.minPrice !== undefined || f.maxPrice !== undefined)
    chips.push({
      label: `${f.minPrice !== undefined ? formatPrice(f.minPrice) : "Any"} – ${
        f.maxPrice !== undefined ? formatPrice(f.maxPrice) : "Any"
      }`,
      remove: (x) => ({ ...x, minPrice: undefined, maxPrice: undefined }),
    });
  const lists: [keyof Filters, (v: string) => string][] = [
    ["sizes", (v) => `Size ${v}`],
    ["colors", (v) => v],
    ["categories", categoryLabel],
    ["fabrics", (v) => v],
    ["genders", (v) => (v === "men" ? "Men" : v === "women" ? "Women" : "Unisex")],
  ];
  for (const [key, label] of lists) {
    for (const v of f[key] as string[]) {
      chips.push({
        label: label(v),
        remove: (x) => ({ ...x, [key]: (x[key] as string[]).filter((y) => y !== v) }),
      });
    }
  }
  return chips;
}

type CollectionViewProps = {
  products: ProductSummary[];
  /** Server-rendered product cards keyed by slug, so cards don't hydrate as client components. */
  cards: Record<string, ReactNode>;
};

/** Client-side filtering, sorting and pagination, synced to the URL so links can be shared. */
export function CollectionView({ products, cards }: CollectionViewProps) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filtersMounted = useMountOnOpen(filtersOpen);
  const sortId = useId();

  const { filters, sort, page } = parseCatalogParams(new URLSearchParams(params.toString()));
  const options = useMemo(() => getFilterOptions(products), [products]);
  const results = sortProducts(filterProducts(products, filters), sort);
  const paged = paginate(results, page);
  const activeCount = countActiveFilters(filters);
  const chips = activeChips(filters);

  const hrefWith = (f: Filters, s: SortKey, p: number) => {
    const qs = buildCatalogParams(f, s, p).toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };
  const update = (f: Filters, s: SortKey = sort) =>
    router.replace(hrefWith(f, s, 1), { scroll: false });

  return (
    <>
      <div className="sticky top-14 z-20 -mx-[var(--gutter)] mb-6 flex items-center justify-between gap-4 border-y border-line bg-bg px-[var(--gutter)] py-2">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex h-10 items-center gap-2 label-caps text-xs"
          aria-haspopup="dialog"
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filter{activeCount > 0 && ` (${activeCount})`}
        </button>
        <p className="hidden text-xs text-muted sm:block" aria-live="polite">
          {results.length} {results.length === 1 ? "product" : "products"}
        </p>
        <div className="flex items-center gap-2">
          <label htmlFor={sortId} className="hidden label-caps text-xs sm:inline">
            Sort by
          </label>
          <select
            id={sortId}
            value={sort}
            onChange={(e) => update(filters, e.target.value as SortKey)}
            className="h-10 border border-line bg-bg px-2 text-sm"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="mb-6 flex flex-wrap items-center gap-2" aria-label="Active filters">
          {chips.map((chip) => (
            <li key={chip.label}>
              <button
                type="button"
                onClick={() => update(chip.remove(filters))}
                className="inline-flex h-8 items-center gap-1 border border-line px-3 text-xs hover:border-text"
              >
                {chip.label}
                <X className="size-3" aria-hidden />
                <span className="sr-only">Remove filter</span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => update(EMPTY_FILTERS)}
              className="h-8 px-2 text-xs underline underline-offset-4"
            >
              Clear all
            </button>
          </li>
        </ul>
      )}

      <p className="mb-4 text-xs text-muted sm:hidden" aria-live="polite">
        {results.length} {results.length === 1 ? "product" : "products"}
      </p>

      {results.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-lg font-light">No products match these filters.</p>
          <button
            type="button"
            onClick={() => update(EMPTY_FILTERS)}
            className="mt-4 label-caps text-xs underline underline-offset-4"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <ul className={GRID_CLASS}>
          {paged.items.map((p) => (
            <li key={p.slug}>{cards[p.slug]}</li>
          ))}
        </ul>
      )}

      <Pagination
        page={paged.page}
        pageCount={paged.pageCount}
        hrefFor={(p) => hrefWith(filters, sort, p)}
      />

      {filtersMounted && (
        <FilterDrawer
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          products={products}
          options={options}
          value={filters}
          onApply={(f) => update(f)}
        />
      )}
    </>
  );
}
