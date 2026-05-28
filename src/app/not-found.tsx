import Link from "next/link";

export default function NotFound() {
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
          404
        </p>
        <h1
          className="mt-4 text-2xl font-semibold"
          style={{ color: "var(--color-text-main)" }}
        >
          Page not found
        </h1>
        <p className="mt-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-bg-main)",
            }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
