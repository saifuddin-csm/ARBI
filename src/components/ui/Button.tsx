import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "inverse";

type ButtonStyle = { variant?: Variant; size?: "sm" | "md"; full?: boolean; className?: string };

/** Button styles: solid black primary, outlined secondary, full-width on mobile when `full`. */
export function buttonClass({
  variant = "primary",
  size = "md",
  full,
  className,
}: ButtonStyle = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-brand border label-caps transition-[color,background-color,border-color,transform] duration-300 ease-out active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100",
    size === "md" ? "min-h-12 px-6 text-xs" : "min-h-10 px-4 text-[11px]",
    variant === "primary" && "border-text bg-text text-bg hover:bg-text/85",
    variant === "secondary" && "border-text bg-transparent text-text hover:bg-text hover:text-bg",
    variant === "ghost" &&
      "border-transparent bg-transparent text-text underline-offset-4 hover:underline",
    variant === "inverse" && "border-bg bg-bg text-text hover:bg-bg/85",
    full && "w-full",
    className,
  );
}

export function Button({
  variant,
  size,
  full,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & ButtonStyle) {
  return (
    <button type={type} className={buttonClass({ variant, size, full, className })} {...props} />
  );
}

export function ButtonLink({
  variant,
  size,
  full,
  className,
  ...props
}: ComponentProps<typeof Link> & ButtonStyle) {
  return <Link className={buttonClass({ variant, size, full, className })} {...props} />;
}
