"use client";

import Link from "next/link";

const INTRO_STEPS = [
  "Step 1 - Customer details",
  "Step 2 - Machine details",
  "Step 3 - Issue details",
  "Step 4 - Photos",
  "Step 5 - Service preferences",
  "Step 6 - Terms and signature",
  "Step 7 - Review and submit",
];

export default function MachineIntakeIntroPage() {
  return (
    <main
      className="min-h-screen px-4 py-6 md:px-6 md:py-8 lg:px-8 lg:py-10"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mx-auto max-w-4xl">
        <div
          className="overflow-hidden rounded-[32px] border"
          style={{
            backgroundColor: "var(--color-bg-card)",
            borderColor: "var(--color-border-soft)",
            boxShadow: "var(--shadow-main)",
          }}
        >
          <div
            className="border-b px-5 py-5 md:px-8 md:py-6"
            style={{ borderColor: "var(--color-border-soft)" }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition hover:opacity-80"
                style={{
                  borderColor: "var(--color-border-soft)",
                  backgroundColor: "var(--color-bg-surface)",
                  color: "var(--color-text-main)",
                }}
              >
                ← Back to home
              </Link>

              <p
                className="text-sm font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                7 steps
              </p>
            </div>
          </div>

          <div className="px-5 py-10 md:px-8 md:py-12">
            <div className="max-w-3xl">
              <p
                className="mb-3 text-xs font-bold uppercase tracking-[0.28em]"
                style={{ color: "var(--color-accent)" }}
              >
                Service Intake
              </p>

              <h1
                className="text-3xl font-bold leading-tight md:text-4xl"
                style={{ color: "var(--color-text-main)" }}
              >
                Tell us what is wrong with your coffee machine
              </h1>

              <p
                className="mt-4 max-w-2xl text-sm leading-7 md:text-base"
                style={{ color: "var(--color-text-muted)" }}
              >
                A guided intake helps us understand the issue faster, prepare the
                right service, and contact you correctly if repairs go above your
                chosen amount.
              </p>
            </div>

            <div
              className="mt-8 rounded-[24px] border p-5 md:p-6"
              style={{
                backgroundColor: "var(--color-bg-surface)",
                borderColor: "var(--color-border-soft)",
              }}
            >
              <h2
                className="text-lg font-semibold"
                style={{ color: "var(--color-text-main)" }}
              >
                What this form includes
              </h2>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {INTRO_STEPS.map((item) => (
                  <div
                    key={item}
                    className="rounded-2xl border px-4 py-3 text-sm"
                    style={{
                      borderColor: "var(--color-border-soft)",
                      backgroundColor: "var(--color-bg-card)",
                      color: "var(--color-text-main)",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>

              <p
                className="mt-5 text-sm leading-7"
                style={{ color: "var(--color-text-muted)" }}
              >
                The form takes only a few minutes. You can upload photos of the
                machine, choose your repair contact limit, and sign directly on
                the screen before submitting.
              </p>

              <div className="mt-6">
                <Link
                  href="/machine-intake/form"
                  className="inline-flex min-h-[56px] items-center justify-center rounded-full px-6 text-sm font-semibold transition"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-bg-main)",
                  }}
                >
                  Start intake form
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}