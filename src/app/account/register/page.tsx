import type { Metadata } from "next";

import { RegisterForm } from "@/components/account/AuthForms";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="container-page py-10 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1 className="mb-8 text-center text-3xl font-light sm:text-4xl">Create account</h1>
        <RegisterForm />
      </div>
    </div>
  );
}
