import { describe, expect, it } from "vitest";

import { formatPrice } from "@/lib/utils";

describe("formatPrice", () => {
  it("formats whole taka with the ৳ symbol and thousands separators", () => {
    expect(formatPrice(1290)).toBe("৳1,290");
    expect(formatPrice(125000)).toBe("৳125,000");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("৳0");
  });

  it("rounds fractional amounts to whole taka", () => {
    expect(formatPrice(999.6)).toBe("৳1,000");
  });

  it("puts the minus sign before the symbol for negative amounts", () => {
    expect(formatPrice(-200)).toBe("-৳200");
  });
});
