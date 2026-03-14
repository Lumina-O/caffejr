import Link from "next/link";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  target?: "_self" | "_blank";
  rel?: string;
};

export default function Button({
  text,
  onClick,
  href,
  type = "button",
  variant = "primary",
  size = "md",
  target = "_self",
  rel,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full font-semibold transition duration-200";

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-5 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-[var(--color-accent)] text-[#2b170f] hover:bg-[var(--color-accent-soft)]",
    secondary:
      "border border-[var(--color-border-card)] text-[var(--color-text-main)] hover:bg-[#3a2218]",
    ghost:
      "text-[var(--color-accent)] hover:underline",
  };

  const className = `${base} ${sizes[size]} ${variants[variant]}`;

  if (href) {
    const isNativeAnchor =
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:");

    if (isNativeAnchor) {
      return (
        <a
          href={href}
          target={target}
          rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
          className={className}
        >
          {text}
        </a>
      );
    }

    return (
      <Link href={href} className={className}>
        {text}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={className}>
      {text}
    </button>
  );
}

// TODO: Add loading state for async actions.
// TODO: Add optional icon support (left/right).
// TODO: Add fullWidth option for forms.
// TODO: Add disabled state for unavailable booking slots or form validation.