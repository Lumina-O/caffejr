import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { Resend } from "resend";
import { requireAnyRole } from "@/lib/auth";
import { db } from "@/lib/db";

const VALID_ROLES = ["user", "staff", "admin", "super_admin"] as const;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  isActive: true,
  createdAt: true,
} as const;

export async function GET() {
  await requireAnyRole(["super_admin"]);

  const users = await db.user.findMany({
    select: userSelect,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, users });
}

export async function POST(request: NextRequest) {
  const actor = await requireAnyRole(["super_admin"]);

  try {
    const body = await request.json();
    const name = String(body?.name ?? "").trim();
    const email = String(body?.email ?? "").trim().toLowerCase();
    const role = String(body?.role ?? "user");

    if (!name || !email) {
      return NextResponse.json(
        { message: "Name and email are required." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: "Invalid email address." }, { status: 400 });
    }

    if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
      return NextResponse.json({ message: "Invalid role." }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { message: "An account with that email already exists." },
        { status: 409 }
      );
    }

    // Generate a secure random temporary password
    const tempPassword = crypto.randomBytes(10).toString("base64url").slice(0, 12);
    const passwordHash = await bcrypt.hash(tempPassword, 12);

    const user = await db.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role as "user" | "staff" | "admin" | "super_admin",
        mustChangePassword: true,
      },
      select: userSelect,
    });

    await db.auditLog.create({
      data: {
        actorId: actor.id,
        actorEmail: actor.email ?? "",
        targetId: user.id,
        targetEmail: user.email,
        action: "create",
        detail: `User invited with role: ${role}`,
      },
    });

    // Send invite email
    if (resend) {
      const senderEmail = process.env.BOOKING_SENDER_EMAIL_TEST ?? process.env.BOOKING_SENDER_EMAIL;
      if (senderEmail) {
        await resend.emails.send({
          from: senderEmail,
          to: email,
          subject: "You have been invited to Caffe Jr.",
          html: `
            <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
              <h1>Welcome to Caffe Jr., ${name}</h1>
              <p>You have been invited by <strong>${actor.email}</strong> to join the Caffe Jr. admin system.</p>
              <p>Your temporary login credentials:</p>
              <ul>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Temporary password:</strong> <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;">${tempPassword}</code></li>
              </ul>
              <p>You will be asked to set a new password when you first log in.</p>
              <p style="margin-top:24px;color:#6b7280;">If you did not expect this invitation, you can ignore this email.</p>
            </div>
          `,
          text: `Welcome to Caffe Jr., ${name}.\n\nYou have been invited by ${actor.email}.\n\nEmail: ${email}\nTemporary password: ${tempPassword}\n\nYou will be asked to set a new password on first login.`,
        });
      }
    }

    return NextResponse.json({ success: true, user }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json({ message: "Failed to create user." }, { status: 500 });
  }
}
