import { getSiteData, type Language } from "@/data/siteData";
import Button from "@/components/ui/Button/Button";

type ContactProps = {
  language: Language;
};

export default function Contact({ language }: ContactProps) {
  const { contact } = getSiteData(language);

  return (
    <section
      id="contact"
      className="relative w-full px-4 py-20 md:px-6 md:py-24 lg:py-28"
      style={{ backgroundColor: "var(--color-bg-main)" }}
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
              <Button text="Kontakt os" variant="primary" size="md" />
              <Button text="Ring nu" variant="secondary" size="md" />
            </div>
          </div>

          <div
            className="flex min-h-[320px] items-center justify-center rounded-[24px] border px-6 py-6 md:min-h-[420px]"
            style={{
              backgroundColor: "#24150f",
              borderColor: "rgba(90, 53, 36, 0.9)",
              boxShadow: "0 10px 24px rgba(0, 0, 0, 0.2)",
            }}
          >
            <div className="text-center">
              <p
                className="text-sm font-semibold uppercase tracking-[0.16em]"
                style={{ color: "var(--color-accent-soft)" }}
              >
                Kontaktkort
              </p>
              <p
                className="mt-3 text-sm leading-relaxed md:text-base"
                style={{ color: "var(--color-text-muted)" }}
              >
                Her kan du senere indsætte kort, billede, kontaktformular eller
                en visuel informationsblok.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// TODO: Replace the right-side placeholder with a real map, workshop image, or contact form.
// TODO: Add tel: and mailto: links when the final interaction flow is ready.
// TODO: Connect the CTA buttons to the final booking or contact action.