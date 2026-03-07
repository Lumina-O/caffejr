export default function Footer() {
  return (
    <footer className="border-t border-[#3a2418]/50 bg-[#120906] px-6 py-12 text-[#f5dfbf]">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 md:flex-row md:justify-between">
        
        <div>
          <h3 className="mb-3 text-2xl font-bold tracking-wide">Caffe Jr.</h3>

          <p className="max-w-md leading-relaxed text-[#dbc19c]">
            Premium coffee experiences for events, offices, and special moments.
          </p>
        </div>

        <div className="flex flex-wrap gap-6 text-sm font-medium">
          <a
            href="#help"
            className="transition-colors hover:text-[#d29a68]"
          >
            Services
          </a>

          <a
            href="#process"
            className="transition-colors hover:text-[#d29a68]"
          >
            Process
          </a>

          <a
            href="#testimonials"
            className="transition-colors hover:text-[#d29a68]"
          >
            Reviews
          </a>

          <a
            href="#contact"
            className="transition-colors hover:text-[#d29a68]"
          >
            Contact
          </a>
        </div>

      </div>

      <div className="mx-auto mt-10 w-full max-w-7xl border-t border-[#3a2418]/40 pt-6 text-sm text-[#b8986d]">
        © 2026 Caffe Jr. All rights reserved.
      </div>
    </footer>
  );
}

// TODO: Replace placeholder company text and copyright year if needed.
// TODO: Add social media icons (Instagram / LinkedIn) if the business wants more credibility.
// TODO: Add company address + CVR if the company operates officially in Denmark.