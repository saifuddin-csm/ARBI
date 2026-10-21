// Zod schemas shared by the demo forms now and the backend API in Phase 2.
import { z } from "zod";

/** Bangladeshi mobile numbers: 01XXXXXXXXX, optionally prefixed with +88 / 88. */
export const bdPhone = z
  .string()
  .trim()
  .transform((v) => v.replace(/[\s-]/g, ""))
  .pipe(z.string().regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid Bangladeshi mobile number"));

export const CITIES = [
  "Dhaka",
  "Chattogram",
  "Gazipur",
  "Narayanganj",
  "Sylhet",
  "Khulna",
  "Rajshahi",
  "Barishal",
  "Rangpur",
  "Mymensingh",
  "Cumilla",
  "Cox's Bazar",
] as const;

export const PAYMENT_METHODS = [
  { value: "cod", label: "Cash on delivery", hint: "Pay in cash when your order arrives." },
  { value: "bkash", label: "bKash", hint: "You'll be redirected to bKash to pay (demo)." },
  { value: "nagad", label: "Nagad", hint: "You'll be redirected to Nagad to pay (demo)." },
  {
    value: "card",
    label: "Card (Visa, Mastercard, Amex)",
    hint: "You'll pay on the secure payment page (demo).",
  },
] as const;

export const checkoutSchema = z.object({
  email: z.email("Enter a valid email address"),
  phone: bdPhone,
  name: z.string().trim().min(2, "Enter your full name"),
  address: z.string().trim().min(8, "Enter your full address (house, road, area)"),
  city: z.enum(CITIES, "Choose a city"),
  postcode: z
    .string()
    .trim()
    .regex(/^(\d{4})?$/, "Postcodes have 4 digits")
    .optional(),
  paymentMethod: z.enum(["cod", "bkash", "nagad", "card"], "Choose a payment method"),
  agree: z.literal(true, "Please accept the terms to continue"),
});

export type CheckoutInput = z.input<typeof checkoutSchema>;
export type CheckoutValues = z.output<typeof checkoutSchema>;

export const loginSchema = z.object({
  email: z.email("Enter a valid email address"),
  password: z.string().min(6, "Passwords have at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Enter your name"),
    email: z.email("Enter a valid email address"),
    phone: bdPhone,
    password: z.string().min(8, "Use at least 8 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Passwords don't match", path: ["confirm"] });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name"),
  email: z.email("Enter a valid email address"),
  phone: bdPhone.optional().or(z.literal("")),
  orderNumber: z.string().trim().optional(),
  message: z.string().trim().min(10, "Tell us a little more (at least 10 characters)"),
});

export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .min(4, "Enter your order number")
    .transform((v) => v.toUpperCase()),
  contact: z.string().trim().min(5, "Enter the phone number or email used at checkout"),
});

/** Delivery charge for a city and subtotal (whole taka). */
export function shippingFor(
  city: string | undefined,
  subtotal: number,
  rates: { insideDhaka: number; outsideDhaka: number },
  freeThreshold: number,
): number {
  if (subtotal >= freeThreshold || subtotal === 0) return 0;
  return city === "Dhaka" ? rates.insideDhaka : rates.outsideDhaka;
}
