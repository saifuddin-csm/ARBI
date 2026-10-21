"use client";

import { Minus, Plus } from "lucide-react";
import { type ReactNode, useId, useState } from "react";

import { cn } from "@/lib/utils/cn";

type AccordionItemProps = {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
};

export function AccordionItem({
  title,
  children,
  defaultOpen = false,
  className,
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();
  return (
    <div className={cn("border-b border-line", className)}>
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-button`}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between gap-4 py-4 text-left text-sm"
        >
          <span className="label-caps text-xs">{title}</span>
          {open ? (
            <Minus className="size-4 shrink-0" aria-hidden />
          ) : (
            <Plus className="size-4 shrink-0" aria-hidden />
          )}
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-button`}
        hidden={!open}
        className="pb-5 text-sm leading-relaxed text-text/80"
      >
        {children}
      </div>
    </div>
  );
}

export function Accordion({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("border-t border-line", className)}>{children}</div>;
}
