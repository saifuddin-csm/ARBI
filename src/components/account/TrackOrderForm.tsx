"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { trackOrderSchema } from "@/lib/schemas";
import { formatPrice } from "@/lib/utils/formatPrice";
import type { Order } from "@/types";

import { OrderTimeline } from "./OrderTimeline";

type Input = z.input<typeof trackOrderSchema>;
type Values = z.output<typeof trackOrderSchema>;

const digits = (s: string) => s.replace(/\D/g, "").slice(-10);

/** Demo tracking: looks the order up in the sample orders by number + phone or email. */
export function TrackOrderForm({ orders }: { orders: Order[] }) {
  const [result, setResult] = useState<Order | null | undefined>(undefined);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input, unknown, Values>({ resolver: zodResolver(trackOrderSchema) });

  function onSubmit({ orderNumber, contact }: Values) {
    const c = contact.toLowerCase();
    const found = orders.find(
      (o) =>
        o.number === orderNumber &&
        (o.email.toLowerCase() === c || (digits(c).length >= 10 && digits(o.phone) === digits(c))),
    );
    setResult(found ?? null);
  }

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="space-y-4"
        aria-label="Track order"
      >
        <TextField
          label="Order number"
          placeholder="ARBI-10421"
          error={errors.orderNumber?.message}
          {...register("orderNumber")}
        />
        <TextField
          label="Phone number or email"
          placeholder="01XXXXXXXXX or you@example.com"
          error={errors.contact?.message}
          {...register("contact")}
        />
        <Button type="submit" className="w-full sm:w-auto">
          Track order
        </Button>
        <p className="text-xs text-muted">
          Demo: try order <strong>ARBI-10421</strong> with phone <strong>01700000000</strong>.
        </p>
      </form>

      <div aria-live="polite">
        {result === null && (
          <p className="border border-line p-4 text-sm">
            We couldn&apos;t find an order with those details. Check the order number and use the
            phone or email from checkout.
          </p>
        )}
        {result && (
          <div className="border border-line p-6">
            <p className="text-sm text-muted">Order</p>
            <p className="text-xl font-light">{result.number}</p>
            <p className="mt-1 mb-6 text-sm text-muted">
              {result.items.length} {result.items.length === 1 ? "item" : "items"} ·{" "}
              {formatPrice(result.total)}
            </p>
            <OrderTimeline order={result} />
          </div>
        )}
      </div>
    </div>
  );
}
