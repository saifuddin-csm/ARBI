"use client";

import Link from "next/link";
import { useState } from "react";

import { Carousel } from "@/components/ui/Carousel";
import { Img } from "@/components/ui/Img";
import { PriceTag } from "@/components/ui/PriceTag";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import { cn } from "@/lib/utils/cn";
import type { HomeSection, ProductSummary } from "@/types";

type Data = Extract<HomeSection, { type: "shopTheLook" }>["data"];

function LookItem({ product }: { product: ProductSummary }) {
  const addToCart = useAddToCart();
  const firstInStock = product.variants.find((v) => v.stock > 0);
  const [size, setSize] = useState(firstInStock?.sku ?? "");
  const variant = product.variants.find((v) => v.sku === size);
  const oneSize = product.variants.length === 1;

  return (
    <div className="flex h-full flex-col">
      <Link href={`/products/${product.slug}/`} className="group block">
        <div className="aspect-[3/4] overflow-hidden bg-line">
          <Img media={product.images[0]} alt="" className="size-full object-cover" />
        </div>
        <p className="mt-3 text-sm group-hover:underline">{product.title}</p>
        <p className="text-xs text-muted">{product.color.name}</p>
      </Link>
      <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} className="mt-1" />
      <div className="mt-3 flex gap-2">
        {!oneSize && (
          <label className="min-w-0 flex-1">
            <span className="sr-only">Size for {product.title}</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="h-10 w-full border border-line bg-bg px-2 text-sm"
            >
              {product.variants.map((v) => (
                <option key={v.sku} value={v.sku} disabled={v.stock <= 0}>
                  {v.size}
                  {v.stock <= 0 ? " — sold out" : ""}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          type="button"
          disabled={!variant || variant.stock <= 0}
          onClick={() => variant && addToCart(product, variant)}
          className={cn(
            "h-10 bg-text px-3 label-caps text-[10px] text-bg hover:bg-text/85 disabled:opacity-40",
            oneSize && "flex-1",
          )}
        >
          Add to bag<span className="sr-only">: {product.title}</span>
        </button>
      </div>
    </div>
  );
}

export function ShopTheLook({ data }: { data: Data }) {
  return (
    <section className="container-page border-t border-line section-space">
      <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16">
        <div className="aspect-[4/5] overflow-hidden bg-line">
          <Img media={data.image} className="size-full object-cover" />
        </div>
        <div className="min-w-0">
          <h2 className="text-2xl font-light sm:text-3xl">{data.heading}</h2>
          {data.text && <p className="mt-3 max-w-md text-sm text-muted">{data.text}</p>}
          <Carousel
            label={data.heading}
            className="mt-8"
            slideClassName="basis-[60%] sm:basis-[40%] lg:basis-[46%]"
          >
            {data.products.map((p) => (
              <LookItem key={p.slug} product={p} />
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
