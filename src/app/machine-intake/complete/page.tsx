import Link from "next/link";

export default function MachineIntakeCompletePage() {
  return (
    <main
      className="min-h-screen px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mx-auto max-w-2xl">
        <div
          className="rounded-[32px] border p-8 md:p-10"
          style={{
            backgroundColor: "var(--color-bg-card)",
            borderColor: "var(--color-border-soft)",
            boxShadow: "var(--shadow-main)",
          }}
        >
          <p
            className="text-xs font-bold uppercase tracking-[0.28em]"
            style={{ color: "var(--color-accent)" }}
          >
            Submission Complete
          </p>

          <h1
            className="mt-3 text-3xl font-semibold"
            style={{ color: "var(--color-text-main)" }}
          >
            Your machine intake has been submitted
          </h1>

          <p
            className="mt-4 text-sm leading-7"
            style={{ color: "var(--color-text-muted)" }}
          >
            Thank you. We have received your information and the service team
            can now review your machine intake.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full px-6 text-sm font-semibold transition"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-bg-main)",
              }}
            >
              Back to home
            </Link>

            <Link
              href="/machine-intake"
              className="inline-flex min-h-[56px] items-center justify-center rounded-full border px-6 text-sm font-semibold transition"
              style={{
                borderColor: "var(--color-border-soft)",
                backgroundColor: "var(--color-bg-surface)",
                color: "var(--color-text-main)",
              }}
            >
              Submit another machine
            </Link>
          </div>
        </div>
      </div>

      {/* TODO: Add a reference number or submission ID here once submissions are saved to a database. */}
    </main>
  );
}