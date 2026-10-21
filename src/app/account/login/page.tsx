import type { Metadata } from "next";

import { LoginForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-center text-3xl font-light sm:text-4xl">Sign in</h1>
        <LoginForm />
      </div>
    </div>
  );
}
