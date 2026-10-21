"use client";

import dynamic from "next/dynamic";

import { useMountOnOpen } from "@/lib/hooks/useMountOnOpen";
import { useUI } from "@/store/ui";

const SearchDrawer = dynamic(() => import("./SearchDrawer").then((m) => m.SearchDrawer));

/** Loads the search drawer (and its index) the first time search is opened. */
export function LazySearchDrawer() {
  const open = useUI((s) => s.panel === "search");
  return useMountOnOpen(open) ? <SearchDrawer /> : null;
}
