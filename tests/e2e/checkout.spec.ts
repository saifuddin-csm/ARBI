import { expect, test } from "@playwright/test";

// Relative URLs resolve against baseURL, which includes the GitHub Pages base path.

test("browse → add to bag → checkout → order confirmation", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

  // Collection page with URL filters.
  await page.goto("collections/all/?category=shirts");
  await expect(page.getByRole("heading", { name: "Shop All", level: 1 })).toBeVisible();
  await expect(page.getByRole("button", { name: "Shirts Remove filter" })).toBeVisible();

  // Product page.
  await page.goto("products/linen-classic-shirt-sand/");
  await expect(page.getByRole("heading", { name: "Linen Classic Shirt", level: 1 })).toBeVisible();

  // Adding without a size asks for one.
  await page.getByRole("button", { name: "Add to bag" }).first().click();
  await expect(page.getByRole("alert").filter({ hasText: "Please select a size." })).toBeVisible();

  await page.locator("label", { hasText: /^M$/ }).click();
  await page.getByRole("button", { name: "Add to bag" }).first().click();

  const drawer = page.getByRole("dialog", { name: /Your bag/ });
  await expect(drawer).toBeVisible();
  await expect(drawer.getByText("Sand / M")).toBeVisible();
  await expect(page.getByRole("button", { name: "Bag, 1 item" })).toBeVisible();

  // The bag survives a reload (localStorage).
  await page.reload();
  await expect(page.getByRole("button", { name: "Bag, 1 item" })).toBeVisible();

  await page.goto("checkout/");
  await expect(page.getByRole("heading", { name: "Checkout", level: 1 })).toBeVisible();

  // Validation errors on an empty submit.
  await page
    .getByRole("button", { name: /Place order/ })
    .filter({ visible: true })
    .click();
  await expect(page.getByText("Enter a valid email address")).toBeVisible();
  await expect(page.getByText("Please accept the terms to continue")).toBeVisible();

  await page.getByLabel("Email").fill("shopper@example.com");
  await page.getByLabel("Mobile number").fill("01712345678");
  await page.getByLabel("Full name").fill("Test Shopper");
  await page.getByLabel("Address").fill("House 1, Road 2, Banani");
  await page.getByLabel("City / district").selectOption("Sylhet");
  await page.getByLabel(/I agree to the/).check();
  await page
    .getByRole("button", { name: /Place order/ })
    .filter({ visible: true })
    .click();

  await expect(page).toHaveURL(/checkout\/success\/$/);
  await expect(page.getByRole("heading", { name: /Thank you, Test!/ })).toBeVisible();
  await expect(page.getByText("Linen Classic Shirt")).toBeVisible();
  await expect(page.getByRole("button", { name: "Bag, 0 items" })).toBeVisible();
});

test("sold-out sizes cannot be added", async ({ page }) => {
  await page.goto("products/coach-jacket-olive/");
  await expect(page.getByRole("button", { name: "Sold out" }).first()).toBeDisabled();
  const sizes = page.getByRole("radio");
  for (const radio of await sizes.all()) await expect(radio).toBeDisabled();
});

test("search drawer shows live results", async ({ page }) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Search" }).filter({ visible: true }).click();
  await page.getByRole("searchbox", { name: "Search products" }).fill("panjabi");
  await expect(page.getByRole("link", { name: /Cotton Panjabi/ }).first()).toBeVisible();
});
