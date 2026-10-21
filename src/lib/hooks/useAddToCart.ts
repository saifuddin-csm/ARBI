"use client";

import { useCallback } from "react";

import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import type { Media, ProductColor, Variant } from "@/types";

type Addable = {
  id: string;
  slug: string;
  title: string;
  color: ProductColor;
  price: number;
  images: Media[];
};

/** Adds a variant to the bag and opens the cart drawer (or skips the drawer for Buy now). */
export function useAddToCart() {
  const add = useCart((s) => s.add);
  const open = useUI((s) => s.open);
  return useCallback(
    (product: Addable, variant: Variant, qty = 1, { openDrawer = true } = {}) => {
      if (variant.stock <= 0) return;
      add(
        {
          sku: variant.sku,
          productId: product.id,
          size: variant.size,
          slug: product.slug,
          title: product.title,
          colorName: product.color.name,
          price: product.price,
          image: product.images[0],
          maxQty: variant.stock,
        },
        qty,
      );
      if (openDrawer) open("cart");
    },
    [add, open],
  );
}
