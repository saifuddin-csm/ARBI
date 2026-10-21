import { describe, expect, it } from "vitest";

import { bdPhone, checkoutSchema, registerSchema, shippingFor } from "@/lib/schemas";

const valid = {
  email: "test@example.com",
  phone: "01712-345678",
  name: "Test Customer",
  address: "House 1, Road 2, Banani",
  city: "Dhaka",
  postcode: "1213",
  paymentMethod: "cod",
  agree: true,
};

describe("checkout schema", () => {
  it("accepts a complete order and normalises the phone number", () => {
    const parsed = checkoutSchema.parse(valid);
    expect(parsed.phone).toBe("01712345678");
  });

  it("rejects bad phone numbers, missing terms and unknown cities", () => {
    const r = checkoutSchema.safeParse({ ...valid, phone: "12345", agree: false, city: "Paris" });
    expect(r.success).toBe(false);
    const paths = r.error!.issues.map((i) => i.path[0]);
    expect(paths).toEqual(expect.arrayContaining(["phone", "agree", "city"]));
  });
});

describe("bdPhone", () => {
  it("accepts local and +88 formats", () => {
    expect(bdPhone.safeParse("+8801812345678").success).toBe(true);
    expect(bdPhone.safeParse("01912 345 678").success).toBe(true);
    expect(bdPhone.safeParse("01212345678").success).toBe(false);
  });
});

describe("register schema", () => {
  it("requires matching passwords", () => {
    const r = registerSchema.safeParse({
      name: "A B",
      email: "a@b.co",
      phone: "01712345678",
      password: "longenough",
      confirm: "different1",
    });
    expect(r.success).toBe(false);
    expect(r.error!.issues[0].path).toEqual(["confirm"]);
  });
});

describe("shippingFor", () => {
  const rates = { insideDhaka: 80, outsideDhaka: 130 };
  it("charges by zone below the threshold and nothing above it", () => {
    expect(shippingFor("Dhaka", 1000, rates, 3000)).toBe(80);
    expect(shippingFor("Sylhet", 1000, rates, 3000)).toBe(130);
    expect(shippingFor("Sylhet", 3000, rates, 3000)).toBe(0);
  });
});
