import { cn } from "@/lib/utils/cn";
import type { ProductBadge } from "@/types";

type BadgeKind = ProductBadge | "soldout";

const STYLES: Record<BadgeKind, { label: string; className: string }> = {
  new: { label: "New", className: "bg-bg text-text" },
  sale: { label: "Sale", className: "bg-sale text-white" },
  bestseller: { label: "Best seller", className: "bg-text text-bg" },
  soldout: { label: "Sold out", className: "bg-muted text-white" },
};

export function Badge({ kind, className }: { kind: BadgeKind; className?: string }) {
  const s = STYLES[kind];
  return (
    <span
      className={cn(
        "inline-block px-2 py-1 label-caps text-[10px] leading-none",
        s.className,
        className,
      )}
    >
      {s.label}
    </span>
  );
}
