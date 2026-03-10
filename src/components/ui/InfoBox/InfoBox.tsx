type InfoBoxProps = {
  children: React.ReactNode;
};

export default function InfoBox({ children }: InfoBoxProps) {
  return (
    <div
      className="rounded-2xl border px-4 py-4 text-sm"
      style={{
        borderColor: "var(--color-border-soft)",
        backgroundColor: "var(--color-bg-card)",
        color: "var(--color-text-muted)",
      }}
    >
      {children}
    </div>
  );
}