import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateMachineIntakePdf } from "@/lib/generateMachineReportPdf";

export const runtime = "nodejs";

function formatDuration(ms: number) {
  if (!ms || ms <= 0) return "0 seconds";
  const totalSeconds = Math.round(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes <= 0) return `${seconds} second${seconds === 1 ? "" : "s"}`;
  return `${minutes} min ${seconds} sec`;
}

function formatSubmittedAt(date: Date) {
  return new Intl.DateTimeFormat("da-DK", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: "Europe/Copenhagen",
  }).format(date);
}

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole("admin");
  const { id } = await params;

  const intake = await db.machineIntake.findUnique({ where: { id } });
  if (!intake) {
    return NextResponse.json({ message: "Intake not found." }, { status: 404 });
  }

  const blobToken = process.env.CAFFEJR_BLOB_READ_WRITE_TOKEN;

  // Download stored photos from Vercel Blob
  const photos = await Promise.all(
    (intake.photoUrls ?? []).map(async (url, index) => {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${blobToken}` },
      });
      const bytes = Buffer.from(await res.arrayBuffer());
      const mimeType = res.headers.get("content-type") ?? "image/jpeg";
      return { name: `photo-${index + 1}`, mimeType, bytes };
    })
  );

  const pdfBuffer = await generateMachineIntakePdf({
    customerName: intake.customerName,
    email: intake.email,
    phone: intake.phone,
    brand: intake.brand,
    model: intake.model,
    machineType: intake.machineType,
    issueSummary: intake.issueSummary,
    maxRepairAmount: intake.maxRepairAmount,
    addCleaningService: intake.addCleaningService,
    acceptedTerms: intake.acceptedTerms,
    submittedAtFormatted: formatSubmittedAt(intake.createdAt),
    timeSpentFormatted: formatDuration(intake.timeSpentMs),
    photoCount: photos.length,
    signatureDataUrl: intake.signatureDataUrl ?? "",
    photos,
  });

  const safeName = intake.customerName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const { url: pdfUrl } = await put(
    `intakes/${intake.referenceId}-${safeName || "customer"}.pdf`,
    pdfBuffer,
    { access: "private", contentType: "application/pdf", token: blobToken, allowOverwrite: true }
  );

  await db.machineIntake.update({
    where: { id },
    data: { pdfUrl },
  });

  return NextResponse.json({ success: true });
}
