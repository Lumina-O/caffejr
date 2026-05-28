"use client";

import { useEffect } from "react";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6"
      style={{ background: "var(--color-bg-main)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl border p-10 text-center"
        style={{
          background: "var(--color-bg-card)",
          borderColor: "var(--color-border-card)",
          boxShadow: "var(--shadow-main)",
        }}
      >
        <p
          className="text-6xl font-bold"
          style={{ color: "var(--color-accent)" }}
        >
          500
        </p>
        <h1
          className="mt-4 text-2xl font-semibold"
          style={{ color: "var(--color-text-main)" }}
        >
          Something went wrong
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
          An unexpected error occurred. Please try again or return home.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-bg-main)",
            }}
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center rounded-lg border px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{
              borderColor: "var(--color-border-card)",
              color: "var(--color-text-muted)",
            }}
          >
            Go home
          </a>
        </div>
      </div>
    </main>
  );
}
