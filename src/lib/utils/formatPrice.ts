export type CurrencyCode = "BDT";

const SYMBOLS: Record<CurrencyCode, string> = { BDT: "৳" };

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

/**
 * Formats a price for display. Prices are stored as whole currency units
 * (e.g. 1290 = ৳1,290), VAT-inclusive.
 */
export function formatPrice(amount: number, currency: CurrencyCode = "BDT"): string {
  const sign = amount < 0 ? "-" : "";
  return `${sign}${SYMBOLS[currency]}${numberFormat.format(Math.abs(amount))}`;
}
