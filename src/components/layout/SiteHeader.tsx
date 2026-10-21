"use client";

import { Menu, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils/cn";
import { cartCount, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import type { Navigation, SocialLink } from "@/types";

import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";

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
          "container-page grid grid-cols-[1fr_auto_1fr] items-center transition-[height] duration-300",
          compact ? "h-14" : "h-16 lg:h-20",
        )}
      >
        <div className="flex items-center lg:gap-6">
          <button
            type="button"
            className={cn(iconBtn, "-ml-3 inline-flex lg:hidden")}
            onClick={() => open("menu")}
            aria-label="Open menu"
            aria-expanded={panel === "menu"}
          >
            <Menu className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            className={cn(iconBtn, "inline-flex lg:hidden")}
            onClick={() => open("search")}
            aria-label="Search"
          >
            <Search className="size-5" aria-hidden />
          </button>
          <Link href="/" className="hidden lg:block" aria-label="ARBI home">
            <Logo
              priority
              className={cn("w-auto transition-[height] duration-300", compact ? "h-9" : "h-12")}
            />
          </Link>
        </div>

        <div className="flex justify-center">
          <Link href="/" className="lg:hidden" aria-label="ARBI home">
            <Logo
              priority
              className={cn("w-auto transition-[height] duration-300", compact ? "h-8" : "h-10")}
            />
          </Link>
          <MegaMenu items={navigation.main} />
        </div>

        <div className="flex items-center justify-end">
          <button
            type="button"
            className={cn(iconBtn, "hidden lg:inline-flex")}
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
            className={cn(iconBtn, "relative -mr-3 inline-flex")}
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
        </div>
      </div>
      <MobileMenu
        open={panel === "menu"}
        onClose={close}
        navigation={navigation}
        socials={socials}
      />
    </header>
  );
}
