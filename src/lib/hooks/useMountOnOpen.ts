"use client";

import { useState } from "react";

/**
 * True from the first time `open` is true onwards. Lets heavy drawers and modals load
 * (and hydrate) only once someone opens them, then stay mounted for their close animation.
 */
export function useMountOnOpen(open: boolean): boolean {
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  return mounted;
}
