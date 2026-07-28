import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid-container flex min-h-lvh flex-col items-center justify-center gap-24 text-center">
      <p className="font-mono text-12 text-ink-soft uppercase">404</p>
      <h1 className="span-w-10 font-serif text-40 normal-case lg:text-70">
        This page doesn&rsquo;t exist
      </h1>
      <Link
        href="/"
        className="mt-12 flex h-50 items-center rounded-sm bg-ink px-24 font-sans text-14 font-medium text-surface transition-opacity hover:opacity-80"
      >
        Back to home
      </Link>
    </main>
  );
}
