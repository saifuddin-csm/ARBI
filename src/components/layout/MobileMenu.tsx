"use client";

import { ChevronLeft, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { Drawer } from "@/components/ui/Drawer";
import { SocialLinks } from "@/components/ui/Icons";
import type { NavGroup, NavItem, Navigation, SocialLink } from "@/types";

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
  navigation: Navigation;
  socials: SocialLink[];
};

type Level = { item: NavItem } | { item: NavItem; group: NavGroup } | null;

const row =
  "flex min-h-12 w-full items-center justify-between border-b border-line px-5 text-left text-sm hover:bg-line/50";

/** Mobile drawer with drill-down levels: Men → Top wear → Shirts, each with Back and View all. */
export function MobileMenu({ open, onClose, navigation, socials }: MobileMenuProps) {
  const [level, setLevel] = useState<Level>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  // Reset to the top level whenever the drawer closes.
  const [wasOpen, setWasOpen] = useState(open);
  if (open !== wasOpen) {
    setWasOpen(open);
    if (!open) setLevel(null);
  }

  useEffect(() => {
    if (level) backRef.current?.focus();
  }, [level]);

  const back = () => setLevel(level && "group" in level ? { item: level.item } : null);

  let body;
  if (!level) {
    body = (
      <>
        <ul>
          {navigation.main.map((item) => (
            <li key={item.label}>
              {item.groups?.length ? (
                <button type="button" className={row} onClick={() => setLevel({ item })}>
                  <span className="label-caps text-xs font-semibold">{item.label}</span>
                  <ChevronRight className="size-4" aria-hidden />
                </button>
              ) : (
                <Link href={item.href} className={row} onClick={onClose}>
                  <span className="label-caps text-xs font-semibold">{item.label}</span>
                </Link>
              )}
            </li>
          ))}
        </ul>
        <div className="px-5 pt-8">
          <p className="mb-3 label-caps text-[11px] text-muted">Shop by collection</p>
          <ul className="space-y-3">
            {navigation.footer.collections.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={onClose} className="text-sm hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 mb-3 label-caps text-[11px] text-muted">Help</p>
          <ul className="space-y-3">
            <li>
              <Link
                href="/account/"
                onClick={onClose}
                className="inline-flex items-center gap-2 text-sm hover:underline"
              >
                <User className="size-4" aria-hidden /> Account
              </Link>
            </li>
            {navigation.secondary.map((l) => (
              <li key={l.href}>
                <Link href={l.href} onClick={onClose} className="text-sm hover:underline">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <SocialLinks socials={socials} className="mt-8 -ml-2 flex gap-1 pb-8" />
        </div>
      </>
    );
  } else {
    const { item } = level;
    const group = "group" in level ? level.group : undefined;
    body = (
      <>
        <button ref={backRef} type="button" onClick={back} className={`${row} justify-start gap-2`}>
          <ChevronLeft className="size-4" aria-hidden />
          <span className="label-caps text-xs">Back</span>
        </button>
        <p className="px-5 pt-6 pb-2 label-caps text-sm">{group ? group.title : item.label}</p>
        <ul>
          <li>
            <Link
              href={item.href}
              onClick={onClose}
              className={`${row} underline underline-offset-4`}
            >
              View all {group ? `${item.label} — ${group.title}` : item.label}
            </Link>
          </li>
          {group
            ? group.links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} onClick={onClose} className={row}>
                    {l.label}
                  </Link>
                </li>
              ))
            : item.groups?.map((g) => (
                <li key={g.title}>
                  <button
                    type="button"
                    className={row}
                    onClick={() => setLevel({ item, group: g })}
                  >
                    {g.title}
                    <ChevronRight className="size-4" aria-hidden />
                  </button>
                </li>
              ))}
        </ul>
      </>
    );
  }

  return (
    <Drawer open={open} onClose={onClose} side="right" title="Menu">
      <nav aria-label="Mobile">
        {/* Re-keyed per level so each drill-down step fades in. */}
        <div
          key={level ? `${level.item.label}/${"group" in level ? level.group.title : ""}` : "root"}
          className="animate-fade-up"
        >
          {body}
        </div>
      </nav>
    </Drawer>
  );
}
