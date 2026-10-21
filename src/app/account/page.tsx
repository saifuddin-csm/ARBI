import type { Metadata } from "next";

import { AccountDashboard } from "@/components/account/AccountDashboard";
import { getSampleOrders } from "@/lib/api";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const orders = await getSampleOrders();
  return (
    <div className="container-page py-10 lg:py-16">
      <AccountDashboard orders={orders} />
    </div>
  );
}
