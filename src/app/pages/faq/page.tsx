import type { Metadata } from "next";
import Link from "next/link";

import { Accordion, AccordionItem } from "@/components/ui/Accordion";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getFaqs } from "@/lib/api";

export const metadata: Metadata = { title: "FAQ" };

export default async function FaqPage() {
  const groups = await getFaqs();
  return (
    <div className="container-page py-10 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/pages/faq/" },
        ]}
      />
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-light sm:text-4xl">Frequently asked questions</h1>
        <p className="mt-3 text-sm text-muted">
          Can&apos;t find what you need?{" "}
          <Link href="/pages/contact/" className="underline underline-offset-4">
            Contact us
          </Link>
          .
        </p>
        <div className="mt-10 space-y-12">
          {groups.map((g) => (
            <section key={g.title}>
              <h2 className="mb-4 label-caps text-sm">{g.title}</h2>
              <Accordion>
                {g.items.map((item) => (
                  <AccordionItem key={item.question} title={item.question}>
                    {item.answer}
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
