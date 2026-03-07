import { getSiteData, type Language } from "@/data/siteData";

type FooterProps = {
  language: Language;
};

export default function Footer({ language }: FooterProps) {
  const data = getSiteData(language);

  const footerText =
    language === "da"
      ? "Reparation, service og fejlfinding af kaffemaskiner med fokus på kvalitet, gennemsigtighed og holdbare løsninger."
      : "Repair, service, and diagnostics for coffee machines with a focus on quality, transparency, and long-lasting solutions.";

  const copyrightText =
    language === "da"
      ? "© 2026 Caffe Jr. Alle rettigheder forbeholdes."
      : "© 2026 Caffe Jr. All rights reserved.";

  return (
    <footer className="border-t border-[#3a2418]/50 bg-[#120906] px-6 py-12 text-[#f5dfbf] md:px-12">
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-2 md:items-start">
        
        <div className="max-w-md">
          <h3 className="mb-3 text-2xl font-bold tracking-wide">
            {data.brand}
          </h3>

          <p className="leading-relaxed text-[#dbc19c]">
            {footerText}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm font-medium md:justify-self-end md:grid-cols-2">
          {data.nav.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-[#d29a68]"
            >
              {link.label}
            </a>
          ))}
        </div>

      </div>

      <div className="mx-auto mt-10 w-full max-w-7xl border-t border-[#3a2418]/40 pt-6 text-sm text-[#b8986d]">
        {copyrightText}
      </div>
    </footer>
  );
}

// TODO: Replace footer description with final approved business wording from the customer.
// TODO: Add social media links if the business wants more trust signals.
// TODO: Add company address, CVR number, and service area if needed.