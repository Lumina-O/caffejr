"use client";

import { useEffect, useState } from "react";
import { getSiteData, type Language } from "@/data/siteData";
import Button from "@/components/ui/Button/Button";

type ContactProps = {
  language: Language;
};

export default function Contact({ language }: ContactProps) {
  const { contact } = getSiteData(language);

  const address = "Vigerslevvej 50A, 2500 Valby";
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(address)}&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapFailed, setMapFailed] = useState(false);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!mapLoaded) {
        setMapFailed(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [mapLoaded, mapKey]);

  const reloadMap = () => {
    setMapLoaded(false);
    setMapFailed(false);
    setMapKey((prev) => prev + 1);
  };

  return (
    <section
      id="contact"
      className="relative w-full px-4 py-20 md:px-6 md:py-24 lg:py-28"
      style={{ backgroundColor: "var(--color-bg-surface)" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div
            className="rounded-[24px] border px-6 py-6 md:px-8 md:py-8"
            style={{
              backgroundColor: "#2f1c15",
              borderColor: "rgba(90, 53, 36, 0.9)",
              boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
            }}
          >
            <p
              className="mb-3 text-xs font-semibold uppercase tracking-[0.24em]"
              style={{ color: "var(--color-accent-soft)" }}
            >
              Contact
            </p>

            <h2
              className="text-[2.2rem] font-black uppercase leading-[0.95] tracking-[-0.05em] sm:text-[3rem] md:text-[4rem]"
              style={{ color: "var(--color-accent)" }}
            >
              {contact.title}
            </h2>

            <p
              className="mt-4 max-w-2xl text-sm leading-relaxed md:text-base"
              style={{ color: "var(--color-text-main)" }}
            >
              {contact.subtitle}
            </p>

            <div className="mt-8 space-y-4">
              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "var(--color-accent-soft)" }}
                >
                  Telefon
                </p>
                <p
                  className="mt-1 text-base font-semibold md:text-lg"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {contact.phone}
                </p>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "var(--color-accent-soft)" }}
                >
                  Email
                </p>
                <p
                  className="mt-1 text-base font-semibold md:text-lg"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {contact.email}
                </p>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "var(--color-accent-soft)" }}
                >
                  Adresse
                </p>
                <p
                  className="mt-1 text-base font-semibold md:text-lg"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {contact.address}
                </p>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase tracking-[0.16em]"
                  style={{ color: "var(--color-accent-soft)" }}
                >
                  Åbningstider
                </p>
                <p
                  className="mt-1 text-base font-semibold md:text-lg"
                  style={{ color: "var(--color-text-main)" }}
                >
                  {contact.hours}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                text="Kontakt os"
                href={`mailto:${contact.email}`}
                variant="primary"
                size="md"
              />
              <Button
                text="Ring nu"
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                variant="secondary"
                size="md"
              />
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[24px] border md:min-h-[420px]"
            style={{
              backgroundColor: "#24150f",
              borderColor: "rgba(90, 53, 36, 0.9)",
              boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
            }}
          >
            {!mapFailed ? (
              <>
                <iframe
                  key={mapKey}
                  title="Google Map - Vigerslevvej 50A, 2500 Valby"
                  src={mapSrc}
                  className="h-full min-h-[320px] w-full md:min-h-[420px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoaded(true)}
                />
                <a
                  href={mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-4 right-4 rounded-lg px-4 py-2 text-sm font-semibold shadow-lg transition hover:opacity-90"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "#1b120e",
                  }}
                >
                  Åbn i Google Maps
                </a>
              </>
            ) : (
              <div className="flex h-full min-h-[320px] items-center justify-center px-6 text-center md:min-h-[420px]">
                <div>
                  <p
                    className="text-sm font-semibold uppercase tracking-[0.16em]"
                    style={{ color: "var(--color-accent-soft)" }}
                  >
                    Map
                  </p>

                  <p
                    className="mt-3 text-sm leading-relaxed md:text-base"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    Map cannot be rendered.
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center gap-3">
                    <button
                      onClick={reloadMap}
                      className="rounded-lg px-4 py-2 text-sm font-semibold transition"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        color: "#1b120e",
                      }}
                    >
                      Reload map
                    </button>
                    <a
                      href={mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg border px-4 py-2 text-sm font-semibold transition hover:opacity-90"
                      style={{
                        borderColor: "var(--color-accent)",
                        color: "var(--color-accent)",
                      }}
                    >
                      Åbn i Google Maps
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Map embeds Google Maps for the real address with an "Open in Google Maps"
// link (overlay + failure fallback). tel:/mailto: CTAs are wired to siteData.
