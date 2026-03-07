type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionTitleProps) {
  const alignment =
    align === "center"
      ? "text-center mx-auto"
      : "text-left";

  return (
    <div className={`max-w-2xl ${alignment}`}>
      {eyebrow && (
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--color-accent-soft)]">
          {eyebrow}
        </p>
      )}

      <h2 className="text-2xl font-black uppercase tracking-tight text-[var(--color-accent)] md:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-main)] md:text-base">
          {description}
        </p>
      )}
    </div>
  );
}

// TODO: Add optional size variants (sm, md, lg) for hero-style titles.
// TODO: Add optional divider element under titles if future sections need it.
// TODO: Add optional maxWidth control for wider marketing sections.