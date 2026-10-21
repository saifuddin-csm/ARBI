"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useId, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({ email: z.email("Enter a valid email address") });

/** Demo newsletter signup: validates, then confirms without sending anything (Phase 1). */
export function Newsletter() {
  const [done, setDone] = useState(false);
  const id = useId();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema) });

  if (done) {
    return (
      <p className="text-sm" role="status">
        Thanks — you&apos;re on the list. (Preview build: no email was sent.)
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit(() => setDone(true))} noValidate className="w-full max-w-md">
      <label htmlFor={id} className="label-caps text-xs">
        Join the ARBI list
      </label>
      <p className="mt-2 mb-4 text-sm text-muted">New drops, restocks and members-only offers.</p>
      <div className="flex border-b border-text">
        <input
          id={id}
          type="email"
          autoComplete="email"
          placeholder="Email address"
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? `${id}-error` : undefined}
          className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted"
          {...register("email")}
        />
        <button type="submit" className="px-2 label-caps text-xs hover:underline">
          Subscribe
        </button>
      </div>
      {errors.email && (
        <p id={`${id}-error`} className="mt-2 text-xs text-sale">
          {errors.email.message}
        </p>
      )}
    </form>
  );
}
