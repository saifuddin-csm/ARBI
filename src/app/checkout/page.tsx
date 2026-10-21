import type { Metadata } from "next";

import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getSite } from "@/lib/api";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const site = await getSite();
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: "Bag", href: "/cart/" },
          { label: "Checkout", href: "/checkout/" },
        ]}
      />
      <h1 className="mb-8 text-3xl font-light sm:text-4xl">Checkout</h1>
      <CheckoutForm rates={site.shippingRates} freeShippingThreshold={site.freeShippingThreshold} />
    </div>
  );
}
