"use client";

import { useState } from "react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Services", href: "#help" },
    { label: "Process", href: "#process" },
    { label: "Reviews", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ];

  const handleLinkClick = () => {
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
            Caffe Jr.
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  link.label === "Contact"
                    ? "rounded-full border border-[#7a4b2e] px-4 py-2 text-[#f4d7ae] hover:bg-[#7a4b2e] hover:text-[#fff3e0]"
                    : "text-[#f4d7ae] hover:text-[#d29a68]"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="rounded-full border border-[#7a4b2e] px-4 py-2 text-sm font-medium text-[#f4d7ae] transition-colors hover:bg-[#7a4b2e] hover:text-[#fff3e0] md:hidden"
            aria-label="Open navigation menu"
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
              Caffe Jr.
            </span>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-[#7a4b2e] px-4 py-2 text-sm font-medium text-[#f4d7ae] transition-colors hover:bg-[#7a4b2e] hover:text-[#fff3e0]"
              aria-label="Close navigation menu"
            >
              Close
            </button>
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