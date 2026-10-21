"use client";

import { Ruler, Truck } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { TrustIcon } from "@/components/ui/Icons";
import { Img } from "@/components/ui/Img";
import { PriceTag } from "@/components/ui/PriceTag";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { Rating } from "@/components/ui/Rating";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import { useMountOnOpen } from "@/lib/hooks/useMountOnOpen";
import { cn } from "@/lib/utils/cn";
import { useRecentlyViewed } from "@/store/recentlyViewed";
import type { ColorLink, Product, ProductSummary, SizeChart, TrustBadge } from "@/types";

// The size guide loads the first time someone opens it.
const SizeChartModal = dynamic(() => import("./SizeChartModal").then((m) => m.SizeChartModal));

type ProductDetailsProps = {
  product: Product;
  summary: ProductSummary;
  siblings: ColorLink[];
  sizeChart?: SizeChart;
  trustBadges: TrustBadge[];
  deliveryEstimate: string;
  shippingSummary: string;
};

export function ProductDetails({
  product,
  summary,
  siblings,
  sizeChart,
  trustBadges,
  deliveryEstimate,
  shippingSummary,
}: ProductDetailsProps) {
  const router = useRouter();
  const addToCart = useAddToCart();
  const record = useRecentlyViewed((s) => s.record);
  const oneSize = product.variants.length === 1;
  const [sku, setSku] = useState<string | null>(
    oneSize && product.variants[0].stock > 0 ? product.variants[0].sku : null,
  );
  const [qty, setQty] = useState(1);
  const [sizeError, setSizeError] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);
  const chartMounted = useMountOnOpen(chartOpen);
  const [showSticky, setShowSticky] = useState(false);
  const actionsRef = useRef<HTMLDivElement>(null);
  const sizeGroupRef = useRef<HTMLFieldSetElement>(null);
  const ids = useId();

  const variant = product.variants.find((v) => v.sku === sku);
  const soldOut = !summary.inStock;

  useEffect(() => {
    record(summary);
  }, [record, summary]);

  // Sticky mini add-to-cart bar once the main buttons scroll out of view (above the fold).
  useEffect(() => {
    const el = actionsRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) =>
      setShowSticky(!entry.isIntersecting && entry.boundingClientRect.top < 0),
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  function requireSize(): boolean {
    if (variant) return true;
    setSizeError(true);
    sizeGroupRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    sizeGroupRef.current?.querySelector<HTMLInputElement>("input:not(:disabled)")?.focus();
    return false;
  }

  function add() {
    if (requireSize() && variant) addToCart(product, variant, qty);
  }

  function buyNow() {
    if (!requireSize() || !variant) return;
    addToCart(product, variant, qty, { openDrawer: false });
    router.push("/checkout/");
  }

  return (
    <div>
      <h1 className="text-2xl font-light sm:text-3xl">{product.title}</h1>
      <p className="mt-1 text-sm text-muted">{product.color.name}</p>
      {product.rating !== undefined && (
        <a href="#reviews" className="mt-2 inline-block">
          <Rating value={product.rating} count={product.reviewCount} size="md" />
        </a>
      )}

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Product highlights">
        {product.tags.map((t) => (
          <li key={t} className="border border-line px-2 py-1 text-[11px] text-text/80">
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <PriceTag price={product.price} compareAtPrice={product.compareAtPrice} size="lg" />
        <p className="mt-1 text-xs text-muted">Inclusive of all taxes (VAT included).</p>
      </div>
      <p className="mt-4 text-sm leading-relaxed">{product.shortDescription}</p>

      {siblings.length > 1 && (
        <div className="mt-6">
          <p className="label-caps text-xs">
            Colour: <span className="text-muted normal-case">{product.color.name}</span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {siblings.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/products/${s.slug}/`}
                  replace
                  scroll={false}
                  aria-label={s.color.name}
                  aria-current={s.current ? "true" : undefined}
                  title={s.color.name}
                  className={cn(
                    "block size-9 rounded-full border border-black/15 ring-offset-2 ring-offset-bg",
                    s.current ? "ring-2 ring-text" : "hover:ring-1 hover:ring-muted",
                  )}
                  style={{ backgroundColor: s.color.hex }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {!oneSize && (
        <fieldset
          ref={sizeGroupRef}
          className="mt-6"
          aria-describedby={sizeError ? `${ids}-size-error` : undefined}
        >
          <div className="flex items-center justify-between">
            <legend className="label-caps text-xs">
              Size{variant && <span className="text-muted normal-case">: {variant.size}</span>}
            </legend>
            {sizeChart && (
              <button
                type="button"
                onClick={() => setChartOpen(true)}
                className="inline-flex items-center gap-1 text-xs underline underline-offset-4"
                aria-haspopup="dialog"
              >
                <Ruler className="size-4" aria-hidden /> Size chart
              </button>
            )}
          </div>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const out = v.stock <= 0;
              const checked = v.sku === sku;
              return (
                <li key={v.sku}>
                  <label
                    className={cn(
                      "relative flex h-11 min-w-14 items-center justify-center border px-3 text-sm has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-text",
                      out
                        ? "cursor-not-allowed border-line text-muted"
                        : "cursor-pointer hover:border-text",
                      checked && "border-text bg-text text-bg",
                      !checked && !out && "border-line",
                    )}
                  >
                    <input
                      type="radio"
                      name={`${ids}-size`}
                      value={v.sku}
                      checked={checked}
                      disabled={out}
                      onChange={() => {
                        setSku(v.sku);
                        setQty(1);
                        setSizeError(false);
                      }}
                      className="sr-only"
                    />
                    {v.size}
                    {out && (
                      <>
                        <span
                          aria-hidden
                          className="absolute inset-0 bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),var(--color-line)_50%,transparent_calc(50%+0.5px))]"
                        />
                        <span className="sr-only">, sold out</span>
                      </>
                    )}
                  </label>
                </li>
              );
            })}
          </ul>
          {variant && variant.stock <= 3 && (
            <p className="mt-2 text-xs text-sale">Only {variant.stock} left in this size.</p>
          )}
          {sizeError && (
            <p id={`${ids}-size-error`} className="mt-2 text-xs text-sale" role="alert">
              Please select a size.
            </p>
          )}
        </fieldset>
      )}

      <div ref={actionsRef} className="mt-6 space-y-3">
        {!soldOut && <QuantityStepper value={qty} onChange={setQty} max={variant?.stock ?? 10} />}
        <div className="grid gap-3 sm:grid-cols-2">
          <Button variant="secondary" onClick={add} disabled={soldOut} full>
            {soldOut ? "Sold out" : "Add to bag"}
          </Button>
          <Button onClick={buyNow} disabled={soldOut} full>
            Buy it now
          </Button>
        </div>
      </div>

      <p className="mt-5 flex items-start gap-2 text-sm">
        <Truck className="mt-0.5 size-4 shrink-0" aria-hidden />
        {deliveryEstimate}
      </p>

      <ul className="mt-6 grid grid-cols-3 gap-2 border-y border-line py-5 text-center">
        {trustBadges.map((b) => (
          <li key={b.title} className="flex flex-col items-center gap-1">
            <TrustIcon icon={b.icon} className="size-6" />
            <p className="label-caps text-[10px]">{b.title}</p>
            <p className="text-[11px] text-muted">{b.text}</p>
          </li>
        ))}
      </ul>

      <Accordion className="mt-6">
        <AccordionItem title="About the product" defaultOpen>
          <p>{product.description}</p>
        </AccordionItem>
        <AccordionItem title="Product details & care">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
            {product.details.map((d) => (
              <div key={d.label} className="contents">
                <dt className="text-muted">{d.label}</dt>
                <dd>{d.value}</dd>
              </div>
            ))}
            <div className="contents">
              <dt className="text-muted">SKU</dt>
              <dd>{variant?.sku ?? product.variants[0]?.sku.replace(/-[^-]+$/, "")}</dd>
            </div>
          </dl>
          <p className="mt-4 mb-2 font-medium">Care</p>
          <ul className="list-disc space-y-1 pl-5">
            {product.care.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </AccordionItem>
        <AccordionItem title="Shipping & returns">
          <p>{shippingSummary}</p>
          <p className="mt-2">
            Unworn items with tags can be exchanged within 7 days.{" "}
            <Link href="/policies/refund/" className="underline underline-offset-4">
              Read the refund policy
            </Link>
            .
          </p>
        </AccordionItem>
      </Accordion>

      {sizeChart && chartMounted && (
        <SizeChartModal chart={sizeChart} open={chartOpen} onClose={() => setChartOpen(false)} />
      )}

      {/* Sticky mini add-to-cart bar */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/97 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] transition-transform duration-300",
          showSticky ? "translate-y-0" : "translate-y-full",
        )}
        inert={!showSticky}
      >
        <div className="container-page flex items-center gap-3 py-3">
          <div className="hidden aspect-[3/4] w-10 shrink-0 overflow-hidden bg-line sm:block">
            <Img media={product.images[0]} alt="" className="size-full object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">{product.title}</p>
            <p className="text-xs text-muted">
              {product.color.name}
              {variant && !oneSize ? ` / ${variant.size}` : ""}
            </p>
          </div>
          <PriceTag
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            className="hidden sm:flex"
          />
          <Button onClick={add} disabled={soldOut} size="sm">
            {soldOut ? "Sold out" : variant ? "Add to bag" : "Select size"}
          </Button>
        </div>
      </div>
    </div>
  );
}
