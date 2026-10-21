"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";

import { Img } from "@/components/ui/Img";
import { PriceTag } from "@/components/ui/PriceTag";
import { useSearchIndex } from "@/lib/hooks/useSearchIndex";
import { matchesQuery } from "@/lib/utils/catalog";

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const q = (params.get("q") ?? "").trim();
  const [value, setValue] = useState(q);
  const { index, loading, error } = useSearchIndex(true);
  const id = useId();

  // Keep the box in sync when the query changes from elsewhere (e.g. the search drawer).
  const [lastQ, setLastQ] = useState(q);
  if (q !== lastQ) {
    setLastQ(q);
    setValue(q);
  }

  const results = q && index ? index.filter((e) => matchesQuery(e.keywords, q)) : [];

  return (
    <>
      <form
        role="search"
        className="mt-6 max-w-xl"
        onSubmit={(e) => {
          e.preventDefault();
          router.replace(`/search/?q=${encodeURIComponent(value.trim())}`);
        }}
      >
        <label htmlFor={id} className="sr-only">
          Search products
        </label>
        <div className="flex items-center gap-2 border-b border-text pb-2">
          <Search className="size-4 shrink-0" aria-hidden />
          <input
            id={id}
            type="search"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search for shirts, linen, panjabi…"
            className="w-full bg-transparent py-2 text-base outline-none placeholder:text-muted"
          />
          <button type="submit" className="label-caps text-xs hover:underline">
            Search
          </button>
        </div>
      </form>

      <div className="mt-10" aria-live="polite">
        {!q && <p className="text-sm text-muted">Type a word above to search the collection.</p>}
        {q && loading && <p className="text-sm text-muted">Searching…</p>}
        {q && error && <p className="text-sm text-sale">Search is unavailable right now.</p>}
        {q && index && (
          <>
            <p className="mb-6 text-sm">
              {results.length} {results.length === 1 ? "result" : "results"} for “{q}”
            </p>
            {results.length === 0 ? (
              <p className="text-sm text-muted">
                Try another word, or{" "}
                <Link href="/collections/all/" className="underline underline-offset-4">
                  browse everything
                </Link>
                .
              </p>
            ) : (
              <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
                {results.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/products/${r.slug}/`} className="group block">
                      <div className="aspect-[3/4] overflow-hidden bg-line">
                        <Img
                          media={r.image}
                          alt=""
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <p className="mt-3 text-sm group-hover:underline">{r.title}</p>
                      <p className="text-xs text-muted">{r.colorName}</p>
                    </Link>
                    <PriceTag price={r.price} compareAtPrice={r.compareAtPrice} className="mt-1" />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </>
  );
}
