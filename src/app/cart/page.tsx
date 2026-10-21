import type { Metadata } from "next";

import { CartPageView } from "@/components/cart/CartPageView";
import { getSite } from "@/lib/api";

export const metadata: Metadata = { title: "Your bag" };

export default async function CartPage() {
  const site = await getSite();
  return (
    <div className="container-page py-10 lg:py-16">
      <h1 className="mb-8 text-3xl font-light sm:text-4xl">Your bag</h1>
      <CartPageView freeShippingThreshold={site.freeShippingThreshold} />
    </div>
  );
}
