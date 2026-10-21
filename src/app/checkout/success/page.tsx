import type { Metadata } from "next";

import { OrderSuccess } from "@/components/checkout/OrderSuccess";

export const metadata: Metadata = { title: "Order confirmed" };

export default function OrderSuccessPage() {
  return (
    <div className="container-page py-12 lg:py-20">
      <OrderSuccess />
    </div>
  );
}
