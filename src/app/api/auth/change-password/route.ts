import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getSession } from "@/lib/session";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const session = await getSession();

  if (!session.userId) {
    return NextResponse.json({ message: "Not authenticated." }, { status: 401 });
  }

  try {
    const body = await request.json();
    const newPassword = String(body?.newPassword ?? "");

    if (newPassword.length < 8 || newPassword.length > 72) {
      return NextResponse.json(
        { message: "Password must be between 8 and 72 characters." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.user.update({
      where: { id: session.userId },
      data: { passwordHash, mustChangePassword: false },
    });

    session.mustChangePassword = false;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ message: "Failed to change password." }, { status: 500 });
  }
}
