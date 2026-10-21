"use client";

import { X } from "lucide-react";
import { type ReactNode, useId, useRef } from "react";

import { useDialog } from "@/lib/hooks/useDialog";
import { cn } from "@/lib/utils/cn";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  hideTitle?: boolean;
  children: ReactNode;
  size?: "md" | "lg" | "full";
  className?: string;
};

export function Modal({
  open,
  onClose,
  title,
  hideTitle,
  children,
  size = "md",
  className,
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(open, onClose, panelRef);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-6">
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in bg-black/50"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[92vh] w-full animate-pop-in flex-col bg-bg shadow-xl outline-none",
          size === "md" && "sm:max-w-lg",
          size === "lg" && "sm:max-w-3xl",
          size === "full" && "h-full max-h-none sm:h-[92vh] sm:max-w-6xl",
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
      </div>
    </div>
  );
}
