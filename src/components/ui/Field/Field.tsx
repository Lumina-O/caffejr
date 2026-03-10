type FieldProps = {
  label: string;
  required?: boolean;
  hint?: string;
  className?: string;
  children: React.ReactNode;
};

export default function Field({
  label,
  required = false,
  hint,
  className = "",
  children,
}: FieldProps) {
  return (
    <div className={className}>
      <label
        className="mb-2 block text-sm font-medium"
        style={{ color: "var(--color-text-main)" }}
      >
        {label}
        {required ? <span style={{ color: "var(--color-accent)" }}> *</span> : null}
      </label>

      {children}

      {hint ? (
        <p
          className="mt-2 text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
}