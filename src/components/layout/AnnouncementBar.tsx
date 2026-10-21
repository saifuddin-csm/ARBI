"use client";

import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";

type AnnouncementBarProps = { id: string; messages: string[] };

const storageKey = (id: string) => `arbi-announcement-dismissed:${id}`;

export function AnnouncementBar({ id, messages }: AnnouncementBarProps) {
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey(id)) === "1") {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- reads browser-only storage after hydration
        setDismissed(true);
      }
    } catch {
      // Storage unavailable (private mode): keep the bar visible.
    }
  }, [id]);

  useEffect(() => {
    if (paused || messages.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % messages.length), 5000);
    return () => window.clearInterval(t);
  }, [paused, messages.length]);

  if (dismissed || messages.length === 0) return null;

  function dismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(storageKey(id), "1");
    } catch {
      // ignore
    }
  }

  const step = (d: number) => setIndex((i) => (i + d + messages.length) % messages.length);

  return (
    <div
      className="relative border-b border-line bg-bg text-text"
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="container-page flex h-10 items-center justify-center gap-2">
        {messages.length > 1 && (
          <button
            type="button"
            onClick={() => step(-1)}
            className="inline-flex size-8 items-center justify-center"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="size-3.5" aria-hidden />
          </button>
        )}
        <p className="min-w-0 truncate text-center label-caps text-[11px]">{messages[index]}</p>
        {messages.length > 1 && (
          <button
            type="button"
            onClick={() => step(1)}
            className="inline-flex size-8 items-center justify-center"
            aria-label="Next announcement"
          >
            <ChevronRight className="size-3.5" aria-hidden />
          </button>
        )}
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center text-muted hover:text-text"
        aria-label="Dismiss announcements"
      >
        <X className="size-3.5" aria-hidden />
      </button>
    </div>
  );
}
