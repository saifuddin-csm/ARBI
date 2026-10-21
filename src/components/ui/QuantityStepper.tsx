"use client";

import { Minus, Plus } from "lucide-react";

import { cn } from "@/lib/utils/cn";

type QuantityStepperProps = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
  className?: string;
};

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  label = "Quantity",
  size = "md",
  className,
}: QuantityStepperProps) {
  const h = size === "md" ? "h-12" : "h-9";
  const w = size === "md" ? "w-11" : "w-8";
  return (
    <div
      className={cn("inline-flex items-center border border-line", h, className)}
      role="group"
      aria-label={label}
    >
      <button
        type="button"
        className={cn("inline-flex h-full items-center justify-center disabled:opacity-30", w)}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label.toLowerCase()}`}
      >
        <Minus className="size-3.5" aria-hidden />
      </button>
      <output
        className="min-w-8 text-center text-sm tabular-nums"
        aria-live="polite"
        aria-label={label}
      >
        {value}
      </output>
      <button
        type="button"
        className={cn("inline-flex h-full items-center justify-center disabled:opacity-30", w)}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label.toLowerCase()}`}
      >
        <Plus className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
