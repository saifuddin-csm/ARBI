"use client";

import { Menu, Search, ShoppingBag, User } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/ui/Logo";
import { useMountOnOpen } from "@/lib/hooks/useMountOnOpen";
import { cn } from "@/lib/utils/cn";
import { cartCount, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import type { Navigation, SocialLink } from "@/types";

import { MegaMenu } from "./MegaMenu";
// The mobile menu loads the first time it is opened.
const MobileMenu = dynamic(() => import("./MobileMenu").then((m) => m.MobileMenu));

const iconBtn = "size-11 items-center justify-center hover:opacity-70";

export function SiteHeader({
  navigation,
  socials,
}: {
  navigation: Navigation;
  socials: SocialLink[];
}) {
  const [compact, setCompact] = useState(false);
  const count = useCart((s) => cartCount(s.items));
  const panel = useUI((s) => s.panel);
  const open = useUI((s) => s.open);
  const close = useUI((s) => s.close);
  const menuMounted = useMountOnOpen(panel === "menu");

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-line bg-bg transition-shadow",
        compact && "shadow-sm",
      )}
    >
      <div
        className={cn(
          // Phones: logo left, icons right. Desktop: logo | mega menu | icons.
          "container-page flex items-center justify-between transition-[height] duration-300 lg:grid lg:grid-cols-[1fr_auto_1fr]",
          compact ? "h-14" : "h-16 lg:h-20",
        )}
      >
        <Link href="/" className="justify-self-start" aria-label="ARBI home">
          <Logo
            priority
            className={cn(
              "w-auto transition-[height] duration-300",
              compact ? "h-10 lg:h-11" : "h-12 lg:h-[60px]",
            )}
          />
        </Link>

        <MegaMenu items={navigation.main} />

        <div className="flex items-center justify-end">
          <button
            type="button"
            className={cn(iconBtn, "inline-flex")}
            onClick={() => open("search")}
            aria-label="Search"
          >
            <Search className="size-5" aria-hidden />
          </button>
          <Link href="/account/" className={cn(iconBtn, "inline-flex")} aria-label="Account">
            <User className="size-5" aria-hidden />
          </Link>
          <button
            type="button"
            className={cn(iconBtn, "relative inline-flex lg:-mr-3")}
            onClick={() => open("cart")}
            aria-label={`Bag, ${count} ${count === 1 ? "item" : "items"}`}
          >
            <ShoppingBag className="size-5" aria-hidden />
            {count > 0 && (
              <span
                aria-hidden
                className="absolute top-1.5 right-1 flex min-w-4 items-center justify-center rounded-full bg-text px-1 text-[10px] leading-4 text-bg"
              >
                {count}
              </span>
            )}
          </button>
          <button
            type="button"
            className={cn(iconBtn, "-mr-3 inline-flex lg:hidden")}
            onClick={() => open("menu")}
            aria-label="Open menu"
            aria-expanded={panel === "menu"}
          >
            <Menu className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      {menuMounted && (
        <MobileMenu
          open={panel === "menu"}
          onClose={close}
          navigation={navigation}
          socials={socials}
        />
      )}
    </header>
  );
}
