import Field from "@/components/ui/Field/Field";
import TextInput from "@/components/ui/TextInput/TextInput";

type Props = {
  customerName: string;
  email: string;
  phone: string;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
};

export default function StepCustomerDetails({ customerName, email, phone, onChange }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Field label="Full name" required>
        <TextInput
          name="customerName"
          placeholder="John Doe"
          value={customerName}
          onChange={onChange}
          required
        />
      </Field>

      <Field label="Email" required>
        <TextInput
          name="email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={onChange}
          required
        />
      </Field>

      <Field label="Phone number" required className="md:col-span-2">
        <TextInput
          name="phone"
          placeholder="+45 12 34 56 78"
          value={phone}
          onChange={onChange}
          required
        />
      </Field>
    </div>
  );
}
