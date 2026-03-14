"use client";

import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import Button from "@/components/ui/Button/Button";
import { useLanguage } from "@/context/LanguageContext";
import {
  dayNames,
  getAvailabilityStatus,
  openingHours,
} from "@/lib/availability";

export default function AvailabilityPage() {
  const { language, setLanguage } = useLanguage();
  const status = getAvailabilityStatus();

  const reorderedDays = [...dayNames.slice(1), dayNames[0]];
  const hoursArray = Object.values(openingHours);
  const reorderedHours = [...hoursArray.slice(1), hoursArray[0]];

  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1;

  return (
    <main
      id="top"
      className="min-h-screen overflow-x-hidden"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <Navbar language={language} onLanguageChange={setLanguage} />

      <section className="px-4 py-8 md:px-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <section
            className="rounded-[28px] border p-6 md:p-8"
            style={{
              borderColor: "rgba(177, 147, 89, 0.16)",
              background:
                "linear-gradient(180deg, rgba(60,32,22,0.92), rgba(38,20,14,0.96))",
              boxShadow:
                "0 14px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <div className="max-w-2xl">
              <p
                className="text-[0.7rem] font-bold uppercase tracking-[0.24em] md:text-xs"
                style={{ color: "var(--color-accent)" }}
              >
                Availability
              </p>

              <h1
                className="mt-3 text-3xl font-black tracking-tight sm:text-4xl"
                style={{ color: "var(--color-text-main)" }}
              >
                Opening Hours
              </h1>

              <p
                className="mt-3 text-sm leading-relaxed md:text-base"
                style={{ color: "var(--color-text-muted)" }}
              >
                Check whether we are currently available and view the weekly
                schedule.
              </p>
            </div>

            <div
              className="mt-8 rounded-[20px] border px-5 py-5"
              style={{
                borderColor: status.isOpen
                  ? "rgba(34,197,94,0.26)"
                  : "rgba(239,68,68,0.26)",
                background: status.isOpen
                  ? "linear-gradient(180deg, rgba(34,197,94,0.10), rgba(34,197,94,0.04))"
                  : "linear-gradient(180deg, rgba(239,68,68,0.10), rgba(239,68,68,0.04))",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.02)",
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p
                    className="text-[0.72rem] font-bold uppercase tracking-[0.2em]"
                    style={{
                      color: status.isOpen
                        ? "rgb(134 239 172)"
                        : "rgb(252 165 165)",
                    }}
                  >
                    {status.isOpen ? "Available now" : "Currently closed"}
                  </p>

                  <p
                    className="mt-2 text-sm leading-relaxed md:text-base"
                    style={{ color: "var(--color-text-main)" }}
                  >
                    {status.message}
                  </p>
                </div>

                <div
                  className="mt-1 h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: status.isOpen
                      ? "rgb(134 239 172)"
                      : "rgb(252 165 165)",
                    boxShadow: status.isOpen
                      ? "0 0 18px rgba(134,239,172,0.55)"
                      : "0 0 18px rgba(252,165,165,0.45)",
                  }}
                />
              </div>
            </div>

            <div className="mt-10">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2
                  className="text-lg font-semibold md:text-xl"
                  style={{ color: "var(--color-text-main)" }}
                >
                  Weekly hours
                </h2>

                <p
                  className="text-xs uppercase tracking-[0.18em]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  Monday to Sunday
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
                {reorderedDays.map((day, index) => {
                  const hours = reorderedHours[index];
                  const isToday = index === todayIndex;

                  return (
                    <div
                      key={day}
                      className="flex min-h-[148px] flex-col justify-between rounded-[18px] border px-4 py-4 text-center"
                      style={{
                        borderColor: isToday
                          ? "rgba(177, 147, 89, 0.3)"
                          : "rgba(177, 147, 89, 0.16)",
                        background: isToday
                          ? "linear-gradient(180deg, rgba(87,58,37,0.96), rgba(45,24,17,0.98))"
                          : "linear-gradient(180deg, rgba(60,32,22,0.80), rgba(38,20,14,0.88))",
                        boxShadow: isToday
                          ? "0 10px 24px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.03)"
                          : "inset 0 1px 0 rgba(255,255,255,0.02)",
                      }}
                    >
                      <div>
                        <div
                          className="mx-auto h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor: isToday
                              ? "var(--color-accent)"
                              : "rgba(177, 147, 89, 0.35)",
                          }}
                        />

                        <h3
                          className="mt-4 text-sm font-bold uppercase tracking-wide"
                          style={{ color: "var(--color-accent)" }}
                        >
                          {day}
                        </h3>

                        <p
                          className="mt-3 text-sm leading-relaxed"
                          style={{
                            color: hours
                              ? "var(--color-text-main)"
                              : "rgba(255,255,255,0.5)",
                          }}
                        >
                          {hours ? `${hours.open} - ${hours.close}` : "Closed"}
                        </p>
                      </div>

                      {isToday && (
                        <span
                          className="mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em]"
                          style={{ color: "var(--color-accent)" }}
                        >
                          Today
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button href="/#top" text="Back to home" variant="primary" size="sm" />
              <Button href="/#contact" text="Contact us" variant="secondary" size="sm" />
            </div>
          </section>
        </div>
      </section>

      <Footer language={language} />
    </main>
  );
}

// TODO: Translate this page using the selected language from context.
// TODO: Consider extracting shared page-shell layout if more inner pages are added.