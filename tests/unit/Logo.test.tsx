import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "@/components/ui/Logo";
import { assetPath } from "@/lib/utils";

describe("Logo", () => {
  it("renders the ARBI logo with alt text and intrinsic size", () => {
    render(<Logo />);
    const img = screen.getByRole("img", { name: "ARBI" });
    expect(img).toHaveAttribute("src", "/brand/arbi-logo.webp");
    expect(img).toHaveAttribute("width", "720");
    expect(img).toHaveAttribute("height", "404");
  });
});

describe("assetPath", () => {
  it("leaves absolute and data URLs untouched", () => {
    expect(assetPath("https://example.com/a.webp")).toBe("https://example.com/a.webp");
    expect(assetPath("data:image/png;base64,xx")).toBe("data:image/png;base64,xx");
  });

  it("adds a leading slash to relative paths", () => {
    expect(assetPath("images/a.webp")).toBe("/images/a.webp");
  });
});
