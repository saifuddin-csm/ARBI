import { describe, expect, it } from "vitest";

import { getHome, getProduct } from "@/lib/api";
import { findUpload, placeholderPath, resolveMedia } from "@/lib/api/media";

describe("media resolution", () => {
  it("maps /images paths to generated SVG placeholders", () => {
    expect(placeholderPath("/images/products/a-b-1.webp")).toBe("/placeholders/products/a-b-1.svg");
  });

  it("falls back to the placeholder when no file was uploaded", () => {
    const media = resolveMedia({ src: "/images/products/does-not-exist.webp", alt: "x" });
    expect(media).toMatchObject({
      src: "/placeholders/products/does-not-exist.svg",
      placeholder: true,
      width: 1200,
      height: 1600,
    });
  });

  it("uses a real file from public/ when it exists, with any common extension", () => {
    // The logo is a real file, so it stands in for an uploaded image here.
    expect(findUpload("/brand/arbi-logo.jpg")).toBe("/brand/arbi-logo.webp");
  });

  it("gives every product image a source", async () => {
    const product = (await getProduct("mens-essential-crew-tee-black"))!;
    expect(product.images).toHaveLength(4);
    expect(product.images.every((i) => i.src && i.alt)).toBe(true);
  });

  it("drops the hero video until one is uploaded", async () => {
    const hero = (await getHome()).find((s) => s.type === "hero");
    expect(hero?.type === "hero" && hero.data.video).toBeUndefined();
  });
});

describe("home config", () => {
  it("keeps the section order from home.json", async () => {
    const types = (await getHome()).map((s) => s.type);
    expect(types.slice(0, 3)).toEqual(["hero", "splitTiles", "banner"]);
    expect(types).toContain("shopTheLook");
    expect(types.at(-1)).toBe("brandStatement");
  });
});
