import { Breadcrumb } from "@/components/ui/Breadcrumb";
import type { ContentPage, NavLink } from "@/types";

/** Long-form text page (About, policies) rendered from content/pages.json. */
export function ContentPageView({ page, crumbs }: { page: ContentPage; crumbs: NavLink[] }) {
  return (
    <div className="container-page py-10 lg:py-16">
      <Breadcrumb items={crumbs} className="mb-8" />
      <article className="mx-auto max-w-2xl">
        {page.draft && (
          <p className="mb-6 inline-block bg-sale px-2 py-1 label-caps text-[11px] text-white">
            Draft
          </p>
        )}
        <h1 className="text-3xl font-light sm:text-4xl">{page.title}</h1>
        {page.updated && (
          <p className="mt-2 text-xs text-muted">
            Last updated{" "}
            <time dateTime={page.updated}>
              {new Date(page.updated).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
          </p>
        )}
        {page.intro && (
          <p className="mt-6 border-l-2 border-line pl-4 text-sm text-muted">{page.intro}</p>
        )}
        <div className="mt-10 space-y-10">
          {page.sections.map((s, i) => (
            <section key={i}>
              {s.heading && <h2 className="mb-3 text-xl font-light">{s.heading}</h2>}
              {s.paragraphs.map((p, j) => (
                <p key={j} className="mb-3 text-sm leading-relaxed text-text/85">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-text/85">
                  {s.list.map((li) => (
                    <li key={li}>{li}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </article>
    </div>
  );
}
