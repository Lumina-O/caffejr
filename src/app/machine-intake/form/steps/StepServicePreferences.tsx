import CheckboxCard from "@/components/ui/CheckboxCard/CheckboxCard";
import Field from "@/components/ui/Field/Field";
import InfoBox from "@/components/ui/InfoBox/InfoBox";

const MAX_REPAIR_AMOUNT_OPTIONS = [
  "1500", "2000", "2500", "3000", "4000", "5000", "7500", "10000",
];

type Props = {
  maxRepairAmount: string;
  addCleaningService: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
};

export default function StepServicePreferences({ maxRepairAmount, addCleaningService, onChange }: Props) {
  return (
    <div className="space-y-4">
      <InfoBox>
        We will contact you before continuing if the repair exceeds your chosen amount.
      </InfoBox>

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Max amount before we contact you" required>
          <div className="relative">
            <select
              name="maxRepairAmount"
              value={maxRepairAmount}
              onChange={onChange}
              className="w-full appearance-none rounded-2xl border px-4 py-3 pr-12 text-sm leading-6 outline-none transition focus:ring-2"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "none",
                appearance: "none",
                borderColor: "var(--color-border-soft)",
                backgroundColor: "var(--color-bg-card)",
                color: "var(--color-text-main)",
              }}
              required
            >
              {MAX_REPAIR_AMOUNT_OPTIONS.map((amount) => (
                <option key={amount} value={amount}>
                  {amount} kr
                </option>
              ))}
            </select>

            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              ▼
            </span>
          </div>
        </Field>

        <div className="flex items-end">
          <CheckboxCard
            name="addCleaningService"
            checked={addCleaningService}
            onChange={onChange}
            label="Add coffee machine cleaning service (+600 kr)"
          />
        </div>
      </div>
    </div>
  );
}
