"use client";

import { Plus, X } from "lucide-react";
import Link from "next/link";
import { useId, useState } from "react";

import { Badge } from "@/components/ui/Badge";
import { Img } from "@/components/ui/Img";
import { PriceTag } from "@/components/ui/PriceTag";
import { Rating } from "@/components/ui/Rating";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import { cn } from "@/lib/utils/cn";
import type { ProductSummary } from "@/types";

type ProductCardProps = { product: ProductSummary; priority?: boolean; className?: string };

export function ProductCard({ product, priority, className }: ProductCardProps) {
  const [picking, setPicking] = useState(false);
  const addToCart = useAddToCart();
  const pickerId = useId();
  const href = `/products/${product.slug}/`;
  const [front, back] = product.images;
  const oneSize = product.variants.length === 1;

  function quickAdd() {
    if (oneSize) addToCart(product, product.variants[0]);
    else setPicking(true);
  }

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className="relative aspect-[3/4] overflow-hidden bg-line">
        <div className="size-full">
          <Img
            media={front}
            priority={priority}
            alt=""
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-300",
              back && "group-hover:opacity-0",
            )}
          />
          {back && (
            <Img
              media={back}
              alt=""
              className="absolute inset-0 size-full scale-105 object-cover opacity-0 transition-[opacity,scale] duration-300 group-hover:scale-100 group-hover:opacity-100"
            />
          )}
        </div>

        <div className="pointer-events-none absolute top-2 left-2 flex flex-col items-start gap-1">
          {!product.inStock && <Badge kind="soldout" />}
          {product.inStock && product.badges.includes("sale") && <Badge kind="sale" />}
          {product.inStock && product.badges.includes("new") && <Badge kind="new" />}
        </div>

        {product.inStock && !picking && (
          <button
            type="button"
            onClick={quickAdd}
            aria-haspopup={oneSize ? undefined : "true"}
            aria-label={`Quick add ${product.title}, ${product.color.name}`}
            className="absolute right-2 bottom-2 z-10 inline-flex h-9 items-center gap-1 bg-bg/95 px-3 label-caps text-[10px] shadow-sm transition-opacity hover:bg-text hover:text-bg focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
          >
            <Plus className="size-3" aria-hidden /> Add to bag
          </button>
        )}

        {picking && (
          <div
            id={pickerId}
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
        )}
      </div>

      <div className="mt-3 flex flex-1 flex-col gap-1">
        {product.colors.length > 1 && (
          <ul
            className="relative z-10 mb-1 flex w-fit flex-wrap items-center gap-1.5"
            aria-label="Available colours"
          >
            {product.colors.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/products/${c.slug}/`}
                  title={c.color.name}
                  aria-label={`${c.color.name}${c.current ? " (shown)" : ""}`}
                  aria-current={c.current ? "true" : undefined}
                  className={cn(
                    "block size-4 rounded-full border border-black/15 ring-offset-2 ring-offset-bg",
                    c.current ? "ring-1 ring-text" : "hover:ring-1 hover:ring-muted",
                  )}
                  style={{ backgroundColor: c.color.hex }}
                />
              </li>
            ))}
          </ul>
        )}
        <h3 className="text-sm leading-snug">
          <Link
            href={href}
            className="after:absolute after:inset-0 after:content-[''] hover:underline"
          >
            {product.title}
          </Link>
        </h3>
        <p className="text-xs text-muted">{product.color.name}</p>
        {product.rating !== undefined && (
          <Rating value={product.rating} count={product.reviewCount} />
        )}
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} />
      </div>
    </article>
  );
}
