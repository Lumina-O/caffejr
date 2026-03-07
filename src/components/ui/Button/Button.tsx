type ButtonProps = {
  text: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export default function Button({
  text,
  onClick,
  type = "button",
  variant = "primary",
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-2 text-sm font-semibold transition duration-200";

  const variants = {
    primary:
      "bg-[var(--color-accent)] text-[#2b170f] hover:bg-[var(--color-accent-soft)]",
    secondary:
      "border border-[var(--color-border-card)] text-[var(--color-text-main)] hover:bg-[#3a2218]",
    ghost:
      "text-[var(--color-accent)] hover:underline",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${base} ${variants[variant]}`}
    >
      {text}
    </button>
  );
}

// TODO: Add loading state for async actions.
// TODO: Add optional icon support (left/right).
// TODO: Add fullWidth option for forms.