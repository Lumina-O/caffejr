import Field from "@/components/ui/Field/Field";
import TextInput from "@/components/ui/TextInput/TextInput";

const BRAND_OPTIONS = [
  "Animo", "Astoria", "Bezzera", "Brasilia", "Carimali", "Casadio", "Ceado",
  "Cimbali", "Dalla Corte", "ECM", "Elektra", "Eureka", "Faema", "Fiorenzato",
  "Fracino", "Futurmat", "Gaggia", "Izzo", "Isomac", "La Piccola", "Lelit",
  "Marzocco", "Magister", "Nuova Simonelli", "Obel", "Profitec", "Quick Mill",
  "Rancilio", "Sage", "Rocket", "Spinel", "Promac", "Vibiemme", "Wega",
];

type Props = {
  brand: string;
  model: string;
  machineType: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
};

export default function StepMachineDetails({ brand, model, machineType, onChange }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Brand" required>
        <div>
          <TextInput
            name="brand"
            placeholder="Search or type brand"
            value={brand}
            onChange={onChange}
            list="machine-brand-options"
            required
          />
          <datalist id="machine-brand-options">
            {BRAND_OPTIONS.map((b) => (
              <option key={b} value={b} />
            ))}
          </datalist>
        </div>
      </Field>

      <Field label="Model" required>
        <TextInput
          name="model"
          placeholder="Magnifica S"
          value={model}
          onChange={onChange}
          required
        />
      </Field>

      <Field label="Machine type" required className="md:col-span-2">
        <div className="relative">
          <select
            name="machineType"
            value={machineType}
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
            <option value="">Select machine type</option>
            <option value="espresso">Espresso machine</option>
            <option value="grinder">Grinder</option>
            <option value="roaster">Coffee Roaster</option>
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
    </div>
  );
}
