"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button, ButtonLink } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useHydrated } from "@/store/StoreHydrator";
import { useAccount } from "@/store/account";
import type { Order } from "@/types";

import { DEMO_USER } from "./AuthForms";
import { OrderTimeline, STATUS_LABELS } from "./OrderTimeline";

function OrderCard({ order }: { order: Order }) {
  return (
    <li className="border border-line">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-line/40 px-4 py-3 text-sm">
        <p>
          <span className="font-medium">{order.number}</span>
          <span className="text-muted">
            {" "}
            ·{" "}
            {new Date(order.placedAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </p>
        <p className="label-caps text-[11px]">{STATUS_LABELS[order.status]}</p>
      </div>
      <div className="grid gap-6 p-4 sm:grid-cols-[1fr_14rem]">
        <div>
          <ul className="space-y-2 text-sm">
            {order.items.map((item) => (
              <li key={item.slug + item.size} className="flex justify-between gap-4">
                <Link href={`/products/${item.slug}/`} className="hover:underline">
                  {item.title} — {item.colorName} / {item.size} × {item.qty}
                </Link>
                <span>{formatPrice(item.price * item.qty)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-line pt-3 text-sm">
            Total <strong>{formatPrice(order.total)}</strong>{" "}
            <span className="text-muted">· {order.paymentMethod}</span>
          </p>
        </div>
        <OrderTimeline order={order} />
      </div>
    </li>
  );
}

export function AccountDashboard({ orders }: { orders: Order[] }) {
  const hydrated = useHydrated();
  const user = useAccount((s) => s.user);
  const signIn = useAccount((s) => s.signIn);
  const signOut = useAccount((s) => s.signOut);
  const router = useRouter();

  if (!hydrated) return <div className="h-64 animate-pulse bg-line/50" />;

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-8 text-center">
        <h1 className="text-3xl font-light sm:text-4xl">My account</h1>
        <p className="mt-3 text-sm text-muted">
          Sign in to see your orders, saved addresses and profile.
        </p>
        <div className="mt-8 grid gap-3">
          <ButtonLink href="/account/login/">Sign in</ButtonLink>
          <ButtonLink href="/account/register/" variant="secondary">
            Create account
          </ButtonLink>
          <Button variant="ghost" onClick={() => signIn(DEMO_USER)}>
            View the demo account
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light sm:text-4xl">Hello, {user.name}</h1>
          <p className="mt-2 text-sm text-muted">{user.email}</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          Sign out
        </Button>
      </div>
      <p className="mt-4 text-xs text-muted">Demo account: sample orders are shown below.</p>
      <Tabs
        className="-mx-5 mt-8"
        tabs={[
          {
            id: "orders",
            label: `Orders (${orders.length})`,
            content: (
              <ul className="space-y-6">
                {orders.map((o) => (
                  <OrderCard key={o.number} order={o} />
                ))}
              </ul>
            ),
          },
          {
            id: "addresses",
            label: "Addresses",
            content: (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="border border-text p-4 text-sm">
                  <p className="mb-2 label-caps text-[11px]">Default</p>
                  <p>{user.name}</p>
                  <p className="text-muted">Demo address, Banani, Dhaka 1213</p>
                  <p className="text-muted">{user.phone ?? DEMO_USER.phone}</p>
                </div>
                <div className="flex items-center justify-center border border-dashed border-line p-4 text-sm text-muted">
                  Add a new address (available after launch)
                </div>
              </div>
            ),
          },
          {
            id: "profile",
            label: "Profile",
            content: (
              <dl className="grid max-w-md grid-cols-[8rem_1fr] gap-y-3 text-sm">
                <dt className="text-muted">Name</dt>
                <dd>{user.name}</dd>
                <dt className="text-muted">Email</dt>
                <dd>{user.email}</dd>
                <dt className="text-muted">Mobile</dt>
                <dd>{user.phone ?? "—"}</dd>
              </dl>
            ),
          },
        ]}
      />
    </div>
  );
}
