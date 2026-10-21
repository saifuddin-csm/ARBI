import { Star } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type RatingProps = { value: number; count?: number; className?: string; size?: "sm" | "md" };

export function Rating({ value, count, className, size = "sm" }: RatingProps) {
  const icon = size === "sm" ? "size-3" : "size-4";
  return (
    <div className={cn("flex items-center gap-1 text-xs text-muted", className)}>
      <span className="sr-only">
        Rated {value.toFixed(1)} out of 5{count !== undefined ? `, ${count} reviews` : ""}
      </span>
      <span className="flex" aria-hidden>
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={cn(icon, i <= Math.round(value) ? "fill-text text-text" : "text-line")}
          />
        ))}
      </span>
      {count !== undefined && <span aria-hidden>({count})</span>}
    </div>
  );
}
