"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { Button } from "@/components/ui/Button";
import { TextField } from "@/components/ui/Field";
import { loginSchema, registerSchema } from "@/lib/schemas";
import { useAccount } from "@/store/account";

export const DEMO_USER = {
  name: "Demo Customer",
  email: "demo@arbi.example",
  phone: "01700000000",
};

function DemoNote() {
  return (
    <p className="border border-line p-3 text-xs text-muted">
      Preview build: accounts are a demo. Nothing you type is sent or stored outside this browser.
    </p>
  );
}

export function LoginForm() {
  const router = useRouter();
  const signIn = useAccount((s) => s.signIn);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({ resolver: zodResolver(loginSchema) });

  return (
    <div className="space-y-6">
      <DemoNote />
      <form
        noValidate
        aria-label="Sign in"
        className="space-y-4"
        onSubmit={handleSubmit((v) => {
          signIn({ name: v.email.split("@")[0], email: v.email });
          router.push("/account/");
        })}
      >
        <TextField
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />
        <Button type="submit" full>
          Sign in
        </Button>
      </form>
      <Button
        variant="secondary"
        full
        onClick={() => {
          signIn(DEMO_USER);
          router.push("/account/");
        }}
      >
        Continue with the demo account
      </Button>
      <p className="text-center text-sm">
        New to ARBI?{" "}
        <Link href="/account/register/" className="underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const signIn = useAccount((s) => s.signIn);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.input<typeof registerSchema>, unknown, z.output<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <div className="space-y-6">
      <DemoNote />
      <form
        noValidate
        aria-label="Create account"
        className="space-y-4"
        onSubmit={handleSubmit((v) => {
          signIn({ name: v.name, email: v.email, phone: v.phone });
          router.push("/account/");
        })}
      >
        <TextField
          label="Full name"
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
        <TextField
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          placeholder="01XXXXXXXXX"
          error={errors.phone?.message}
          {...register("phone")}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters."
          error={errors.password?.message}
          {...register("password")}
        />
        <TextField
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          error={errors.confirm?.message}
          {...register("confirm")}
        />
        <Button type="submit" full>
          Create account
        </Button>
      </form>
      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/account/login/" className="underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  );
}
