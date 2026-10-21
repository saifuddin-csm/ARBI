"use client";

import { useState } from "react";

import { AccordionItem } from "@/components/ui/Accordion";
import { Modal } from "@/components/ui/Modal";
import { Tabs } from "@/components/ui/Tabs";
import { cn } from "@/lib/utils/cn";
import type { SizeChart } from "@/types";

const toInches = (cm: number) => Math.round((cm / 2.54) * 10) / 10;

export function SizeTable({ chart }: { chart: SizeChart }) {
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-sm text-muted">{chart.name}</p>
        <div role="group" aria-label="Measurement unit" className="inline-flex border border-line">
          {(["cm", "in"] as const).map((u) => (
            <button
              key={u}
              type="button"
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
              className={cn(
                "h-9 px-4 label-caps text-[11px]",
                unit === u ? "bg-text text-bg" : "hover:bg-line",
              )}
            >
              {u === "cm" ? "CM" : "Inches"}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[28rem] border-collapse text-sm">
          <caption className="sr-only">
            {chart.name} measurements in {unit === "cm" ? "centimetres" : "inches"}
          </caption>
          <thead>
            <tr className="border-b border-text">
              <th scope="col" className="py-3 pr-4 text-left label-caps text-[11px]">
                Size
              </th>
              {chart.columns.map((c) => (
                <th key={c} scope="col" className="px-2 py-3 text-right label-caps text-[11px]">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {chart.rows.map((row) => (
              <tr key={row.size} className="border-b border-line">
                <th scope="row" className="py-3 pr-4 text-left font-medium">
                  {row.size}
                </th>
                {row.values.map((v, i) => (
                  <td key={i} className="px-2 py-3 text-right tabular-nums">
                    {unit === "cm" ? v : toInches(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function HowToMeasure({ chart }: { chart: SizeChart }) {
  return (
    <div className="grid gap-6 sm:grid-cols-[10rem_1fr]">
      {/* Neutral line illustration (placeholder until ARBI supplies its own artwork). */}
      <svg viewBox="0 0 160 200" className="mx-auto w-32 text-muted sm:w-full" aria-hidden>
        <path
          d="M55 20h50l25 20-15 25-10-8v123H55V57l-10 8-15-25z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path d="M50 75h60" stroke="currentColor" strokeDasharray="4 3" />
        <path d="M80 20v150" stroke="currentColor" strokeDasharray="4 3" />
        <path d="M55 32h50" stroke="currentColor" strokeDasharray="4 3" />
        <text x="114" y="79" fontSize="10" fill="currentColor">
          1
        </text>
        <text x="84" y="166" fontSize="10" fill="currentColor">
          2
        </text>
        <text x="108" y="30" fontSize="10" fill="currentColor">
          3
        </text>
      </svg>
      <ol className="space-y-4">
        {chart.howToMeasure.map((step, i) => (
          <li key={step.title} className="flex gap-3 text-sm">
            <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-text text-xs">
              {i + 1}
            </span>
            <div>
              <p className="font-medium">{step.title}</p>
              <p className="text-muted">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function SizeChartModal({
  chart,
  open,
  onClose,
}: {
  chart: SizeChart;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Size guide" size="lg">
      <Tabs
        tabs={[
          { id: "chart", label: "Size chart", content: <SizeTable chart={chart} /> },
          { id: "measure", label: "How to measure", content: <HowToMeasure chart={chart} /> },
          {
            id: "faq",
            label: "Size FAQs",
            content: (
              <div className="border-t border-line">
                {chart.faqs.map((f) => (
                  <AccordionItem key={f.question} title={f.question}>
                    {f.answer}
                  </AccordionItem>
                ))}
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
}
