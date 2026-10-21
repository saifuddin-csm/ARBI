"use client";

import { Plus, X } from "lucide-react";
import { useState } from "react";

import { useAddToCart } from "@/lib/hooks/useAddToCart";
import type { ProductSummary } from "@/types";

type QuickAddProduct = Pick<
  ProductSummary,
  "id" | "slug" | "title" | "color" | "price" | "images" | "variants"
>;

/** Card "Add to bag" button; opens an inline size picker unless the product is one size. */
export function QuickAdd({ product }: { product: QuickAddProduct }) {
  const [picking, setPicking] = useState(false);
  const addToCart = useAddToCart();
  const oneSize = product.variants.length === 1;

  if (!picking) {
    return (
      <button
        type="button"
        onClick={() => (oneSize ? addToCart(product, product.variants[0]) : setPicking(true))}
        aria-haspopup={oneSize ? undefined : "true"}
        aria-label={`Quick add ${product.title}, ${product.color.name}`}
        className="absolute right-2 bottom-2 z-10 inline-flex h-9 items-center gap-1 bg-bg/95 px-3 label-caps text-[10px] shadow-sm transition-opacity hover:bg-text hover:text-bg focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
      >
        <Plus className="size-3" aria-hidden /> Add to bag
      </button>
    );
  }

  return (
    <div
      role="group"
      aria-label={`Choose a size for ${product.title}`}
      className="absolute inset-x-0 bottom-0 z-10 bg-bg/97 p-3"
      onKeyDown={(e) => e.key === "Escape" && setPicking(false)}
    >
      <div className="mb-2 flex items-center justify-between">
        <p className="label-caps text-[10px]">Select size</p>
        <button
          type="button"
          onClick={() => setPicking(false)}
          className="-mr-1 inline-flex size-7 items-center justify-center"
          aria-label="Close size picker"
        >
          <X className="size-3.5" aria-hidden />
        </button>
      </div>
      <ul className="flex flex-wrap gap-1">
        {product.variants.map((v, i) => (
          <li key={v.sku}>
            <button
              type="button"
              autoFocus={i === 0}
              disabled={v.stock <= 0}
              onClick={() => {
                addToCart(product, v);
                setPicking(false);
              }}
              className="h-9 min-w-9 border border-line px-2 text-xs hover:border-text disabled:text-muted disabled:line-through disabled:hover:border-line"
              aria-label={`${v.size}${v.stock <= 0 ? ", sold out" : ""}`}
            >
              {v.size}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
