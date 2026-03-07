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
      className="relative overflow-hidden px-4 py-16 md:px-6 md:py-20 lg:min-h-screen lg:px-8 lg:py-24"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-between lg:min-h-[calc(100vh-12rem)]">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="max-w-4xl">
            <p
              className="text-xs font-bold uppercase tracking-[0.28em] md:text-sm"
              style={{ color: "var(--color-accent)" }}
            >
              {process.eyebrow}
            </p>

            <h2
              className="mt-4 max-w-[11ch] text-[2.8rem] font-black uppercase leading-[0.9] tracking-[-0.06em] sm:text-[3.6rem] md:text-[4rem] lg:text-[4.5rem] xl:text-[5rem]"
              style={{ color: "var(--color-accent)" }}
            >
              {process.title}
            </h2>

            <p
              className="mt-6 max-w-2xl text-base leading-relaxed md:text-lg"
              style={{ color: "var(--color-text-main)" }}
            >
              {process.subtitle}
            </p>
          </div>

          <div className="lg:pt-16 xl:pt-20">
            <div
              className="rounded-[24px] border px-5 py-5 md:rounded-[28px] md:px-8 md:py-8"
              style={{
                borderColor: "rgba(177, 147, 89, 0.16)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
              }}
            >
              <p
                className="text-xs font-semibold uppercase tracking-[0.22em] md:text-sm"
                style={{ color: "var(--color-accent)" }}
              >
                {process.promise.title}
              </p>

              <p
                className="mt-4 text-sm leading-relaxed sm:text-base md:text-lg"
                style={{ color: "var(--color-text-main)" }}
              >
                {process.promise.text}
              </p>
            </div>
          </div>
        </div>

        <div className="relative mt-14 lg:mt-10 xl:py-10">
          <div
            className="absolute left-0 right-0 top-1/2 hidden h-px -translate-y-1/2 xl:block"
            style={{ backgroundColor: "rgba(177, 147, 89, 0.8)" }}
          />

          <div className="grid gap-4 md:grid-cols-2 md:gap-5 xl:grid-cols-4">
            {process.steps.map((step, index) => (
              <article
                key={step.number}
                className={`relative min-h-[180px] rounded-[22px] border p-4 sm:min-h-[200px] sm:p-5 md:min-h-[220px] md:rounded-[28px] md:p-8 ${
                  index % 2 === 1 ? "xl:translate-y-10" : ""
                }`}
                style={{
                  borderColor: "rgba(177, 147, 89, 0.16)",
                  background:
                    "linear-gradient(180deg, rgba(60,32,22,0.92), rgba(38,20,14,0.96))",
                  boxShadow:
                    "0 18px 40px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.03)",
                }}
              >
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full border text-lg font-black sm:h-16 sm:w-16 sm:text-xl md:h-20 md:w-20 md:text-2xl"
                    style={{
                      color: "var(--color-accent)",
                      borderColor: "rgba(177, 147, 89, 0.2)",
                      backgroundColor: "rgba(177, 147, 89, 0.03)",
                    }}
                  >
                    {step.number}
                  </div>

                  <div
                    className="mt-5 h-3 w-3 rounded-full md:mt-8 md:h-4 md:w-4"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  />
                </div>

                <h3
                  className="mt-6 text-[1.2rem] font-extrabold leading-tight sm:text-[1.35rem] md:mt-10 md:text-[1.7rem]"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {step.title}
                </h3>

                <p
                  className="mt-3 max-w-[28ch] text-sm leading-relaxed sm:text-[0.95rem] md:mt-5 md:text-base"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {step.text}
                </p>

                <div
                  className="absolute bottom-5 left-4 right-4 h-px sm:bottom-6 sm:left-5 sm:right-5 md:bottom-8 md:left-8 md:right-8"
                  style={{ backgroundColor: "rgba(177, 147, 89, 0.12)" }}
                />
              </article>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-3">
          <Button text={process.buttons[0]} variant="primary" size="sm" />
          <Button text={process.buttons[1]} variant="secondary" size="sm" />
        </div>
      </div>
    </section>
  );
}

// TODO: Add real links for the CTA buttons once the contact and services sections are finalized.
// TODO: Consider using custom line breaks in process.title if the client wants exact control of the heading layout.
// TODO: Add optional icon or badge inside the promise card for extra visual weight.