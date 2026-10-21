import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Img } from "@/components/ui/Img";
import { PriceTag } from "@/components/ui/PriceTag";
import { Rating } from "@/components/ui/Rating";
import { cn } from "@/lib/utils/cn";
import type { ProductSummary } from "@/types";

import { QuickAdd } from "./QuickAdd";

type ProductCardProps = { product: ProductSummary; priority?: boolean; className?: string };

// Server-renderable card; only the quick-add control hydrates on the client.
export function ProductCard({ product, priority, className }: ProductCardProps) {
  const href = `/products/${product.slug}/`;
  const [front, back] = product.images;

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

        {product.inStock && (
          <QuickAdd
            product={{
              id: product.id,
              slug: product.slug,
              title: product.title,
              color: product.color,
              price: product.price,
              images: [front],
              variants: product.variants,
            }}
          />
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
