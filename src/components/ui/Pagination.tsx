import Link from "next/link";

import { cn } from "@/lib/utils/cn";

type PaginationProps = { page: number; pageCount: number; hrefFor: (page: number) => string };

export function Pagination({ page, pageCount, hrefFor }: PaginationProps) {
  if (pageCount <= 1) return null;
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1);
  const item = "inline-flex min-w-10 h-10 items-center justify-center px-3 text-sm";
  return (
    <nav aria-label="Pagination" className="mt-12 flex justify-center">
      <ul className="flex items-center gap-1">
        <li>
          {page > 1 ? (
            <Link
              href={hrefFor(page - 1)}
              className={cn(item, "label-caps text-xs hover:underline")}
              scroll
            >
              Previous
            </Link>
          ) : (
            <span className={cn(item, "label-caps text-xs text-muted")} aria-disabled="true">
              Previous
            </span>
          )}
        </li>
        {pages.map((p) => (
          <li key={p}>
            <Link
              href={hrefFor(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                item,
                p === page ? "border-b-2 border-text" : "text-muted hover:text-text",
              )}
            >
              {p}
            </Link>
          </li>
        ))}
        <li>
          {page < pageCount ? (
            <Link
              href={hrefFor(page + 1)}
              className={cn(item, "label-caps text-xs hover:underline")}
            >
              Next
            </Link>
          ) : (
            <span className={cn(item, "label-caps text-xs text-muted")} aria-disabled="true">
              Next
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
