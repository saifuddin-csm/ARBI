"use client";

import { X } from "lucide-react";
import { type ReactNode, useEffect, useId, useRef, useState } from "react";

import { useDialog } from "@/lib/hooks/useDialog";
import { cn } from "@/lib/utils/cn";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  title: ReactNode;
  /** Visually hide the title (it stays the dialog's accessible name). */
  hideTitle?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function Drawer({
  open,
  onClose,
  side = "right",
  title,
  hideTitle,
  children,
  footer,
  className,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  // Applied one frame after `open` changes, so a drawer that mounts already open (lazy
  // drawers) still slides in instead of appearing.
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setShown(open));
    return () => cancelAnimationFrame(frame);
  }, [open]);
  useDialog(open, onClose, panelRef);

  return (
    <div className={cn("fixed inset-0 z-50", !open && "pointer-events-none")} inert={!open}>
      <div
        aria-hidden="true"
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity duration-500 ease-out",
          shown ? "opacity-100" : "opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "absolute top-0 flex h-full w-[min(100%,26rem)] flex-col bg-bg shadow-xl transition-transform duration-500 ease-out outline-none",
          side === "right" ? "right-0" : "left-0",
          shown ? "translate-x-0" : side === "right" ? "translate-x-full" : "-translate-x-full",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 id={titleId} className={cn("label-caps text-sm", hideTitle && "sr-only")}>
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="-mr-2 ml-auto inline-flex size-10 items-center justify-center"
            aria-label="Close"
          >
            <X className="size-5" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer && <div className="border-t border-line p-5">{footer}</div>}
      </div>
    </div>
  );
}
