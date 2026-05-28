import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { Resend } from "resend";
import { db } from "@/lib/db";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json({ message: "Email is required." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { email } });

    // Always return success to prevent email enumeration
    if (!user || !user.isActive) {
      return NextResponse.json({ success: true });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + TOKEN_EXPIRY_MS);

    await db.user.update({
      where: { id: user.id },
      data: { passwordResetToken: token, passwordResetExpiry: expiry },
    });

    const senderEmail = process.env.BOOKING_SENDER_EMAIL ?? "noreply@caffejr.dk";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl && process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_APP_URL is not set");
    }
    const resetLink = `${appUrl ?? "http://localhost:3000"}/reset-password?token=${token}`;

    if (resend) {
      await resend.emails.send({
        from: senderEmail,
        to: email,
        subject: "Reset your Caffe Jr. password",
        html: `
          <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
            <h1>Reset your password</h1>
            <p>Hi ${user.name},</p>
            <p>We received a request to reset your password for the Caffe Jr. admin system.</p>
            <p>Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
            <p style="margin: 24px 0;">
              <a href="${resetLink}" style="background:#111827;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Reset password</a>
            </p>
            <p style="color:#6b7280;font-size:13px;">If you didn't request this, you can safely ignore this email. Your password will not change.</p>
            <p style="color:#6b7280;font-size:13px;">Or copy this link: ${resetLink}</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Something went wrong." }, { status: 500 });
  }
}
