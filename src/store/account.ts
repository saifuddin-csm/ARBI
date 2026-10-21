"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { CartItem } from "@/types";

export type DemoUser = { name: string; email: string; phone?: string };

export type PlacedOrder = {
  number: string;
  placedAt: string;
  items: CartItem[];
  note: string;
  subtotal: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  customer: { name: string; email: string; phone: string; address: string; city: string };
};

type AccountState = {
  /** Demo sign-in only: nothing is sent anywhere in Phase 1. */
  user: DemoUser | null;
  lastOrder: PlacedOrder | null;
  signIn: (user: DemoUser) => void;
  signOut: () => void;
  setLastOrder: (order: PlacedOrder) => void;
};

export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      lastOrder: null,
      signIn: (user) => set({ user }),
      signOut: () => set({ user: null }),
      setLastOrder: (order) => set({ lastOrder: order }),
    }),
    { name: "arbi-account", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
