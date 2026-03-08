"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button/Button";
import CoffeeMachine3D from "@/components/ui/CoffeeMachine3D/CoffeeMachine3D";
import { getSiteData, type Language } from "@/data/siteData";

type HeroProps = {
  language: Language;
};

export default function Hero({ language }: HeroProps) {
  const { hero } = getSiteData(language);

  const [show3D, setShow3D] = useState(true);
  const [has3DError, setHas3DError] = useState(false);

  const shouldShow3D = useMemo(() => {
    return show3D && !has3DError;
  }, [show3D, has3DError]);

  return (
    <section
      id="hero"
      className="scroll-mt-28 px-4 pt-4 pb-8 md:px-6 md:pt-6 md:pb-10 lg:px-8 lg:pb-12"
    >
      <div
        className="relative mx-auto min-h-[620px] max-w-7xl overflow-hidden rounded-[28px] border lg:min-h-[640px]"
        style={{
          borderColor: "var(--color-border-soft)",
          backgroundColor: "var(--color-bg-card)",
          boxShadow: "var(--shadow-main)",
        }}
      >
        {/* Image fallback background */}
        <div className="absolute inset-0">
          <Image
            src="/images/header-image.png"
            alt="Coffee machine background"
            fill
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Image blur layer */}
        <div className="absolute inset-0 scale-110">
          <Image
            src="/images/header-image.png"
            alt=""
            fill
            aria-hidden="true"
            className="object-cover object-center blur-2xl opacity-70"
            priority
          />
        </div>

        {/* Full 3D background */}
        {shouldShow3D && (
          <div className="absolute inset-0 z-[1]">
            <CoffeeMachine3D
              mode="background"
              onError={() => setHas3DError(true)}
            />
          </div>
        )}

        {/* Dark readability overlay */}
        <div
          className="absolute inset-0 z-[2]"
          style={{
            background:
              "linear-gradient(to bottom, rgba(20,10,8,0.62), rgba(20,10,8,0.82))",
          }}
        />

        {/* Extra vignette / side shading */}
        <div
          className="absolute inset-0 z-[3]"
          style={{
            background: `
              radial-gradient(circle at center, rgba(140,92,60,0.10), transparent 42%),
              linear-gradient(to right, rgba(18,8,6,0.72) 0%, rgba(18,8,6,0.18) 22%, rgba(18,8,6,0.10) 50%, rgba(18,8,6,0.18) 78%, rgba(18,8,6,0.72) 100%)
            `,
          }}
        />

        {/* Toggle button */}
        <div className="absolute right-4 top-4 z-20 md:right-6 md:top-6">
          <button
            type="button"
            onClick={() => setShow3D((prev) => !prev)}
            className="rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] transition hover:scale-[1.02] md:text-sm"
            style={{
              color: "var(--color-accent)",
              backgroundColor: "rgba(58, 34, 24, 0.82)",
              borderColor: "var(--color-border-card)",
              boxShadow: "var(--shadow-card)",
              backdropFilter: "blur(10px)",
            }}
            aria-pressed={shouldShow3D}
          >
            {shouldShow3D ? "Use image" : "Use 3D"}
          </button>
        </div>

        <div className="relative z-10 px-5 py-5 md:px-8 md:py-7 lg:px-10 lg:py-8">
          <div className="space-y-5 lg:space-y-6">
            <h1
              className="mb-8 text-center text-[3rem] font-black uppercase leading-none tracking-[-0.05em] sm:text-[4.2rem] md:text-[4.8rem] lg:mb-12 lg:text-[6.2rem] xl:text-[7rem]"
              style={{ color: "var(--color-accent)" }}
            >
              {hero.title}
            </h1>

            <div className="grid gap-6 lg:grid-cols-[1fr_360px_1fr] lg:items-center lg:gap-6 xl:grid-cols-[1fr_420px_1fr]">
              {/* Left content */}
              <div className="max-w-[320px] space-y-4 lg:self-center lg:max-w-[340px]">
                <h2
                  className="text-left text-[1.35rem] font-extrabold uppercase leading-[1.05] tracking-[-0.03em] sm:text-[1.55rem] lg:text-[1.9rem]"
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
                  <Button text={hero.cta} href="/booking" />
                </div>
              </div>

              {/* Center image fallback only when 3D is off */}
              <div className="hidden justify-center lg:flex lg:items-end">
                {!shouldShow3D ? (
                  <div className="relative h-[300px] w-full max-w-[220px] xl:h-[360px] xl:max-w-[260px]">
                    <Image
                      src="/images/header-image.png"
                      alt="Coffee machine"
                      fill
                      className="object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.45)]"
                      priority
                    />
                  </div>
                ) : (
                  <div className="h-[300px] w-full max-w-[220px] xl:h-[360px] xl:max-w-[260px]" />
                )}
              </div>

              {/* Right content */}
              <div className="flex flex-col items-stretch gap-3 lg:ml-auto lg:max-w-[300px] lg:self-center">
                <div className="mb-1 text-center lg:text-right">
                  <h3
                    className="text-[1.15rem] font-extrabold uppercase leading-[1.1] tracking-[-0.03em] sm:text-[1.3rem] lg:text-[1.65rem]"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {hero.rightTitle}
                  </h3>
                </div>

                {hero.serviceBullets.map((bullet, index) => (
                  <div
                    key={bullet}
                    className="rounded-[16px] border px-4 py-3 text-center lg:px-5 lg:py-3 lg:text-right"
                    style={{
                      backgroundColor: "rgba(58, 34, 24, 0.88)",
                      borderColor: "var(--color-border-card)",
                      boxShadow: "var(--shadow-card)",
                      backdropFilter: "blur(10px)",
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

            {has3DError && (
              <div className="pt-1 text-center">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.14em]"
                  style={{ color: "var(--color-accent)" }}
                >
                  3D unavailable - showing image fallback
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// TODO: Save the 3D/image toggle preference in localStorage.
// TODO: Add reduced-motion support so 3D rotation can be disabled automatically.
// TODO: Fine-tune overlay darkness after testing the real model in production.