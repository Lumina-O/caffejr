import { siteData } from "@/data/siteData";
import Button from "@/components/ui/Button/Button";

export default function Testimonials() {
  const { testimonials } = siteData;

  return (
    <section
      id="testimonials"
      className="relative w-full px-4 py-20 md:px-6 md:py-24 lg:py-28"
      style={{ backgroundColor: "var(--color-bg-main)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p
            className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]"
            style={{ color: "var(--color-accent-soft)" }}
          >
            Testimonials
          </p>

          <h2
            className="text-[2.4rem] font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-[3.2rem] md:text-[4.4rem] lg:text-[5rem]"
            style={{ color: "var(--color-accent)" }}
          >
            {testimonials.title}
          </h2>

          <p
            className="mt-3 max-w-2xl text-sm leading-relaxed md:text-base"
            style={{ color: "var(--color-text-main)" }}
          >
            {testimonials.subtitle}
          </p>
        </div>

        {/* Scrollable testimonials */}
        <div className="mt-12 md:mt-14">
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
            {testimonials.cards.map((card, index) => (
              <article
                key={`${card.name}-${index}`}
                className="flex min-h-[200px] w-[260px] flex-shrink-0 snap-start flex-col rounded-[18px] border px-5 py-5 md:min-h-[220px] md:w-[300px] md:px-6 md:py-6"
                style={{
                  backgroundColor: "#2f1c15",
                  borderColor: "rgba(90, 53, 36, 0.9)",
                  boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
                }}
              >
                <span
                  className="text-base leading-none md:text-lg"
                  style={{ color: "var(--color-accent)" }}
                >
                  {card.rating}
                </span>

                <p
                  className="mt-4 flex-1 text-sm leading-relaxed md:text-[0.95rem]"
                  style={{ color: "var(--color-text-main)" }}
                >
                  <span
                    className="text-3xl leading-none"
                    style={{ color: "var(--color-accent)" }}
                  >
                    “
                  </span>
                  {card.text}
                  <span
                    className="text-3xl leading-none"
                    style={{ color: "var(--color-accent)" }}
                  >
                    ”
                  </span>
                </p>

                <p
                  className="mt-5 text-xs font-semibold uppercase tracking-[0.12em] md:text-sm"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {card.name}
                </p>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button text={testimonials.button} variant="primary" size="sm" />
        </div>
      </div>
    </section>
  );
}

// TODO: Replace placeholder reviews with real customer testimonials and names.
// TODO: Add decorative quote marks or coffee-themed accents if the customer wants more personality.
// TODO: Link CTA button to the final booking/contact flow once ready.