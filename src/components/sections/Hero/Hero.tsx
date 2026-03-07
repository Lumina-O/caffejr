import Button from "@/components/ui/Button/Button";
import { siteData } from "@/data/siteData";

export default function Hero() {
  const { hero } = siteData;

  return (
    <section id="hero" className="px-4 pt-4 pb-10 md:px-6 md:pt-6 md:pb-14">
      <div
        className="mx-auto max-w-7xl rounded-[28px] border px-5 py-5 md:px-8 md:py-7"
        style={{
          borderColor: "var(--color-border-soft)",
          backgroundColor: "var(--color-bg-card)",
          boxShadow: "var(--shadow-main)",
        }}
      >
        <div
          className="rounded-[24px] px-4 py-5 md:px-8 md:py-7"
          style={{
          }}
        >
          <div className="space-y-6">
            {/* TITLE */}
            <div>
              <h1
                className="text-center text-[3rem] font-black uppercase leading-none tracking-[-0.04em] sm:text-[4.5rem] md:text-[6rem] lg:text-[7.5rem]"
                style={{ color: "var(--color-accent)" }}
              >
                {hero.title}
              </h1>
            </div>

            {/* MAIN HERO GRID */}
            <div className="grid items-center gap-6 md:grid-cols-[1fr_320px_1fr] lg:grid-cols-[1fr_380px_1fr]">
              {/* LEFT CONTENT */}
              <div className="max-w-[320px] space-y-4 md:self-start">
                <h2
                  className="text-left text-[1.35rem] font-extrabold uppercase leading-[1.05] tracking-[-0.03em] sm:text-[1.6rem] md:text-[1.8rem]"
                  style={{ color: "var(--color-accent)" }}
                >
                  {hero.leftTitle}
                </h2>

                <p
                  className="max-w-[280px] text-left text-sm leading-relaxed md:text-[0.95rem]"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {hero.leftText}
                </p>

                <div className="pt-1">
                  <Button text={hero.cta} />
                </div>
              </div>

              {/* CENTER IMAGE */}
              <div className="flex justify-center md:-mt-2">
                <div className="flex h-[260px] w-[220px] items-end justify-center md:h-[340px] md:w-[280px] lg:h-[380px] lg:w-[320px]">
                  <div
                    className="flex h-full w-full items-center justify-center rounded-[18px] border"
                    style={{
                      backgroundColor: "#24120c",
                      borderColor: "#5a3524",
                      boxShadow: "0 18px 40px rgba(0,0,0,0.38)",
                    }}
                  >
                    <span
                      className="px-6 text-center text-sm"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      Coffee machine image
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT CONTENT */}
              <div className="flex flex-col items-stretch gap-3 md:ml-auto md:max-w-[280px] md:self-center">
                <div className="mb-2 text-center md:text-right">
                  <h3
                    className="text-[1.2rem] font-extrabold uppercase leading-[1.1] tracking-[-0.03em] sm:text-[1.35rem]"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {hero.rightTitle}
                  </h3>
                </div>

                {hero.serviceBullets.map((bullet, index) => (
                  <div
                    key={bullet}
                    className="rounded-[16px] border px-4 py-3 text-center md:text-right"
                    style={{
                      backgroundColor: "#3a2218",
                      borderColor: "var(--color-border-card)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <p
                      className="text-sm font-extrabold"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {bullet}
                    </p>
                    <p
                      className="mt-1 text-xs leading-relaxed md:text-sm"
                      style={{ color: "var(--color-text-main)" }}
                    >
                      {hero.serviceTexts[index]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// TODO: Replace placeholder with the real coffee machine product image.
// TODO: Add decorative coffee splash graphics positioned absolutely around the hero.
// TODO: Fine-tune heading size and side column widths against the final approved mockup.