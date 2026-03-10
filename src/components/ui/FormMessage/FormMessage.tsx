type FormMessageProps = {
  message?: string;
};

export default function FormMessage({ message }: FormMessageProps) {
  if (!message) return null;

  return (
    <p
      className="rounded-2xl border px-4 py-3 text-sm"
      style={{
        borderColor: "var(--color-border-soft)",
        backgroundColor: "var(--color-bg-surface)",
        color: "var(--color-text-main)",
      }}
    >
      {message}
    </p>
  );
}