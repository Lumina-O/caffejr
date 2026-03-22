import { NextRequest, NextResponse } from "next/server";
import { requireAnyRole } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_ROLES = ["user", "staff", "admin", "super_admin"] as const;

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
} as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const actor = await requireAnyRole(["super_admin"]);
  const { id } = await params;

  if (id === actor.id) {
    return NextResponse.json(
      { message: "You cannot modify your own account." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();

    const target = await db.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }

    const updates: Record<string, unknown> = {};
    const auditDetails: string[] = [];

    if (body.role !== undefined) {
      if (!VALID_ROLES.includes(body.role as (typeof VALID_ROLES)[number])) {
        return NextResponse.json({ message: "Invalid role." }, { status: 400 });
      }
      if (body.role !== target.role) {
        updates.role = body.role;
        auditDetails.push(`role: ${target.role} → ${body.role}`);
      }
    }

    if (body.isActive !== undefined) {
      const newStatus = Boolean(body.isActive);
      if (newStatus !== target.isActive) {
        updates.isActive = newStatus;
        auditDetails.push(
          `status: ${target.isActive ? "active" : "inactive"} → ${newStatus ? "active" : "inactive"}`
        );
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ message: "No changes to apply." }, { status: 400 });
    }

    const updated = await db.user.update({
      where: { id },
      data: updates,
      select: userSelect,
    });

    await db.auditLog.create({
      data: {
        actorId: actor.id,
        actorEmail: actor.email ?? "",
        targetId: target.id,
        targetEmail: target.email,
        action: updates.role ? "role_change" : "status_change",
        detail: auditDetails.join(", "),
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id] error:", error);
    return NextResponse.json(
      { message: "Failed to update user." },
      { status: 500 }
    );
  }
}
