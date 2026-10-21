import { Rating } from "@/components/ui/Rating";
import type { Review } from "@/types";

/** Static sample reviews in Phase 1; moderated reviews come from the backend in Phase 2. */
export function Reviews({
  rating,
  count,
  reviews,
}: {
  rating?: number;
  count?: number;
  reviews: Review[];
}) {
  return (
    <section
      id="reviews"
      className="container-page scroll-mt-24 border-t border-line section-space"
      aria-labelledby="reviews-heading"
    >
      <div className="grid gap-10 lg:grid-cols-[18rem_1fr] lg:gap-16">
        <div>
          <h2 id="reviews-heading" className="text-2xl font-light sm:text-3xl">
            Customer reviews
          </h2>
          {rating !== undefined && (
            <div className="mt-4">
              <p className="text-4xl font-light">{rating.toFixed(1)}</p>
              <Rating value={rating} count={count} size="md" className="mt-1" />
              <p className="mt-1 text-xs text-muted">Based on {count} reviews</p>
            </div>
          )}
          <p className="mt-4 text-xs text-muted">Sample reviews shown in this preview build.</p>
        </div>
        <ul className="divide-y divide-line">
          {reviews.map((r) => (
            <li key={r.id} className="py-6 first:pt-0">
              <Rating value={r.rating} />
              <p className="mt-2 font-medium">{r.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-text/80">{r.body}</p>
              <p className="mt-2 text-xs text-muted">
                {r.author} · Verified buyer ·{" "}
                <time dateTime={r.date}>
                  {new Date(r.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
