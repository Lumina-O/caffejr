import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  await requireRole("admin");

  const intakes = await db.machineIntake.findMany({
    select: {
      referenceId: true,
      customerName: true,
      email: true,
      phone: true,
      brand: true,
      model: true,
      machineType: true,
      issueSummary: true,
      maxRepairAmount: true,
      addCleaningService: true,
      photoCount: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const headers = [
    "Reference ID",
    "Customer Name",
    "Email",
    "Phone",
    "Brand",
    "Model",
    "Machine Type",
    "Issue Summary",
    "Max Repair Amount (kr)",
    "Cleaning Service",
    "Photo Count",
    "Status",
    "Submitted At",
  ];

  function escapeCsv(value: string | number | boolean) {
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  const rows = intakes.map((i) =>
    [
      i.referenceId,
      i.customerName,
      i.email,
      i.phone,
      i.brand,
      i.model,
      i.machineType,
      i.issueSummary.replace(/\n/g, " "),
      i.maxRepairAmount,
      i.addCleaningService ? "Yes" : "No",
      i.photoCount,
      i.status,
      i.createdAt.toISOString(),
    ]
      .map(escapeCsv)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="machine-intakes-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
