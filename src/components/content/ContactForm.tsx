"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/Button";
import { TextAreaField, TextField } from "@/components/ui/Field";
import { contactSchema } from "@/lib/schemas";

type Input = z.input<typeof contactSchema>;
type Values = z.output<typeof contactSchema>;

/** Demo contact form: validates, then confirms without sending (Phase 1). */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Input, unknown, Values>({ resolver: zodResolver(contactSchema) });

  if (sent) {
    return (
      <div role="status" className="border border-line p-6">
        <p className="text-lg font-light">Thanks — we&apos;ve got your message.</p>
        <p className="mt-2 text-sm text-muted">
          Preview build: nothing was sent. In the live store our team replies within one working
          day.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(() => setSent(true))}
      noValidate
      className="space-y-4"
      aria-label="Contact us"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Name"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Mobile number"
          type="tel"
          optional
          autoComplete="tel"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <TextField
          label="Order number"
          optional
          placeholder="ARBI-10421"
          error={errors.orderNumber?.message}
          {...register("orderNumber")}
        />
      </div>
      <TextAreaField
        label="Message"
        rows={6}
        error={errors.message?.message}
        {...register("message")}
      />
      <Button type="submit" className="w-full sm:w-auto">
        Send message
      </Button>
    </form>
  );
}
