import Link from "next/link";

import { cn } from "@/lib/utils/cn";
import type { NavLink } from "@/types";

export function Breadcrumb({ items, className }: { items: NavLink[]; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs text-muted", className)}>
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-text">
                  {item.label}
                </span>
              ) : (
                <>
                  <Link href={item.href} className="hover:text-text hover:underline">
                    {item.label}
                  </Link>
                  <span aria-hidden>/</span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
