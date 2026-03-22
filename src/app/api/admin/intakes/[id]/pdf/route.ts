import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole("admin");
  const { id } = await params;
  const inline = new URL(request.url).searchParams.get("inline") === "true";

  const intake = await db.machineIntake.findUnique({
    where: { id },
    select: {
      referenceId: true,
      customerName: true,
      pdfUrl: true,
    },
  });

  if (!intake) {
    return NextResponse.json({ message: "Intake not found." }, { status: 404 });
  }

  if (!intake.pdfUrl) {
    return NextResponse.json(
      { message: "No PDF stored for this intake." },
      { status: 404 }
    );
  }

  const token = process.env.CAFFEJR_BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json({ message: "Blob token not configured." }, { status: 500 });
  }

  const blobResponse = await fetch(intake.pdfUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!blobResponse.ok) {
    return NextResponse.json({ message: "Failed to fetch PDF." }, { status: 502 });
  }

  const safeName = intake.customerName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const filename = `intake-${intake.referenceId}-${safeName || "customer"}.pdf`;

  const responseHeaders: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Content-Disposition": `${inline ? "inline" : "attachment"}; filename="${filename}"`,
  };

  const contentLength = blobResponse.headers.get("content-length");
  if (contentLength) responseHeaders["Content-Length"] = contentLength;

  return new NextResponse(blobResponse.body, { headers: responseHeaders });
}
