"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export function PdfViewer({ intakeId }: { intakeId: string }) {
  const src = `/api/admin/intakes/${intakeId}/pdf?inline=true`;

  return (
    <embed
      src={src}
      type="application/pdf"
      className="h-[800px] w-full rounded-b-2xl"
    />
  );
}

export function RegeneratePdfButton({ intakeId }: { intakeId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  async function handleRegenerate() {
    setError("");
    const res = await fetch(`/api/admin/intakes/${intakeId}/regenerate-pdf`, {
      method: "POST",
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message ?? "Regeneration failed.");
      return;
    }

    startTransition(() => router.refresh());
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={handleRegenerate}
        className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50"
      >
        {isPending ? "Regenerating…" : "Regenerate PDF"}
      </button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function IntakeEditFields({
  intakeId,
  initialPrice,
  initialEngineerNotes,
}: {
  intakeId: string;
  initialPrice: number | null;
  initialEngineerNotes: string | null;
}) {
  const router = useRouter();
  const [, startTransition] = useTransition();

  const [price, setPrice] = useState(initialPrice !== null ? String(initialPrice) : "");
  const [notes, setNotes] = useState(initialEngineerNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/intakes/${intakeId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          price: price === "" ? null : Number(price),
          engineerNotes: notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "Failed to save.");
        return;
      }
      setSaved(true);
      startTransition(() => router.refresh());
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Price (DKK)
        </label>
        <input
          type="number"
          min="0"
          step="1"
          placeholder="Leave empty if not yet set"
          value={price}
          onChange={(e) => { setPrice(e.target.value); setSaved(false); }}
          className="mt-1 w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Engineer notes
        </label>
        <textarea
          rows={4}
          placeholder="Internal notes about the repair…"
          value={notes}
          onChange={(e) => { setNotes(e.target.value); setSaved(false); }}
          className="mt-1 w-full resize-y rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm text-green-600">Saved</span>}
      </div>
    </form>
  );
}

export function DeleteIntakeButton({ intakeId }: { intakeId: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    setError("");
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/intakes/${intakeId}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? "Delete failed.");
        setConfirming(false);
        return;
      }
      router.push("/admin/reports");
    } finally {
      setDeleting(false);
    }
  }

  if (!confirming) {
    return (
      <div className="flex flex-col items-end gap-1">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="rounded-xl border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
        >
          Delete intake
        </button>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <p className="text-sm text-neutral-700">
        Delete this intake and all stored files? This cannot be undone.
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={deleting}
          onClick={() => setConfirming(false)}
          className="rounded-xl border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={deleting}
          onClick={handleDelete}
          className="rounded-xl bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Yes, delete"}
        </button>
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
