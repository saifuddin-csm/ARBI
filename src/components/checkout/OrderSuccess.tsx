"use client";

import { CheckCircle2 } from "lucide-react";

import { ButtonLink } from "@/components/ui/Button";
import { Img } from "@/components/ui/Img";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useHydrated } from "@/store/StoreHydrator";
import { useAccount } from "@/store/account";

export function OrderSuccess() {
  const hydrated = useHydrated();
  const order = useAccount((s) => s.lastOrder);

  if (!hydrated) return <div className="h-64 animate-pulse bg-line/50" />;

  if (!order) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-3xl font-light">No recent order</h1>
        <p className="mt-3 text-sm text-muted">Orders you place on this device will show here.</p>
        <ButtonLink href="/collections/all/" className="mt-8">
          Start shopping
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="text-center">
        <CheckCircle2 className="mx-auto size-12" strokeWidth={1.25} aria-hidden />
        <h1 className="mt-4 text-3xl font-light sm:text-4xl">
          Thank you, {order.customer.name.split(" ")[0]}!
        </h1>
        <p className="mt-3 text-sm text-muted">
          Order <strong className="text-text">{order.number}</strong> has been placed.
        </p>
        <p className="mx-auto mt-4 max-w-md border border-line p-3 text-xs">
          Preview build: this is a demo confirmation. No order was sent, no payment was taken and no
          message was delivered.
        </p>
      </div>

      <section className="mt-10 border-t border-line pt-8" aria-label="Order details">
        <ul className="space-y-4">
          {order.items.map((item) => (
            <li key={item.sku} className="flex gap-4 text-sm">
              <div className="aspect-[3/4] w-16 shrink-0 bg-line">
                <Img media={item.image} alt="" className="size-full object-cover" />
              </div>
              <div className="flex-1">
                <p>{item.title}</p>
                <p className="text-xs text-muted">
                  {item.colorName} / {item.size} · Qty {item.qty}
                </p>
              </div>
              <p>{formatPrice(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="mt-6 space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(order.subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery</dt>
            <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
          </div>
          <div className="flex justify-between text-base font-medium">
            <dt>Total</dt>
            <dd>{formatPrice(order.total)}</dd>
          </div>
        </dl>
        <div className="mt-8 grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <h2 className="mb-2 label-caps text-xs">Delivery to</h2>
            <p>{order.customer.name}</p>
            <p className="text-muted">
              {order.customer.address}, {order.customer.city}
            </p>
            <p className="text-muted">{order.customer.phone}</p>
          </div>
          <div>
            <h2 className="mb-2 label-caps text-xs">Payment</h2>
            <p>{order.paymentMethod}</p>
            {order.note && <p className="mt-2 text-muted">Note: {order.note}</p>}
          </div>
        </div>
      </section>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/collections/all/">Continue shopping</ButtonLink>
        <ButtonLink href="/track-order/" variant="secondary">
          Track an order
        </ButtonLink>
      </div>
    </div>
  );
}
