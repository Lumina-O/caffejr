import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { sessionOptions, type SessionData } from "@/lib/session";
import type { UserRole } from "@/types/auth";

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

// bcrypt silently truncates at 72 bytes — cap input to prevent DoS via intentionally long strings
const MAX_PASSWORD_LENGTH = 72;
const MAX_EMAIL_LENGTH = 254; // RFC 5321 maximum

// Dummy hash used when user is not found, so response time matches a real bcrypt.compare
// and attackers cannot enumerate valid emails via timing differences
const DUMMY_HASH =
  "$2b$12$invalidhashusedfortimingprotectiononly.............";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = String(body?.email || "").trim().toLowerCase();
    const password = String(body?.password || "");
    const rememberMe = Boolean(body?.rememberMe);

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      );
    }

    // Input length limits
    if (email.length > MAX_EMAIL_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Basic email format check
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const user = await db.user.findUnique({ where: { email } });

    // Run dummy bcrypt compare even when user not found so response time is
    // identical whether the email exists or not (prevents timing-based enumeration)
    if (!user || !user.isActive) {
      await bcrypt.compare(password, DUMMY_HASH);

      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    // Check if account is currently locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const minutesLeft = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / 60000
      );

      return NextResponse.json(
        {
          message: `Account is temporarily locked. Try again in ${minutesLeft} minute${minutesLeft === 1 ? "" : "s"}.`,
        },
        { status: 429 }
      );
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      const newAttempts = user.loginAttempts + 1;
      const shouldLock = newAttempts >= MAX_ATTEMPTS;

      await db.user.update({
        where: { id: user.id },
        data: {
          loginAttempts: newAttempts,
          lockedUntil: shouldLock
            ? new Date(Date.now() + LOCKOUT_DURATION_MS)
            : null,
        },
      });

      if (shouldLock) {
        return NextResponse.json(
          {
            message:
              "Too many failed attempts. Account is locked for 15 minutes.",
          },
          { status: 429 }
        );
      }

      const attemptsLeft = MAX_ATTEMPTS - newAttempts;

      return NextResponse.json(
        {
          message: `Invalid email or password. ${attemptsLeft} attempt${attemptsLeft === 1 ? "" : "s"} remaining.`,
        },
        { status: 401 }
      );
    }

    // Successful login — reset lockout state
    await db.user.update({
      where: { id: user.id },
      data: { loginAttempts: 0, lockedUntil: null },
    });

    const maxAge = rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8;

    const cookieStore = await cookies();
    const session = await getIronSession<SessionData>(cookieStore, {
      ...sessionOptions,
      cookieOptions: { ...sessionOptions.cookieOptions, maxAge },
    });

    session.userId = user.id;
    session.email = user.email;
    session.name = user.name;
    session.role = user.role as UserRole;

    await session.save();

    return NextResponse.json({ success: true, redirectTo: "/admin" });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { message: "Unable to process login." },
      { status: 500 }
    );
  }
}