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
          return (
            <li key={item.label} onMouseEnter={() => hoverOpen(i)}>
              <button
                type="button"
                data-menu-index={i}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className={cn(
                  "flex h-11 items-center gap-1 px-3 label-caps text-xs",
                  isOpen && "underline underline-offset-8",
                )}
              >
                {item.label}
                <ChevronDown
                  className={cn("size-3 transition-transform", isOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
              <div
                id={panelId}
                hidden={!isOpen}
                onMouseEnter={() => hoverOpen(i)}
                className="absolute inset-x-0 top-full border-t border-b border-line bg-bg shadow-sm"
              >
                <div className="container-page flex gap-12 py-10">
                  <div className="grid flex-1 grid-cols-4 gap-8">
                    <div className="col-span-4 -mb-2">
                      <Link
                        href={item.href}
                        className="label-caps text-xs underline underline-offset-4 hover:no-underline"
                      >
                        View all {item.label}
                      </Link>
                    </div>
                    {item.groups?.map((group) => (
                      <div key={group.title}>
                        <p className="mb-4 label-caps text-[11px] text-muted">{group.title}</p>
                        <ul className="space-y-3">
                          {group.links.map((link) => (
                            <li key={link.href}>
                              <Link href={link.href} className="text-sm hover:underline">
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
                          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <p className="mt-3 label-caps text-xs">{item.feature.title}</p>
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
