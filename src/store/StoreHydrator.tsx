"use client";

import { useEffect, useSyncExternalStore } from "react";

import { useAccount } from "./account";
import { useCart } from "./cart";
import { useRecentlyViewed } from "./recentlyViewed";

/**
 * Persisted stores skip automatic hydration so the first client render matches the
 * prerendered HTML; this loads them from localStorage right after mount.
 */
export function StoreHydrator() {
  useEffect(() => {
    void useCart.persist.rehydrate();
    void useRecentlyViewed.persist.rehydrate();
    void useAccount.persist.rehydrate();
  }, []);
  return null;
}

/** True once the persisted stores have loaded; use it to avoid flashing empty states. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useAccount.persist.onFinishHydration(onChange),
    () => useAccount.persist.hasHydrated() && useCart.persist.hasHydrated(),
    () => false,
  );
}
