"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem } from "@/types";

type CartState = {
  items: CartItem[];
  note: string;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  remove: (sku: string) => void;
  setNote: (note: string) => void;
  clear: () => void;
};

// Phase 1: the cart lives in localStorage. Phase 2 replaces this with a server cart id.
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      note: "",
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.sku === item.sku);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.sku === item.sku ? { ...i, ...item, qty: Math.min(i.qty + qty, item.maxQty) } : i,
              ),
            };
          }
          return { items: [...s.items, { ...item, qty: Math.min(qty, item.maxQty) }] };
        }),
      setQty: (sku, qty) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.sku === sku ? { ...i, qty: Math.min(Math.max(qty, 0), i.maxQty) } : i))
            .filter((i) => i.qty > 0),
        })),
      remove: (sku) => set((s) => ({ items: s.items.filter((i) => i.sku !== sku) })),
      setNote: (note) => set({ note }),
      clear: () => set({ items: [], note: "" }),
    }),
    {
      name: "arbi-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      skipHydration: true,
    },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.qty, 0);
export const cartSubtotal = (items: CartItem[]) => items.reduce((n, i) => n + i.qty * i.price, 0);
