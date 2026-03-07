import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import { getSiteData, type Language } from "@/data/siteData";

type HeroProps = {
  language: Language;
};

export default function Hero({ language }: HeroProps) {
  const { hero } = getSiteData(language);

  return (
    <section
      id="hero"
      className="scroll-mt-28 px-4 pt-4 pb-10 md:px-6 md:pt-6 md:pb-14 lg:px-8 lg:pb-16"
    >
      <div
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] border"
        style={{
          borderColor: "var(--color-border-soft)",
          backgroundColor: "var(--color-bg-card)",
          boxShadow: "var(--shadow-main)",
        }}
      >
        {/* Mobile / tablet background image */}
        <div className="absolute inset-0 lg:hidden">
          <Image
            src="/images/header-image.png"
            alt="Hero background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Mobile / tablet overlay */}
        <div
          className="absolute inset-0 z-[1] lg:hidden"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,10,8,0.72), rgba(20,10,8,0.88))",
          }}
        />

        {/* Desktop subtle background */}
        <div
          className="absolute inset-0 hidden lg:block"
          style={{
            background:
              "radial-gradient(circle at center, rgba(120,72,48,0.08), transparent 52%)",
          }}
        />

        <div className="relative z-10 px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
          <div className="space-y-6 lg:space-y-8">
            <h1
              className="mb-10 text-center text-[3rem] font-black uppercase leading-none tracking-[-0.05em] sm:text-[4.5rem] md:text-[5rem] lg:mb-16 lg:text-[7.2rem] xl:text-[8rem]"
              style={{ color: "var(--color-accent)" }}
            >
              {hero.title}
            </h1>

            <div className="grid gap-6 lg:grid-cols-[1fr_460px_1fr] lg:items-center lg:gap-8 xl:grid-cols-[1fr_520px_1fr]">
              {/* Left content */}
              <div className="max-w-[320px] space-y-4 lg:self-center lg:max-w-[360px]">
                <h2
                  className="text-left text-[1.35rem] font-extrabold uppercase leading-[1.05] tracking-[-0.03em] sm:text-[1.6rem] lg:text-[2rem]"
                  style={{ color: "var(--color-accent)" }}
                >
                  {hero.leftTitle}
                </h2>

                <p
                  className="max-w-[300px] text-left text-sm leading-relaxed md:max-w-[320px] lg:text-base"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {hero.leftText}
                </p>

                <div className="pt-1">
                  <Button text={hero.cta} />
                </div>
              </div>

              {/* Center image - desktop only */}
              <div className="hidden justify-center lg:flex lg:items-end">
                <div className="flex items-end justify-center">
                  <Image
                    src="/images/header-image.png"
                    alt="Coffee machine"
                    width={120}
                    height={320}
                    className="h-auto w-[200px] lg:w-[240px] xl:w-[280px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                    priority
                  />
                </div>
              </div>

              {/* Right content */}
              <div className="flex flex-col items-stretch gap-3 lg:ml-auto lg:max-w-[320px] lg:self-center">
                <div className="mb-2 text-center lg:text-right">
                  <h3
                    className="text-[1.2rem] font-extrabold uppercase leading-[1.1] tracking-[-0.03em] sm:text-[1.35rem] lg:text-[1.75rem]"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {hero.rightTitle}
                  </h3>
                </div>

                {hero.serviceBullets.map((bullet, index) => (
                  <div
                    key={bullet}
                    className="rounded-[16px] border px-4 py-3 text-center lg:px-5 lg:py-3.5 lg:text-right"
                    style={{
                      backgroundColor: "#3a2218",
                      borderColor: "var(--color-border-card)",
                      boxShadow: "var(--shadow-card)",
                    }}
                  >
                    <p
                      className="text-sm font-extrabold lg:text-[0.95rem]"
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