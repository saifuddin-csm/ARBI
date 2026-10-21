import type { Metadata } from "next";

import { SizeTable } from "@/components/product/SizeChartModal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { getSizeCharts } from "@/lib/api";

export const metadata: Metadata = { title: "Size guide" };

export default async function SizeGuidePage() {
  const charts = await getSizeCharts();
  return (
    <div className="container-page py-10 lg:py-16">
      <Breadcrumb
        className="mb-8"
        items={[
          { label: "Home", href: "/" },
          { label: "Size guide", href: "/pages/size-guide/" },
        ]}
      />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-light sm:text-4xl">Size guide</h1>
        <p className="mt-3 text-sm text-muted">
          Garment measurements, taken flat. Switch between centimetres and inches on each chart.
        </p>
        <nav aria-label="Size charts" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {charts.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className="inline-block border border-line px-3 py-2 text-sm hover:border-text"
                >
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-12 space-y-16">
          {charts.map((c) => (
            <section
              key={c.id}
              id={c.id}
              className="scroll-mt-24"
              aria-labelledby={`${c.id}-title`}
            >
              <h2 id={`${c.id}-title`} className="mb-6 text-xl font-light">
                {c.name}
              </h2>
              <SizeTable chart={c} />
              <h3 className="mt-8 mb-3 label-caps text-xs">How to measure</h3>
              <ol className="grid gap-3 sm:grid-cols-2">
                {c.howToMeasure.map((m, i) => (
                  <li key={m.title} className="flex gap-3 text-sm">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-text text-xs">
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-medium">{m.title}.</span>{" "}
                      <span className="text-muted">{m.text}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
