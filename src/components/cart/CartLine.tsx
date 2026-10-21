"use client";

import Link from "next/link";

import { Img } from "@/components/ui/Img";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useCart } from "@/store/cart";
import type { CartItem } from "@/types";

export function CartLine({ item, onNavigate }: { item: CartItem; onNavigate?: () => void }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  return (
    <li className="flex gap-4 py-5">
      <Link
        href={`/products/${item.slug}/`}
        onClick={onNavigate}
        className="block w-20 shrink-0 sm:w-24"
      >
        <div className="aspect-[3/4] overflow-hidden bg-line">
          <Img
            media={item.image}
            alt={`${item.title} in ${item.colorName}`}
            className="size-full object-cover"
          />
        </div>
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}/`}
              onClick={onNavigate}
              className="text-sm hover:underline"
            >
              {item.title}
            </Link>
            <p className="mt-1 text-xs text-muted">
              {item.colorName} / {item.size}
            </p>
          </div>
          <p className="text-sm whitespace-nowrap">{formatPrice(item.price * item.qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="sm"
            value={item.qty}
            max={item.maxQty}
            onChange={(q) => setQty(item.sku, q)}
            label={`Quantity of ${item.title}`}
          />
          <button
            type="button"
            onClick={() => remove(item.sku)}
            className="text-xs text-muted underline underline-offset-4 hover:text-text"
          >
            Remove<span className="sr-only"> {item.title}</span>
          </button>
        </div>
        {item.qty >= item.maxQty && (
          <p className="mt-2 text-xs text-muted">Only {item.maxQty} in stock.</p>
        )}
      </div>
    </li>
  );
}

export function FreeShippingProgress({
  subtotal,
  threshold,
}: {
  subtotal: number;
  threshold: number;
}) {
  const remaining = Math.max(0, threshold - subtotal);
  const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
  return (
    <div>
      <p className="text-xs" aria-live="polite">
        {remaining > 0 ? (
          <>
            You are <strong>{formatPrice(remaining)}</strong> away from free delivery.
          </>
        ) : (
          <>You&apos;ve unlocked free delivery.</>
        )}
      </p>
      <div
        className="mt-2 h-1 w-full bg-line"
        role="progressbar"
        aria-label="Progress towards free delivery"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div
          className="h-full bg-text transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
