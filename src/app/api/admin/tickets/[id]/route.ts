import { NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_STATUSES = ["pending", "confirmed", "cancelled", "completed"] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await requireRole("admin");
  const { id } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { message: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    const booking = await db.booking.findUnique({ where: { id } });
    if (!booking) {
      return NextResponse.json({ message: "Ticket not found." }, { status: 404 });
    }

    const updated = await db.booking.update({
      where: { id },
      data: { status },
      select: {
        id: true,
        referenceId: true,
        name: true,
        phone: true,
        machineType: true,
        preferredDate: true,
        status: true,
      },
    });

    return NextResponse.json({ success: true, booking: updated });
  } catch (error) {
    console.error("PATCH /api/admin/tickets/[id] error:", error);
    return NextResponse.json({ message: "Failed to update ticket." }, { status: 500 });
  }
}
