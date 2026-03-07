import { siteData } from "@/data/siteData";

export default function Help() {
  const { help } = siteData;

  return (
    <section
      id="help"
      className="relative w-full px-4 py-16 md:px-6 md:py-20 lg:py-24"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--color-accent-soft)" }}
          >
            Services
          </p>

          <h2
            className="text-[2.2rem] font-black uppercase leading-[0.95] tracking-[-0.04em] sm:text-[3rem] md:text-[4rem] lg:text-[4.5rem]"
            style={{ color: "var(--color-accent)" }}
          >
            {help.title}
          </h2>

          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed md:text-base"
            style={{ color: "var(--color-text-main)" }}
          >
            {help.subtitle}
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:mt-12 md:grid-cols-3">
          {help.cards.map((card) => (
            <article
              key={card.title}
              className="rounded-[20px] border px-5 py-5 md:px-6 md:py-6"
              style={{
                backgroundColor: "#2a1912",
                borderColor: "var(--color-border-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <p
                className="mb-2 text-[0.72rem] uppercase tracking-[0.16em]"
                style={{ color: "var(--color-accent-soft)" }}
              >
                {card.eyebrow}
              </p>

              <h3
                className="text-lg font-extrabold leading-tight md:text-xl"
                style={{ color: "var(--color-text-main)" }}
              >
                {card.title}
              </h3>

              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "var(--color-text-muted)" }}
              >
                {card.text}
              </p>

              <ul className="mt-4 space-y-2">
                {card.points.map((point) => (
                  <li
                    key={point}
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--color-text-main)" }}
                  >
                    - {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

// TODO: Add decorative coffee splash asset on the top-left and bottom-right like in the mockup.
// TODO: Fine-tune card widths and section spacing once the real assets are placed.
// TODO: Add responsive line breaks for the heading if needed to match the approved design exactly.