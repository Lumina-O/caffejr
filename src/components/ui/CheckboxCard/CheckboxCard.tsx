type CheckboxCardProps = {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  className?: string;
};

export default function CheckboxCard({
  name,
  checked,
  onChange,
  label,
  className = "",
}: CheckboxCardProps) {
  return (
    <label
      className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${className}`}
      style={{
        borderColor: "var(--color-border-soft)",
        backgroundColor: "var(--color-bg-card)",
        color: "var(--color-text-main)",
      }}
    >
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4"
      />
      {label}
    </label>
  );
}