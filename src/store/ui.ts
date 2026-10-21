"use client";

import { create } from "zustand";

type Panel = "cart" | "search" | "menu" | null;

type UIState = {
  panel: Panel;
  open: (panel: Exclude<Panel, null>) => void;
  close: () => void;
};

/** Which global drawer is open. Only one at a time. */
export const useUI = create<UIState>()((set) => ({
  panel: null,
  open: (panel) => set({ panel }),
  close: () => set({ panel: null }),
}));
