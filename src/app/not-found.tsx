import Link from "next/link";

export default function NotFound() {
  return (
    <main className="container-page flex flex-1 flex-col items-center justify-center gap-6 py-16 text-center">
      <p className="label-caps text-xs text-muted">Error 404</p>
      <h1 className="text-3xl font-light sm:text-4xl">Page not found</h1>
      <p className="max-w-md text-muted">
        The page you are looking for has moved or no longer exists.
      </p>
      <Link
        href="/"
        className="w-full rounded-brand bg-text px-8 py-3 label-caps text-xs text-bg sm:w-auto"
      >
        Back to home
      </Link>
    </main>
  );
}
