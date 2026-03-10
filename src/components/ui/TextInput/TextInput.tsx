import type { InputHTMLAttributes } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement>;

export default function TextInput(props: TextInputProps) {
  return (
    <input
      {...props}
      className="w-full rounded-2xl border px-4 py-3 text-sm outline-none transition placeholder:text-[var(--color-text-muted)] focus:ring-2"
      style={{
        borderColor: "var(--color-border-soft)",
        backgroundColor: "var(--color-bg-card)",
        color: "var(--color-text-main)",
        boxShadow: "none",
      }}
    />
  );
}