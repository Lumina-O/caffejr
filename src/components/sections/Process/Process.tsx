import { getSiteData, type Language } from "@/data/siteData";
import Button from "@/components/ui/Button/Button";

type ProcessProps = {
  language: Language;
};

export default function Process({ language }: ProcessProps) {
  const { process } = getSiteData(language);

  return (
    <section
      id="process"
      className="relative overflow-hidden px-4 py-10 md:px-6 md:py-14 lg:min-h-screen lg:px-8 lg:py-16"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between lg:min-h-[calc(100vh-9rem)]">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div className="max-w-3xl">
            <p
              className="text-[0.7rem] font-bold uppercase tracking-[0.24em] md:text-xs"
              style={{ color: "var(--color-accent)" }}
            >
              {process.eyebrow}
            </p>

            <h2
              className="mt-3 max-w-[10ch] text-[2.2rem] font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-[2.8rem] md:text-[3.3rem] lg:text-[3.8rem] xl:text-[4.2rem]"
              style={{ color: "var(--color-accent)" }}
            >
              {process.title}
            </h2>

            <p
              className="mt-4 max-w-xl text-sm leading-relaxed md:text-base"
              style={{ color: "var(--color-text-main)" }}
            >
              {process.subtitle}
            </p>
          </div>

          <div className="lg:pt-10 xl:pt-12">
            <div
              className="rounded-[20px] border px-4 py-4 md:rounded-[24px] md:px-6 md:py-6"
              style={{
                borderColor: "rgba(177, 147, 89, 0.16)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                boxShadow: "0 14px 30px rgba(0,0,0,0.16)",
              }}
            >
              <p
                className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] md:text-xs"
                style={{ color: "var(--color-accent)" }}
              >
                {process.promise.title}
              </p>

              <p
                className="mt-3 text-sm leading-relaxed md:text-base"
                style={{ color: "var(--color-text-main)" }}
              >
                {process.promise.text}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-10 lg:mt-8 xl:py-6">
          <div
            className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 xl:block"
            style={{ backgroundColor: "rgba(177, 147, 89, 0.8)" }}
          />

          <div className="grid gap-4 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
            {process.steps.map((step, index) => (
              <article
                key={step.number}
                className={`relative min-h-[155px] rounded-[20px] border p-4 sm:min-h-[170px] sm:p-4 md:min-h-[190px] md:rounded-[24px] md:p-6 ${
                  index % 2 === 1 ? "xl:translate-y-6" : ""
                }`}
                style={{
                  borderColor: "rgba(177, 147, 89, 0.16)",
                  background:
                    "linear-gradient(180deg, rgba(60,32,22,0.92), rgba(38,20,14,0.96))",
                  boxShadow:
                    "0 14px 30px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-full border text-base font-black sm:h-14 sm:w-14 sm:text-lg md:h-16 md:w-16 md:text-xl"
                    style={{
                      color: "var(--color-accent)",
                      borderColor: "rgba(177, 147, 89, 0.2)",
                      backgroundColor: "rgba(177, 147, 89, 0.03)",
                    }}
                  >
                    {step.number}
                  </div>

                  <div
                    className="mt-4 h-2.5 w-2.5 rounded-full md:mt-5 md:h-3 md:w-3"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                </div>

                <h3
                  className="mt-4 text-[1.05rem] font-extrabold leading-tight sm:text-[1.15rem] md:mt-6 md:text-[1.35rem]"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {step.title}
                </h3>

                <p
                  className="mt-2 max-w-[26ch] text-[0.86rem] leading-relaxed md:mt-3 md:text-[0.95rem]"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {step.text}
                </p>

                <div
                  className="absolute bottom-4 left-4 right-4 h-px md:bottom-6 md:left-6 md:right-6"
                  style={{ backgroundColor: "rgba(177, 147, 89, 0.12)" }}
                />
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button text={process.buttons[0]} variant="primary" size="sm" />
          <Button href="/availability" text={process.buttons[1]} variant="secondary" size="sm" />
        </div>
      </div>
    </section>
  );
}

// TODO: Add real links for the CTA buttons once the contact and services sections are finalized.
// TODO: Consider using custom line breaks in process.title if the client wants exact control of the heading layout.
// TODO: Add optional icon or badge inside the promise card for extra visual weight.