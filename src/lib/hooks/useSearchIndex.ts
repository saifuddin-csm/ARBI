"use client";

import { useEffect, useState } from "react";

import { assetPath } from "@/lib/utils/assetPath";
import type { SearchEntry } from "@/types";

let cache: Promise<SearchEntry[]> | undefined;

function load(): Promise<SearchEntry[]> {
  cache ??= fetch(assetPath("/search-index.json"))
    .then((r) => {
      if (!r.ok) throw new Error(`search index ${r.status}`);
      return r.json() as Promise<SearchEntry[]>;
    })
    .catch((e) => {
      cache = undefined;
      throw e;
    });
  return cache;
}

/** Loads the prebuilt search index (out/search-index.json) once, when `enabled` first becomes true. */
export function useSearchIndex(enabled = true) {
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!enabled || index) return;
    let alive = true;
    load()
      .then((data) => alive && setIndex(data))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, [enabled, index]);

  return { index, error, loading: enabled && !index && !error };
}
