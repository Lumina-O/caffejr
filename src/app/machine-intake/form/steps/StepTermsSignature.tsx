import type { RefObject } from "react";
import CheckboxCard from "@/components/ui/CheckboxCard/CheckboxCard";
import SignaturePad, { type SignaturePadHandle } from "@/components/ui/SignaturePad/SignaturePad";

const TERMS_TEXT = `Prisoverslag for tjek og tilbud på indleveret udstyr koster 400 kr. uden undtagelse, også hvis service fravælges. Vi foretager fejlsøgning og udarbejder et estimat, før service påbegyndes, hvis prisen overstiger det maksimale beløb, I har valgt. Ved udfyldelse af denne formular samt indlevering af udstyr accepteres dette gebyr samt udskiftning af reservedele, som vi vurderer er nødvendige for reparationen.`;

type Props = {
  acceptedTerms: boolean;
  signaturePadRef: RefObject<SignaturePadHandle | null>;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>;
  onSignatureChange: (dataUrl: string) => void;
  onClearSignature: () => void;
};

export default function StepTermsSignature({
  acceptedTerms,
  signaturePadRef,
  onChange,
  onSignatureChange,
  onClearSignature,
}: Props) {
  return (
    <div className="space-y-5">
      <div
        className="rounded-2xl border p-4 md:p-5"
        style={{
          borderColor: "var(--color-border-soft)",
          backgroundColor: "var(--color-bg-card)",
        }}
      >
        <h3 className="text-base font-semibold" style={{ color: "var(--color-text-main)" }}>
          Terms and Conditions
        </h3>

        <p className="mt-3 text-sm leading-7" style={{ color: "var(--color-text-muted)" }}>
          {TERMS_TEXT}
        </p>
      </div>

      <CheckboxCard
        name="acceptedTerms"
        checked={acceptedTerms}
        onChange={onChange}
        label="I have read and accept the terms and conditions above."
      />

      <div>
        <div className="mb-2 flex items-center justify-between gap-3">
          <label className="block text-sm font-medium" style={{ color: "var(--color-text-main)" }}>
            Draw your signature{" "}
            <span style={{ color: "var(--color-accent)" }}>*</span>
          </label>

          <button
            type="button"
            onClick={onClearSignature}
            className="rounded-full border px-4 py-2 text-xs font-semibold transition"
            style={{
              borderColor: "var(--color-border-soft)",
              backgroundColor: "var(--color-bg-surface)",
              color: "var(--color-text-main)",
            }}
          >
            Clear signature
          </button>
        </div>

        <SignaturePad ref={signaturePadRef} onChange={onSignatureChange} />

        <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          Use your finger on phone/tablet or your mouse on desktop.
        </p>
      </div>
    </div>
  );
}
