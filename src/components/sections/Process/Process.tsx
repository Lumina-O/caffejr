import { siteData } from "@/data/siteData";
import Button from "@/components/ui/Button/Button";

export default function Process() {
  const { process } = siteData;

  return (
    <section
      id="process"
      className="relative w-full px-4 py-20 md:px-6 md:py-24 lg:py-28"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <h2
            className="text-[2.4rem] font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-[3.2rem] md:text-[4.4rem] lg:text-[5rem]"
            style={{ color: "var(--color-accent)" }}
          >
            {process.title}
          </h2>

          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed md:text-base"
            style={{ color: "var(--color-text-main)" }}
          >
            {process.subtitle}
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:mt-14 md:grid-cols-2 xl:grid-cols-4 xl:gap-5">
          {process.steps.map((step) => (
            <article
              key={step.number}
              className="min-h-[170px] rounded-[18px] border px-4 py-4 md:min-h-[190px] md:px-5 md:py-5"
              style={{
                backgroundColor: "#2f1c15",
                borderColor: "rgba(90, 53, 36, 0.9)",
                boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
              }}
            >
              <span
                className="block text-[1.8rem] font-black leading-none md:text-[2.2rem]"
                style={{ color: "var(--color-accent)" }}
              >
                {step.number}
              </span>

              <h3
                className="mt-3 text-[1rem] font-extrabold leading-[1.1] md:text-[1.05rem]"
                style={{ color: "var(--color-text-main)" }}
              >
                {step.title}
              </h3>

              <p
                className="mt-3 text-[0.82rem] leading-relaxed md:text-sm"
                style={{ color: "var(--color-text-muted)" }}
              >
                {step.text}
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button text={process.buttons[0]} variant="primary" size="sm" />
          <Button text={process.buttons[1]} variant="secondary" size="sm" />
        </div>
      </div>
    </section>
  );
}

// TODO: Add decorative coffee bean images near the bottom area like in the design.
// TODO: Slightly offset card positions if we want a more custom editorial feel.
// TODO: Link buttons to booking and service info sections once those routes are ready.