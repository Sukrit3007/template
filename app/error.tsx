"use client";

import { useEffect } from "react";

/**
 * Route-level error boundary. Client component by requirement — Next needs the
 * reset handler on the client.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid-container flex min-h-lvh flex-col items-center justify-center gap-24 text-center">
      <p className="font-mono text-12 text-ink-soft uppercase">Error</p>
      <h1 className="span-w-10 font-serif text-40 normal-case lg:text-70">
        Something went wrong
      </h1>
      <button
        type="button"
        onClick={reset}
        className="mt-12 h-50 cursor-pointer rounded-sm bg-ink px-24 font-sans text-14 font-medium text-surface transition-opacity hover:opacity-80"
      >
        Try again
      </button>
    </main>
  );
}
