import Link from "next/link";
import { notFound } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  PdfViewer,
  RegeneratePdfButton,
  IntakeEditFields,
  DeleteIntakeButton,
} from "@/components/admin/IntakeDetailActions";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDuration(ms: number) {
  if (!ms || ms <= 0) return "—";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds}s`;
  return `${minutes}m ${seconds}s`;
}

function formatTaskDuration(from: Date, to: Date) {
  const diffMs = to.getTime() - from.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days === 0) return hours <= 0 ? "Less than an hour" : `${hours}h`;
  if (hours === 0) return `${days}d`;
  return `${days}d ${hours}h`;
}

function formatMachineType(value: string) {
  const map: Record<string, string> = {
    espresso: "Espresso machine",
    "bean-to-cup": "Bean to cup",
    capsule: "Capsule",
    filter: "Filter coffee",
    commercial: "Commercial machine",
  };
  return map[value] ?? value;
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "completed": return "bg-neutral-100 text-neutral-700";
    case "in_progress": return "bg-blue-100 text-blue-700";
    case "received": return "bg-yellow-100 text-yellow-700";
    case "rejected": return "bg-red-100 text-red-700";
    default: return "bg-neutral-100 text-neutral-700";
  }
}

function Field({ label, value }: { label: string; value: string | number }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{label}</dt>
      <dd className="mt-1 text-sm text-neutral-900">{value}</dd>
    </div>
  );
}

export default async function IntakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("admin");
  const { id } = await params;

  const [intake, changelog] = await Promise.all([
    db.machineIntake.findUnique({ where: { id } }),
    db.intakeChangeLog.findMany({
      where: { intakeId: id },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!intake) notFound();

  const pdfBase = `/api/admin/intakes/${id}/pdf`;

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/admin/reports"
            className="text-sm text-neutral-500 hover:text-neutral-700"
          >
            ← Back to reports
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-neutral-900">
            {intake.referenceId}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Opened: {formatDate(intake.createdAt)}
          </p>
          {intake.closedAt && (
            <p className="mt-0.5 text-sm text-neutral-500">
              Closed: {formatDate(intake.closedAt)}
              <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                {formatTaskDuration(intake.createdAt, intake.closedAt)}
              </span>
            </p>
          )}
        </div>

        <div className="flex flex-col items-end gap-3">
          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(intake.status)}`}
          >
            {intake.status.replace("_", " ")}
          </span>

          <div className="flex flex-wrap items-center justify-end gap-2">
            <RegeneratePdfButton intakeId={id} />
            {intake.pdfUrl && (
              <a
                href={pdfBase}
                className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
              >
                Download PDF
              </a>
            )}
            <DeleteIntakeButton intakeId={id} />
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Customer */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Customer
          </h2>
          <dl className="space-y-3">
            <Field label="Full name" value={intake.customerName} />
            <Field label="Email" value={intake.email} />
            <Field label="Phone" value={intake.phone} />
          </dl>
        </div>

        {/* Machine */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Machine
          </h2>
          <dl className="space-y-3">
            <Field label="Brand" value={intake.brand} />
            <Field label="Model" value={intake.model} />
            <Field label="Type" value={formatMachineType(intake.machineType)} />
          </dl>
        </div>

        {/* Issue */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Issue
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Summary
              </dt>
              <dd className="mt-1 whitespace-pre-wrap text-sm text-neutral-900">
                {intake.issueSummary}
              </dd>
            </div>
          </dl>
        </div>

        {/* Service & submission */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Service &amp; Submission
          </h2>
          <dl className="space-y-3">
            <Field label="Max repair amount" value={`${intake.maxRepairAmount} kr`} />
            <Field label="Cleaning service" value={intake.addCleaningService ? "Yes (+600 kr)" : "No"} />
            <Field label="Photos uploaded" value={intake.photoCount} />
            <Field label="Time spent on form" value={formatDuration(intake.timeSpentMs)} />
            <Field label="Terms accepted" value={intake.acceptedTerms ? "Yes" : "No"} />
          </dl>
        </div>
      </div>

      {/* Admin fields: price + engineer notes */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Admin
        </h2>
        <IntakeEditFields
          intakeId={id}
          initialPrice={intake.price}
          initialEngineerNotes={intake.engineerNotes}
        />
      </div>

      {/* Change log */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Change log</h2>
          <p className="mt-1 text-sm text-neutral-500">All updates made to this intake.</p>
        </div>
        {changelog.length === 0 ? (
          <p className="px-5 py-6 text-sm text-neutral-500">No changes recorded yet.</p>
        ) : (
          <ol className="divide-y divide-neutral-100">
            {changelog.map((entry) => (
              <li key={entry.id} className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-start sm:gap-6">
                <time className="shrink-0 text-xs text-neutral-400 sm:w-44">
                  {new Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(entry.createdAt)}
                </time>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-900">
                    {entry.field === "engineerNotes"
                      ? "Engineer notes"
                      : entry.field.charAt(0).toUpperCase() + entry.field.slice(1)}{" "}
                    updated
                  </p>
                  <p className="mt-0.5 text-sm text-neutral-600">
                    <span className="line-through text-neutral-400">{entry.oldValue ?? "—"}</span>
                    {" → "}
                    <span>{entry.newValue ?? "—"}</span>
                  </p>
                </div>
                <span className="shrink-0 text-xs text-neutral-400">{entry.actorEmail}</span>
              </li>
            ))}
          </ol>
        )}
      </div>

      {/* Inline PDF viewer */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">PDF Report</h2>
        </div>
        {intake.pdfUrl ? (
          <PdfViewer intakeId={id} />
        ) : (
          <div className="p-6 text-center text-sm text-neutral-500">
            No PDF stored. Use &quot;Regenerate PDF&quot; to create one from the stored data.
          </div>
        )}
      </div>
    </section>
  );
}
