"use client";

import { Carousel } from "@/components/ui/Carousel";
import { useHydrated } from "@/store/StoreHydrator";
import { useRecentlyViewed } from "@/store/recentlyViewed";

import { ProductCard } from "./ProductCard";

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const hydrated = useHydrated();
  const products = useRecentlyViewed((s) => s.products).filter((p) => p.slug !== excludeSlug);
  if (!hydrated || products.length === 0) return null;
  return (
    <section className="container-page border-t border-line section-space">
      <h2 className="mb-8 text-2xl font-light sm:text-3xl">Recently viewed</h2>
      <Carousel label="Recently viewed">
        {products.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </Carousel>
    </section>
  );
}
