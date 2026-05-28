import { NextRequest, NextResponse } from "next/server";
import { del } from "@vercel/blob";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_STATUSES = ["received", "in_progress", "completed", "rejected"] as const;

function formatLogValue(field: string, value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (field === "price") return `${value} kr`;
  return String(value);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const actor = await requireRole("admin");
  const { id } = await params;

  try {
    const body = await request.json();
    const updates: Record<string, unknown> = {};

    if (body.status !== undefined) {
      if (!VALID_STATUSES.includes(body.status)) {
        return NextResponse.json({ message: "Invalid status." }, { status: 400 });
      }
      updates.status = body.status;
      if (body.status === "completed" || body.status === "rejected") {
        updates.closedAt = new Date();
      } else {
        updates.closedAt = null;
      }
    }

    if (body.price !== undefined) {
      updates.price = body.price === null ? null : Number(body.price);
    }

    if (body.engineerNotes !== undefined) {
      updates.engineerNotes = body.engineerNotes === "" ? null : String(body.engineerNotes);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No changes to apply." }, { status: 400 });
    }

    const current = await db.machineIntake.findUnique({
      where: { id },
      select: { referenceId: true, status: true, price: true, engineerNotes: true, closedAt: true },
    });

    if (!current) {
      return NextResponse.json({ message: "Intake not found." }, { status: 404 });
    }

    const updated = await db.machineIntake.update({
      where: { id },
      data: updates,
    });

    const logEntries: {
      intakeId: string;
      referenceId: string;
      actorEmail: string;
      action: string;
      field: string;
      oldValue: string | null;
      newValue: string | null;
    }[] = [];

    for (const field of (Object.keys(updates) as Array<"status" | "price" | "engineerNotes" | "closedAt">).filter(f => f !== "closedAt")) {
      const oldRaw = current[field] ?? null;
      const newRaw = updates[field] ?? null;
      const oldValue = formatLogValue(field, oldRaw);
      const newValue = formatLogValue(field, newRaw);
      if (oldValue !== newValue) {
        logEntries.push({
          intakeId: id,
          referenceId: current.referenceId,
          actorEmail: actor.email ?? "",
          action: "updated",
          field,
          oldValue,
          newValue,
        });
      }
    }

    if (logEntries.length > 0) {
      await db.intakeChangeLog.createMany({ data: logEntries });
    }

    return NextResponse.json({ success: true, intake: updated });
  } catch (error) {
    console.error("PATCH /api/admin/intakes/[id] error:", error);
    return NextResponse.json({ message: "Failed to update intake." }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const actor = await requireRole("admin");
  const { id } = await params;

  const intake = await db.machineIntake.findUnique({
    where: { id },
    select: { referenceId: true, pdfUrl: true, photoUrls: true },
  });

  if (!intake) {
    return NextResponse.json({ message: "Intake not found." }, { status: 404 });
  }

  // Log deletion before removing the record
  await db.intakeChangeLog.create({
    data: {
      intakeId: id,
      referenceId: intake.referenceId,
      actorEmail: actor.email,
      action: "deleted",
    },
  });

  const blobToken = process.env.CAFFEJR_BLOB_READ_WRITE_TOKEN;
  const urlsToDelete = [
    ...(intake.pdfUrl ? [intake.pdfUrl] : []),
    ...(intake.photoUrls ?? []),
  ];

  if (urlsToDelete.length > 0 && blobToken) {
    try {
      await del(urlsToDelete, { token: blobToken });
    } catch (err) {
      console.error("Blob delete error:", err);
    }
  }

  await db.machineIntake.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
