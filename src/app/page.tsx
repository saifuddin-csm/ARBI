import { Logo } from "@/components/ui/Logo";

// Milestone 1 placeholder. Replaced by the home.json-driven sections in Milestone 4.
export default function HomePage() {
  return (
    <main className="container-page flex flex-1 flex-col items-center justify-center gap-10 py-16 text-center">
      <h1 className="w-full max-w-[min(80vw,420px)]">
        <Logo priority className="h-auto w-full" />
      </h1>
      <p className="label-caps text-xs text-muted sm:text-sm">Online store — coming soon</p>
    </main>
  );
}
