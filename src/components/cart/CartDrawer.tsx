"use client";

import { RotateCcw, Truck } from "lucide-react";
import { useId } from "react";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Drawer } from "@/components/ui/Drawer";
import { formatPrice } from "@/lib/utils/formatPrice";
import { cartCount, cartSubtotal, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";

import { CartLine, FreeShippingProgress } from "./CartLine";

export function CartDrawer({ freeShippingThreshold }: { freeShippingThreshold: number }) {
  const open = useUI((s) => s.panel === "cart");
  const close = useUI((s) => s.close);
  const items = useCart((s) => s.items);
  const note = useCart((s) => s.note);
  const setNote = useCart((s) => s.setNote);
  const noteId = useId();
  const count = cartCount(items);
  const subtotal = cartSubtotal(items);

  return (
    <Drawer
      open={open}
      onClose={close}
      title={`Your bag${count ? ` (${count})` : ""}`}
      footer={
        items.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="label-caps text-xs">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <p className="text-xs text-muted">VAT included. Delivery calculated at checkout.</p>
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href="/cart/" variant="secondary" onClick={close}>
                View bag
              </ButtonLink>
              <ButtonLink href="/checkout/" onClick={close}>
                Checkout
              </ButtonLink>
            </div>
          </div>
        )
      }
    >
      {items.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-6 p-8 text-center">
          <p className="text-lg font-light">Your bag is empty</p>
          <p className="text-sm text-muted">
            Find something you love — new linen and cotton pieces are in.
          </p>
          <Button onClick={close} full>
            Continue shopping
          </Button>
        </div>
      ) : (
        <div className="px-5">
          <div className="border-b border-line py-4">
            <FreeShippingProgress subtotal={subtotal} threshold={freeShippingThreshold} />
          </div>
          <ul className="divide-y divide-line">
            {items.map((item) => (
              <CartLine key={item.sku} item={item} onNavigate={close} />
            ))}
          </ul>
          <div className="border-t border-line py-4">
            <label htmlFor={noteId} className="label-caps text-[11px]">
              Order instructions
            </label>
            <textarea
              id={noteId}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Gift note, delivery time preference…"
              className="mt-2 w-full border border-line p-3 text-sm outline-none focus:border-text"
            />
          </div>
          <ul className="space-y-2 pb-5 text-xs text-muted">
            <li className="flex items-center gap-2">
              <Truck className="size-4" aria-hidden /> Free delivery on orders over{" "}
              {formatPrice(freeShippingThreshold)}
            </li>
            <li className="flex items-center gap-2">
              <RotateCcw className="size-4" aria-hidden /> Easy 7-day exchanges
            </li>
          </ul>
        </div>
      )}
    </Drawer>
  );
}
