import { ProductCard } from "@/components/product/ProductCard";
import type { ProductSummary } from "@/types";

import { GRID_CLASS } from "./grid";

export function ProductGrid({ products }: { products: ProductSummary[] }) {
  return (
    <ul className={GRID_CLASS}>
      {products.map((p, i) => (
        <li key={p.slug}>
          <ProductCard product={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
