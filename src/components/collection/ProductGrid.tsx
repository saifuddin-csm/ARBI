import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types";

/** 2 columns on phones, 3 on tablets, 4 on desktop. */
export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
      {products.map((p, i) => (
        <li key={p.slug}>
          <ProductCard product={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
