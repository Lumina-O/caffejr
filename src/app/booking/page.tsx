"use client";

import { useRouter } from "next/navigation";

export default function BookingPage() {
  const router = useRouter();

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="w-full max-w-md">
        <div className="mb-3">
          <button
            onClick={() => router.back()}
            className="rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition hover:scale-[1.03]"
            style={{
              color: "var(--color-accent)",
              backgroundColor: "rgba(58,34,24,0.82)",
              borderColor: "var(--color-border-card)",
              backdropFilter: "blur(8px)",
            }}
          >
            ← Back
          </button>
        </div>

        <div
          className="rounded-[26px] border p-10 text-center"
          style={{
            backgroundColor: "var(--color-bg-card)",
            borderColor: "var(--color-border-soft)",
            boxShadow: "var(--shadow-main)",
          }}
        >
          <p
            className="text-[10px] font-bold uppercase tracking-[0.28em] mb-2"
            style={{ color: "var(--color-accent)" }}
          >
            Booking
          </p>

          <h1
            className="text-2xl font-black uppercase tracking-tight mb-4"
            style={{ color: "var(--color-accent)" }}
          >
            Not Available Yet
          </h1>

          <p
            className="text-sm"
            style={{ color: "var(--color-text-muted, var(--color-accent))", opacity: 0.7 }}
          >
            Online booking is coming soon. Please contact us directly to schedule a service.
          </p>
        </div>
      </div>
    </main>
  );
}
