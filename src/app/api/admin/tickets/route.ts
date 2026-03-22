import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  await requireRole("admin");

  const { searchParams } = new URL(request.url);
  const month = searchParams.get("month"); // expected: "YYYY-MM"

  if (!month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json(
      { message: "Invalid or missing month parameter. Expected format: YYYY-MM" },
      { status: 400 }
    );
  }

  const [year, monthNum] = month.split("-").map(Number);
  const startOfMonth = new Date(Date.UTC(year, monthNum - 1, 1));
  const endOfMonth = new Date(Date.UTC(year, monthNum, 0, 23, 59, 59, 999));

  const todayKey = new Date().toISOString().slice(0, 10);

  // Intakes that overlap the viewed month:
  // - created this month, OR
  // - active (no closedAt) and started before end of month, OR
  // - closed within or after this month's start
  const intakeRecords = await db.machineIntake.findMany({
    where: {
      OR: [
        { createdAt: { gte: startOfMonth, lte: endOfMonth } },
        {
          status: { in: ["received", "in_progress"] },
          createdAt: { lte: endOfMonth },
        },
        {
          closedAt: { gte: startOfMonth },
          createdAt: { lte: endOfMonth },
        },
      ],
    },
    select: {
      id: true,
      referenceId: true,
      customerName: true,
      machineType: true,
      status: true,
      createdAt: true,
      closedAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const intakes = intakeRecords.map((i) => {
    const startDate = i.createdAt.toISOString().slice(0, 10);
    const isActive = i.status === "received" || i.status === "in_progress";
    const endDate = isActive
      ? todayKey
      : i.closedAt
        ? i.closedAt.toISOString().slice(0, 10)
        : startDate;
    return {
      id: i.id,
      referenceId: i.referenceId,
      customerName: i.customerName,
      machineType: i.machineType,
      status: i.status,
      startDate,
      endDate,
    };
  });

  return NextResponse.json({ success: true, intakes });
}
