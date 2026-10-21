import type { Metadata } from "next";

import { TrackOrderForm } from "@/components/account/TrackOrderForm";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getSampleOrders } from "@/lib/api";

export const metadata: Metadata = { title: "Track your order" };

export default async function TrackOrderPage() {
  const orders = await getSampleOrders();
  return (
    <div className="container-page py-10 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Track order", href: "/track-order/" },
        ]}
      />
      <h1 className="text-3xl font-light sm:text-4xl">Track your order</h1>
      <p className="mt-3 mb-10 max-w-lg text-sm text-muted">
        Enter your order number and the phone number or email you used at checkout.
      </p>
      <TrackOrderForm orders={orders} />
    </div>
  );
}
