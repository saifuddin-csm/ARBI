"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Lock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button, ButtonLink } from "@/components/ui/Button";
import { SelectField, TextField } from "@/components/ui/Field";
import { Img } from "@/components/ui/Img";
import {
  CITIES,
  type CheckoutInput,
  type CheckoutValues,
  PAYMENT_METHODS,
  checkoutSchema,
  shippingFor,
} from "@/lib/schemas";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/formatPrice";
import { useHydrated } from "@/store/StoreHydrator";
import { useAccount } from "@/store/account";
import { cartSubtotal, useCart } from "@/store/cart";

type CheckoutFormProps = {
  rates: { insideDhaka: number; outsideDhaka: number };
  freeShippingThreshold: number;
};

/** Demo order numbers; Phase 2 gets the real number from the backend. */
function newOrder() {
  const now = new Date();
  return { number: `ARBI-${String(now.getTime()).slice(-6)}`, placedAt: now.toISOString() };
}

/** Demo checkout: validates with the shared Zod schema, then shows a fake order confirmation. */
export function CheckoutForm({ rates, freeShippingThreshold }: CheckoutFormProps) {
  const router = useRouter();
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const note = useCart((s) => s.note);
  const clearCart = useCart((s) => s.clear);
  const user = useAccount((s) => s.user);
  const setLastOrder = useAccount((s) => s.setLastOrder);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CheckoutInput, unknown, CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: user?.email ?? "",
      name: user?.name ?? "",
      phone: user?.phone ?? "",
      city: "Dhaka",
      paymentMethod: "cod",
    },
  });

  const subtotal = cartSubtotal(items);
  const city = useWatch({ control, name: "city" });
  const payment = useWatch({ control, name: "paymentMethod" });
  const shipping = shippingFor(city, subtotal, rates, freeShippingThreshold);
  const total = subtotal + shipping;

  if (!hydrated)
    return <div className="h-96 animate-pulse bg-line/50" aria-label="Loading checkout" />;

  if (items.length === 0 && !submitting) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-light">Your bag is empty.</p>
        <ButtonLink href="/collections/all/" className="mt-6">
          Continue shopping
        </ButtonLink>
      </div>
    );
  }

  function onSubmit(values: CheckoutValues) {
    setSubmitting(true);
    const method = PAYMENT_METHODS.find((m) => m.value === values.paymentMethod)!;
    setLastOrder({
      ...newOrder(),
      items,
      note,
      subtotal,
      shipping,
      total,
      paymentMethod: method.label,
      customer: {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: `${values.address}${values.postcode ? ` ${values.postcode}` : ""}`,
        city: values.city,
      },
    });
    clearCart();
    router.push("/checkout/success/");
  }

  const section = "space-y-4 border-b border-line pb-8";
  const legend = "mb-4 label-caps text-sm";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="grid gap-10 lg:grid-cols-[1fr_26rem] lg:gap-16"
      aria-label="Checkout"
    >
      <div className="space-y-8">
        <fieldset className={section}>
          <legend className={legend}>Contact</legend>
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <TextField
            label="Mobile number"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="01XXXXXXXXX"
            hint="We'll text delivery updates to this number."
            error={errors.phone?.message}
            {...register("phone")}
          />
        </fieldset>

        <fieldset className={section}>
          <legend className={legend}>Delivery address</legend>
          <TextField
            label="Full name"
            autoComplete="name"
            error={errors.name?.message}
            {...register("name")}
          />
          <TextField
            label="Address"
            autoComplete="street-address"
            placeholder="House, road, area"
            error={errors.address?.message}
            {...register("address")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <SelectField
              label="City / district"
              autoComplete="address-level2"
              error={errors.city?.message}
              {...register("city")}
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </SelectField>
            <TextField
              label="Postcode"
              optional
              inputMode="numeric"
              autoComplete="postal-code"
              error={errors.postcode?.message}
              {...register("postcode")}
            />
          </div>
          <p className="text-xs text-muted">
            Delivery: {formatPrice(rates.insideDhaka)} inside Dhaka,{" "}
            {formatPrice(rates.outsideDhaka)} elsewhere. Free over{" "}
            {formatPrice(freeShippingThreshold)}.
          </p>
        </fieldset>

        <fieldset
          className={section}
          aria-describedby={errors.paymentMethod ? "payment-error" : undefined}
        >
          <legend className={legend}>Payment</legend>
          <div className="divide-y divide-line border border-line">
            {PAYMENT_METHODS.map((m) => (
              <label
                key={m.value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 p-4 text-sm",
                  payment === m.value && "bg-line/40",
                )}
              >
                <input
                  type="radio"
                  value={m.value}
                  className="mt-0.5 size-4 accent-text"
                  {...register("paymentMethod")}
                />
                <span>
                  <span className="block font-medium">{m.label}</span>
                  {payment === m.value && <span className="mt-1 block text-muted">{m.hint}</span>}
                </span>
              </label>
            ))}
          </div>
          {errors.paymentMethod && (
            <p id="payment-error" className="text-xs text-sale">
              {errors.paymentMethod.message}
            </p>
          )}
          <p className="flex items-center gap-2 text-xs text-muted">
            <Lock className="size-3.5" aria-hidden /> Preview build: no payment is taken and no
            order is sent.
          </p>
        </fieldset>

        <div>
          <label className="flex items-start gap-3 text-sm">
            <input
              type="checkbox"
              className="mt-0.5 size-4 accent-text"
              aria-invalid={errors.agree ? true : undefined}
              aria-describedby={errors.agree ? "agree-error" : undefined}
              {...register("agree")}
            />
            <span>
              I agree to the{" "}
              <Link href="/policies/terms/" className="underline underline-offset-4">
                terms of service
              </Link>{" "}
              and{" "}
              <Link href="/policies/refund/" className="underline underline-offset-4">
                refund policy
              </Link>
              .
            </span>
          </label>
          {errors.agree && (
            <p id="agree-error" className="mt-1 text-xs text-sale">
              {errors.agree.message}
            </p>
          )}
        </div>

        <Button type="submit" full disabled={submitting} className="lg:hidden">
          Place order · {formatPrice(total)}
        </Button>
      </div>

      <aside
        className="order-first h-fit space-y-5 bg-line/40 p-6 lg:sticky lg:top-24 lg:order-none"
        aria-label="Order summary"
      >
        <h2 className="label-caps text-sm">Order summary</h2>
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.sku} className="flex gap-3 text-sm">
              <div className="relative aspect-[3/4] w-14 shrink-0 bg-line">
                <Img media={item.image} alt="" className="size-full object-cover" />
                <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-text text-[10px] text-bg">
                  {item.qty}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate">{item.title}</p>
                <p className="text-xs text-muted">
                  {item.colorName} / {item.size}
                </p>
              </div>
              <p className="whitespace-nowrap">{formatPrice(item.price * item.qty)}</p>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivery ({city === "Dhaka" ? "inside Dhaka" : "outside Dhaka"})</dt>
            <dd>{shipping === 0 ? "Free" : formatPrice(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-line pt-3 text-base">
            <dt>Total</dt>
            <dd className="font-medium">{formatPrice(total)}</dd>
          </div>
        </dl>
        <p className="text-xs text-muted">VAT included.</p>
        {note && (
          <p className="text-xs">
            <span className="text-muted">Note:</span> {note}
          </p>
        )}
        <div className="hidden lg:block">
          <Button type="submit" full disabled={submitting}>
            Place order
          </Button>
        </div>
      </aside>
    </form>
  );
}
