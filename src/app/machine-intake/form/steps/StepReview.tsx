function formatMachineType(value: string) {
  switch (value) {
    case "espresso": return "Espresso machine";
    case "grinder": return "Grinder";
    case "roaster": return "Coffee Roaster";
    default: return value;
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

type ReviewGroupProps = { title: string; children: React.ReactNode };

function ReviewGroup({ title, children }: ReviewGroupProps) {
  return (
    <div
      className="rounded-2xl border p-4 md:p-5"
      style={{
        borderColor: "var(--color-border-soft)",
        backgroundColor: "var(--color-bg-card)",
      }}
    >
      <h3 className="text-base font-semibold" style={{ color: "var(--color-text-main)" }}>
        {title}
      </h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function ReviewItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 md:grid-cols-[220px_1fr] md:gap-4">
      <p className="text-sm font-medium" style={{ color: "var(--color-text-main)" }}>
        {label}
      </p>
      <p className="break-words text-sm" style={{ color: "var(--color-text-muted)" }}>
        {value?.trim() ? value : "Not provided"}
      </p>
    </div>
  );
}

type Props = {
  customerName: string;
  email: string;
  phone: string;
  brand: string;
  model: string;
  machineType: string;
  issueCategories: string[];
  issueSummary: string;
  maxRepairAmount: string;
  addCleaningService: boolean;
  acceptedTerms: boolean;
  signatureDataUrl: string;
  machinePhotos: File[];
};

export default function StepReview({
  customerName,
  email,
  phone,
  brand,
  model,
  machineType,
  issueCategories,
  issueSummary,
  maxRepairAmount,
  addCleaningService,
  acceptedTerms,
  signatureDataUrl,
  machinePhotos,
}: Props) {
  return (
    <div className="space-y-6">
      <ReviewGroup title="Customer Details">
        <ReviewItem label="Full name" value={customerName} />
        <ReviewItem label="Email" value={email} />
        <ReviewItem label="Phone" value={phone} />
      </ReviewGroup>

      <ReviewGroup title="Machine Details">
        <ReviewItem label="Brand" value={brand} />
        <ReviewItem label="Model" value={model} />
        <ReviewItem label="Machine type" value={formatMachineType(machineType)} />
      </ReviewGroup>

      <ReviewGroup title="Issue Details">
        <ReviewItem
          label="Issue categories"
          value={issueCategories.length > 0 ? issueCategories.join(", ") : ""}
        />
        <ReviewItem label="Extra details" value={issueSummary} />
      </ReviewGroup>

      <ReviewGroup title="Photos">
        <ReviewItem
          label="Uploaded photos"
          value={machinePhotos.length > 0 ? `${machinePhotos.length} file(s) selected` : "No photos uploaded"}
        />

        {machinePhotos.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-2 md:grid-cols-3">
            {machinePhotos.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="rounded-2xl border p-3"
                style={{
                  borderColor: "var(--color-border-soft)",
                  backgroundColor: "var(--color-bg-surface)",
                }}
              >
                <p className="truncate text-xs font-medium" style={{ color: "var(--color-text-main)" }}>
                  {file.name}
                </p>
                <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {formatFileSize(file.size)}
                </p>
              </div>
            ))}
          </div>
        )}
      </ReviewGroup>

      <ReviewGroup title="Service Preferences">
        <ReviewItem label="Max amount before contact" value={`${maxRepairAmount} kr`} />
        <ReviewItem label="Contact if above limit" value="Yes" />
        <ReviewItem label="Cleaning service (+600 kr)" value={addCleaningService ? "Yes" : "No"} />
      </ReviewGroup>

      <ReviewGroup title="Terms & Signature">
        <ReviewItem label="Accepted terms" value={acceptedTerms ? "Yes" : "No"} />
        <ReviewItem label="Drawn signature" value={signatureDataUrl ? "Added" : "Missing"} />
      </ReviewGroup>
    </div>
  );
}
