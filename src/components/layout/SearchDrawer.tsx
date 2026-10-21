"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useId, useState } from "react";

import { Drawer } from "@/components/ui/Drawer";
import { Img } from "@/components/ui/Img";
import { PriceTag } from "@/components/ui/PriceTag";
import { useSearchIndex } from "@/lib/hooks/useSearchIndex";
import { matchesQuery } from "@/lib/utils/catalog";
import { useUI } from "@/store/ui";

const POPULAR = ["Linen", "Shirts", "Tees", "Dresses", "Denim", "Tote"];
const MAX_RESULTS = 6;

export function SearchDrawer() {
  const open = useUI((s) => s.panel === "search");
  const close = useUI((s) => s.close);
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query.trim());
  const { index, loading, error } = useSearchIndex(open);
  const inputId = useId();

  const results = deferred && index ? index.filter((e) => matchesQuery(e.keywords, deferred)) : [];

  function submit(q: string) {
    if (!q.trim()) return;
    close();
    router.push(`/search/?q=${encodeURIComponent(q.trim())}`);
  }

  return (
    <Drawer open={open} onClose={close} title="Search">
      <form
        role="search"
        className="border-b border-line p-5"
        onSubmit={(e) => {
          e.preventDefault();
          submit(query);
        }}
      >
        <label htmlFor={inputId} className="sr-only">
          Search products
        </label>
        <div className="flex items-center gap-2 border-b border-text pb-2">
          <Search className="size-4 shrink-0" aria-hidden />
          <input
            id={inputId}
            data-autofocus
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for shirts, linen, dresses…"
            autoComplete="off"
            className="w-full bg-transparent py-2 text-base outline-none placeholder:text-muted"
            aria-controls={`${inputId}-results`}
          />
        </div>
      </form>

      <div id={`${inputId}-results`} className="p-5" aria-live="polite">
        {!deferred && (
          <>
            <p className="mb-3 label-caps text-[11px] text-muted">Popular searches</p>
            <ul className="flex flex-wrap gap-2">
              {POPULAR.map((term) => (
                <li key={term}>
                  <button
                    type="button"
                    onClick={() => setQuery(term)}
                    className="border border-line px-3 py-2 text-sm hover:border-text"
                  >
                    {term}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {deferred && loading && <p className="text-sm text-muted">Searching…</p>}
        {deferred && error && <p className="text-sm text-sale">Search is unavailable right now.</p>}
        {deferred && index && (
          <>
            <p className="mb-4 label-caps text-[11px] text-muted">
              {results.length} {results.length === 1 ? "result" : "results"}
            </p>
            {results.length === 0 ? (
              <p className="text-sm">
                No products match “{deferred}”. Try a different word, like “linen” or “tee”.
              </p>
            ) : (
              <ul className="space-y-4">
                {results.slice(0, MAX_RESULTS).map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/products/${r.slug}/`}
                      onClick={close}
                      className="group flex items-center gap-4"
                    >
                      <div className="aspect-[3/4] w-16 shrink-0 overflow-hidden bg-line">
                        <Img media={r.image} alt="" className="size-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm group-hover:underline">{r.title}</p>
                        <p className="text-xs text-muted">{r.colorName}</p>
                        <PriceTag
                          price={r.price}
                          compareAtPrice={r.compareAtPrice}
                          className="mt-1"
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {results.length > 0 && (
              <button
                type="button"
                onClick={() => submit(deferred)}
                className="mt-6 label-caps text-xs underline underline-offset-4"
              >
                View all {results.length} results
              </button>
            )}
          </>
        )}
      </div>
    </Drawer>
  );
}
