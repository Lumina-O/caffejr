import Field from "@/components/ui/Field/Field";

const ISSUE_CATEGORY_OPTIONS = [
  "Behøv for en almindelig service",
  "Taber vand fra gruppe",
  "Taber vand ind i maskine",
  "Er kalket til og ønsker fuld afkalkning ca. 5-6000 kr",
  "Varmer ikke længere",
  "Slå hpfi hjemme",
  "Taber damp",
  "Ingen damp",
  "Intet pumpe tryk",
  "Tænder ikke",
  "Intet eller lidt vand kommer ud",
  "Udstyr larmer",
  "Fejlkode på display",
  "Vil ikke kværne",
  "Siver ind fra maskine",
  "Andet",
];

type Props = {
  issueCategories: string[];
  issueSummary: string;
  onCategoryToggle: (category: string, selected: boolean) => void;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
};

export default function StepIssueDetails({
  issueCategories,
  issueSummary,
  onCategoryToggle,
  onChange,
}: Props) {
  return (
    <div className="grid gap-4">
      <Field label="Issue category" required>
        <div className="space-y-3">
          {issueCategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {issueCategories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    borderColor: "var(--color-accent)",
                    color: "var(--color-bg-main)",
                  }}
                >
                  {cat}
                  <button
                    type="button"
                    onClick={() => onCategoryToggle(cat, false)}
                    className="flex-shrink-0 rounded-full leading-none hover:opacity-70"
                    aria-label={`Remove ${cat}`}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {ISSUE_CATEGORY_OPTIONS.filter((opt) => !issueCategories.includes(opt)).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => onCategoryToggle(opt, true)}
                className="inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-medium transition hover:opacity-80"
                style={{
                  borderColor: "var(--color-border-soft)",
                  backgroundColor: "var(--color-bg-card)",
                  color: "var(--color-text-main)",
                }}
              >
                + {opt}
              </button>
            ))}
          </div>
        </div>
      </Field>

      <Field label="Extra details">
        <textarea
          name="issueSummary"
          placeholder="Add extra details if needed."
          value={issueSummary}
          onChange={onChange}
          className="min-h-[140px] w-full resize-y rounded-2xl border px-4 py-3 text-sm outline-none transition focus:ring-2"
          style={{
            borderColor: "var(--color-border-soft)",
            backgroundColor: "var(--color-bg-card)",
            color: "var(--color-text-main)",
          }}
        />
      </Field>
    </div>
  );
}
