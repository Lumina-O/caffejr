import { getSiteData, type Language } from "@/data/siteData";

type HelpProps = {
  language: Language;
};

export default function Help({ language }: HelpProps) {
  const { help } = getSiteData(language);

  return (
    <section
      id="help"
      className="relative scroll-mt-28 overflow-hidden px-4 py-16 md:px-6 md:py-20 lg:min-h-screen lg:px-8 lg:py-24"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center">
        <div className="w-full max-w-5xl text-left">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--color-accent-soft)" }}
          >
            Services
          </p>

          <h2
            className="max-w-4xl text-[2.2rem] font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem]"
            style={{ color: "var(--color-accent)" }}
          >
            {help.title}
          </h2>

          <p
            className="mt-4 max-w-2xl text-sm leading-relaxed md:text-base"
            style={{ color: "var(--color-text-main)" }}
          >
            {help.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <div
              className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                borderColor: "var(--color-border-card)",
                color: "var(--color-accent-soft)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              Hurtig respons
            </div>

            <div
              className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                borderColor: "var(--color-border-card)",
                color: "var(--color-accent-soft)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              Professionel service
            </div>

            <div
              className="rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em]"
              style={{
                borderColor: "var(--color-border-card)",
                color: "var(--color-accent-soft)",
                backgroundColor: "rgba(255,255,255,0.02)",
              }}
            >
              Klar vurdering
            </div>
          </div>
        </div>

        <div className="mt-12 grid w-full max-w-6xl gap-5 md:grid-cols-3">
          {help.cards.map((card) => (
            <article
              key={card.title}
              className="flex h-full flex-col rounded-[24px] border p-6 md:p-7"
              style={{
                background:
                  "linear-gradient(180deg, rgba(58,30,18,0.96) 0%, rgba(42,25,18,0.96) 100%)",
                borderColor: "var(--color-border-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <p
                className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em]"
                style={{ color: "var(--color-accent-soft)" }}
              >
                {card.eyebrow}
              </p>

              <h3
                className="min-h-[56px] text-lg font-extrabold leading-tight md:text-[1.65rem]"
                style={{ color: "var(--color-text-main)" }}
              >
                {card.title}
              </h3>

              <p
                className="mt-4 text-sm leading-relaxed md:text-[0.98rem]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {card.text}
              </p>

              <ul className="mt-6 space-y-3">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm leading-relaxed"
                    style={{ color: "var(--color-text-main)" }}
                  >
                    <span
                      className="mt-[0.15rem] inline-block h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5">
                <div
                  className="h-px w-full"
                  style={{ backgroundColor: "var(--color-border-card)" }}
                />
                <p
                  className="mt-4 text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "var(--color-accent-soft)" }}
                >
                  Kontakt os for en vurdering
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// TODO: Add small service icons for each card once the final brand assets are ready.
// TODO: Add hover interaction on desktop such as slight lift and border glow.
// TODO: Link each card to its relevant contact or booking action.