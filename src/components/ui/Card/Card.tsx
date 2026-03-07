type CardProps = {
  title: string;
  text: string;
  number?: string;
  icon?: React.ReactNode;
  variant?: "default" | "highlight";
};

export default function Card({
  title,
  text,
  number,
  icon,
  variant = "default",
}: CardProps) {
  const base =
    "relative rounded-[16px] border px-5 py-5 transition duration-200";

  const variants = {
    default:
      "bg-[#3a2218] border-[var(--color-border-card)] hover:translate-y-[-2px]",
    highlight:
      "bg-[#3a2218] border-[var(--color-accent)] hover:translate-y-[-2px]",
  };

  return (
    <article className={`${base} ${variants[variant]}`}>
      {number && (
        <span className="mb-3 inline-block text-xs font-bold text-[var(--color-accent)]">
          {number}
        </span>
      )}

      {icon && <div className="mb-3 text-[var(--color-accent)]">{icon}</div>}

      <h3 className="mb-2 text-lg font-extrabold uppercase text-[var(--color-accent)]">
        {title}
      </h3>

      <p className="text-sm leading-relaxed text-[var(--color-text-main)]">
        {text}
      </p>
    </article>
  );
}

// TODO: Add optional CTA button inside cards for service sections.
// TODO: Add horizontal layout variant for testimonial cards.
// TODO: Add image variant for service or product cards.