"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";

import { Img } from "@/components/ui/Img";
import { cn } from "@/lib/utils/cn";
import type { NavItem } from "@/types";

/**
 * Desktop navigation (disclosure pattern): each top-level item is a button that opens a
 * full-width panel on hover, click or Enter/Space. Esc or leaving the menu closes it.
 */
export function MegaMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const pathname = usePathname();
  const baseId = useId();

  // Close on route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(null);
  }

  useEffect(() => {
    if (open === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        const btn = navRef.current?.querySelector<HTMLButtonElement>(`[data-menu-index="${open}"]`);
        setOpen(null);
        btn?.focus();
      }
    }
    function onPointer(e: PointerEvent) {
      if (!navRef.current?.contains(e.target as Node)) setOpen(null);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const hoverOpen = (i: number) => {
    window.clearTimeout(closeTimer.current);
    setOpen(i);
  };
  const hoverClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(null), 150);
  };

  return (
    <nav ref={navRef} aria-label="Main" className="hidden lg:block" onMouseLeave={hoverClose}>
      <ul className="flex items-center gap-1">
        {items.map((item, i) => {
          const panelId = `${baseId}-panel-${i}`;
          const isOpen = open === i;
          const label =
            "relative flex h-11 items-center gap-1 px-3 label-caps text-xs font-semibold";
          // Bar under the label that grows from the centre on hover / when open.
          const bar = (active: boolean) =>
            cn(
              "pointer-events-none absolute inset-x-3 bottom-2 h-px origin-center bg-text transition-transform duration-300 ease-out",
              active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
            );
          if (!item.groups?.length) {
            return (
              <li key={item.label} onMouseEnter={hoverClose}>
                <Link href={item.href} className={cn(label, "group")}>
                  {item.label}
                  <span aria-hidden className={bar(false)} />
                </Link>
              </li>
            );
          }
          return (
            <li key={item.label} onMouseEnter={() => hoverOpen(i)}>
              <button
                type="button"
                data-menu-index={i}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(label, "group")}
              >
                {item.label}
                <ChevronDown
                  className={cn(
                    "size-3 transition-transform duration-300 ease-out",
                    isOpen && "rotate-180",
                  )}
                  aria-hidden
                />
                <span aria-hidden className={bar(isOpen)} />
              </button>
              <div
                id={panelId}
                inert={!isOpen}
                onMouseEnter={() => hoverOpen(i)}
                className={cn(
                  "absolute inset-x-0 top-full border-t border-b border-line bg-bg shadow-[0_12px_24px_-12px_rgba(0,0,0,0.12)] transition-[opacity,translate,visibility] duration-300 ease-out",
                  isOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0",
                )}
              >
                <div className="container-page flex gap-12 py-10">
                  <div className="grid flex-1 grid-cols-4 gap-8">
                    <div className="col-span-4 -mb-2">
                      <Link
                        href={item.href}
                        className="group inline-flex items-center gap-2 label-caps text-xs font-semibold"
                      >
                        <span className="link-underline">View all {item.label}</span>
                      </Link>
                    </div>
                    {item.groups.map((group) => (
                      <div key={group.title}>
                        <p className="mb-4 label-caps text-[11px] font-semibold text-muted">
                          {group.title}
                        </p>
                        <ul className="space-y-3">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link
                                href={link.href}
                                className="link-underline text-sm text-text/80 hover:text-text"
                              >
                                {link.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  {item.feature && (
                    <Link href={item.feature.href} className="group block w-56 shrink-0">
                      <div className="aspect-[3/4] overflow-hidden bg-line">
                        <Img
                          media={item.feature.image}
                          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-3 label-caps text-xs font-semibold">
                        <span className="link-underline">{item.feature.title}</span>
                      </p>
                    </Link>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
