import { Check } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import type { Order, OrderStatus } from "@/types";

export const STATUS_LABELS: Record<OrderStatus, string> = {
  placed: "Order placed",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const PIPELINE: OrderStatus[] = ["placed", "confirmed", "packed", "shipped", "delivered"];

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Dhaka",
  });

/** Status pipeline: placed → confirmed → packed → shipped → delivered (or cancelled). */
export function OrderTimeline({ order }: { order: Order }) {
  const steps: OrderStatus[] =
    order.status === "cancelled" ? order.history.map((h) => h.status) : PIPELINE;
  return (
    <ol className="space-y-0" aria-label={`Status: ${STATUS_LABELS[order.status]}`}>
      {steps.map((status, i) => {
        const event = order.history.find((h) => h.status === status);
        const done = Boolean(event);
        const last = i === steps.length - 1;
        return (
          <li key={status} className="relative flex gap-4 pb-6 last:pb-0">
            {!last && (
              <span
                aria-hidden
                className={cn("absolute top-6 left-3 h-full w-px", done ? "bg-text" : "bg-line")}
              />
            )}
            <span
              className={cn(
                "relative z-10 flex size-6 shrink-0 items-center justify-center rounded-full border",
                done ? "border-text bg-text text-bg" : "border-line bg-bg",
                status === "cancelled" && "border-sale bg-sale",
              )}
            >
              {done && <Check className="size-3.5" aria-hidden />}
            </span>
            <div className="text-sm">
              <p className={cn(!done && "text-muted")}>
                {STATUS_LABELS[status]}
                <span className="sr-only">{done ? ", done" : ", pending"}</span>
              </p>
              {event && (
                <p className="text-xs text-muted">
                  <time dateTime={event.at}>{when(event.at)}</time>
                  {event.note && ` — ${event.note}`}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
