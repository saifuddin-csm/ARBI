"use client";

import { type FormEvent, useId, useState } from "react";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Demo newsletter signup: validates, then confirms without sending anything (Phase 1).
 * Plain state instead of React Hook Form + Zod: it's on every page, so it stays tiny.
 */
export function Newsletter() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const id = useId();

  if (done) {
    return (
      <p className="text-sm" role="status">
        Thanks — you&apos;re on the list. (Preview build: no email was sent.)
      </p>
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") ?? "").trim();
    if (!EMAIL.test(email)) {
      setError("Enter a valid email address");
      return;
    }
    setDone(true);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="w-full max-w-md">
      <label htmlFor={id} className="label-caps text-xs">
        Join the ARBI list
      </label>
      <p className="mt-2 mb-4 text-sm text-muted">New drops, restocks and members-only offers.</p>
      <div className="flex border-b border-text">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Email address"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          onChange={() => error && setError(null)}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted"
        />
        <button type="submit" className="px-2 label-caps text-xs hover:underline">
          Subscribe
        </button>
      </div>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-xs text-sale">
          {error}
        </p>
      )}
    </form>
  );
}
