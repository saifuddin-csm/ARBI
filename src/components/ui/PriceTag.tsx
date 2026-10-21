import { formatPrice } from "@/lib/utils/formatPrice";
import { cn } from "@/lib/utils/cn";

type PriceTagProps = {
  price: number;
  compareAtPrice?: number;
  className?: string;
  size?: "sm" | "lg";
};

export function PriceTag({ price, compareAtPrice, className, size = "sm" }: PriceTagProps) {
  const onSale = compareAtPrice !== undefined && compareAtPrice > price;
  return (
    <p
      className={cn(
        "flex flex-wrap items-baseline gap-x-2",
        size === "lg" ? "text-xl" : "text-sm",
        className,
      )}
    >
      {onSale ? (
        <>
          <span className="sr-only">Sale price</span>
          <span className="text-sale">{formatPrice(price)}</span>
          <span className="sr-only">Regular price</span>
          <s className="text-muted">{formatPrice(compareAtPrice)}</s>
        </>
      ) : (
        <span>{formatPrice(price)}</span>
      )}
    </p>
  );
}
