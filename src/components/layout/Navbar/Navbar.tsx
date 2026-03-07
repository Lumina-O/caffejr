"use client";

import { useState } from "react";
import { getSiteData, type Language } from "@/data/siteData";

type NavbarProps = {
  language: Language;
  onLanguageChange: (language: Language) => void;
};

export default function Navbar({
  language,
  onLanguageChange,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = getSiteData(language);

  const navLinks = data.nav;

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  const handleLanguageChange = (nextLanguage: Language) => {
    onLanguageChange(nextLanguage);
    setIsOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-[#3a2418]/60 bg-[#1b0d07]/95 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-5 md:px-12">
          <a
            href="#top"
            className="text-2xl font-bold tracking-wide text-[#f4d7ae] transition-opacity hover:opacity-80"
          >
            {data.brand}
          </a>

          <div className="hidden items-center gap-4 md:flex">
            <nav className="flex items-center gap-6">
              {navLinks.map((link, index) => {
                const isLast = index === navLinks.length - 1;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-medium transition-colors ${
                      isLast
                        ? "rounded-full border border-[#7a4b2e] px-4 py-2 text-[#f4d7ae] hover:bg-[#7a4b2e] hover:text-[#fff3e0]"
                        : "text-[#f4d7ae] hover:text-[#d29a68]"
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}
            </nav>

            <div className="flex items-center rounded-full border border-[#7a4b2e] p-1.5">
              <button
                type="button"
                onClick={() => handleLanguageChange("da")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  language === "da"
                    ? "bg-[#7a4b2e] text-[#fff3e0]"
                    : "text-[#f4d7ae] hover:text-[#d29a68]"
                }`}
                aria-label="Switch language to Danish"
              >
                DA
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  language === "en"
                    ? "bg-[#7a4b2e] text-[#fff3e0]"
                    : "text-[#f4d7ae] hover:text-[#d29a68]"
                }`}
                aria-label="Switch language to English"
              >
                EN
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-full border border-[#7a4b2e] px-4 py-2 text-sm font-medium text-[#f4d7ae] transition-colors hover:bg-[#7a4b2e] hover:text-[#fff3e0] md:hidden"
            aria-label={language === "da" ? "Åbn menu" : "Open navigation menu"}
            aria-expanded={isOpen}
          >
            Menu
          </button>
        </div>
      </header>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex min-h-screen flex-col bg-[#1b0d07] px-6 py-6 md:hidden">
          <div className="flex items-center justify-between border-b border-[#3a2418]/60 pb-4">
            <span className="text-2xl font-bold tracking-wide text-[#f4d7ae]">
              {data.brand}
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-[#7a4b2e] px-4 py-2 text-sm font-medium text-[#f4d7ae] transition-colors hover:bg-[#7a4b2e] hover:text-[#fff3e0]"
              aria-label={language === "da" ? "Luk menu" : "Close navigation menu"}
            >
              {language === "da" ? "Luk" : "Close"}
            </button>
          </div>

          <div className="mt-6 flex justify-center">
            <div className="flex items-center rounded-full border border-[#7a4b2e] p-2">
              <button
                type="button"
                onClick={() => handleLanguageChange("da")}
                className={`rounded-full px-6 py-3 text-base font-semibold transition-colors ${
                  language === "da"
                    ? "bg-[#7a4b2e] text-[#fff3e0]"
                    : "text-[#f4d7ae] hover:text-[#d29a68]"
                }`}
                aria-label="Switch language to Danish"
              >
                DA
              </button>

              <button
                type="button"
                onClick={() => handleLanguageChange("en")}
                className={`rounded-full px-6 py-3 text-base font-semibold transition-colors ${
                  language === "en"
                    ? "bg-[#7a4b2e] text-[#fff3e0]"
                    : "text-[#f4d7ae] hover:text-[#d29a68]"
                }`}
                aria-label="Switch language to English"
              >
                EN
              </button>
            </div>
          </div>

          <nav className="flex flex-1 flex-col items-center justify-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleLinkClick}
                className="text-3xl font-bold tracking-wide text-[#f4d7ae] transition-colors hover:text-[#d29a68]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

// TODO: Add slide/fade animation to the mobile menu.
// TODO: Close menu when user presses Escape.
// TODO: Highlight active section in navbar while scrolling.
// TODO: Save selected language in localStorage so it stays after refresh.