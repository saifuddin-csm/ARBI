import { TrustIcon } from "@/components/ui/Icons";
import { cn } from "@/lib/utils/cn";
import type { TrustBadge } from "@/types";

export function TrustStrip({ badges, className }: { badges: TrustBadge[]; className?: string }) {
  return (
    <ul
      className={cn("grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5", className)}
      aria-label="Why shop with ARBI"
    >
      {badges.map((b) => (
        <li
          key={b.title}
          className="flex flex-col items-center gap-2 text-center last:col-span-2 sm:last:col-span-1"
        >
          <TrustIcon icon={b.icon} className="size-7" />
          <p className="label-caps text-[11px]">{b.title}</p>
          <p className="text-xs text-muted">{b.text}</p>
        </li>
      ))}
    </ul>
  );
}
