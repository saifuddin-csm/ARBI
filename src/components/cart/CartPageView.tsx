"use client";

import { useId } from "react";

import { ButtonLink } from "@/components/ui/Button";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useHydrated } from "@/store/StoreHydrator";
import { cartCount, cartSubtotal, useCart } from "@/store/cart";

import { CartLine, FreeShippingProgress } from "./CartLine";

export function CartPageView({ freeShippingThreshold }: { freeShippingThreshold: number }) {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const note = useCart((s) => s.note);
  const setNote = useCart((s) => s.setNote);
  const noteId = useId();
  const subtotal = cartSubtotal(items);

  if (!hydrated) {
    return <div className="h-64 animate-pulse bg-line/50" aria-label="Loading your bag" />;
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-light">Your bag is empty.</p>
        <p className="mt-2 text-sm text-muted">Items you add will be saved here on this device.</p>
        <ButtonLink href="/collections/all/" className="mt-8">
          Continue shopping
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_24rem] lg:gap-16">
      <div>
        <p className="text-sm text-muted">
          {cartCount(items)} {cartCount(items) === 1 ? "item" : "items"}
        </p>
        <ul className="mt-2 divide-y divide-line border-y border-line">
          {items.map((item) => (
            <CartLine key={item.sku} item={item} />
          ))}
        </ul>
        <div className="mt-6 max-w-lg">
          <label htmlFor={noteId} className="label-caps text-xs">
            Order instructions
          </label>
          <textarea
            id={noteId}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="Gift note, delivery time preference…"
            className="mt-2 w-full border border-line p-3 text-sm outline-none focus:border-text"
          />
        </div>
      </div>
      <aside
        className="h-fit space-y-5 bg-line/40 p-6 lg:sticky lg:top-24"
        aria-label="Order summary"
      >
        <h2 className="label-caps text-sm">Order summary</h2>
        <FreeShippingProgress subtotal={subtotal} threshold={freeShippingThreshold} />
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between text-muted">
            <dt>Delivery</dt>
            <dd>{subtotal >= freeShippingThreshold ? "Free" : "Calculated at checkout"}</dd>
          </div>
        </dl>
        <p className="text-xs text-muted">VAT included.</p>
        <ButtonLink href="/checkout/" full>
          Checkout
        </ButtonLink>
        <ButtonLink href="/collections/all/" variant="ghost" full>
          Continue shopping
        </ButtonLink>
      </aside>
    </div>
  );
}
