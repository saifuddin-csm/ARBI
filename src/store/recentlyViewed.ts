"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { ProductSummary } from "@/types";

const LIMIT = 12;

type RecentlyViewedState = {
  products: ProductSummary[];
  record: (product: ProductSummary) => void;
};

export const useRecentlyViewed = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      products: [],
      record: (product) =>
        set((s) => ({
          products: [product, ...s.products.filter((p) => p.slug !== product.slug)].slice(0, LIMIT),
        })),
    }),
    {
      name: "arbi-recently-viewed",
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);
