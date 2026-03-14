import { NextRequest, NextResponse } from "next/server";

// TODO: Replace this mock login with real database lookup, password hashing, and secure session handling.
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

    // TODO: Replace with real user validation from your database.
    const mockUser = {
      id: "1",
      email: "owen.j.de.guzman@gmail.com",
      password: "admin",
      role: "super_admin",
    };

    if (email !== mockUser.email || password !== mockUser.password) {
      return NextResponse.json(
        { message: "Invalid email or password." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      redirectTo: "/admin",
    });

    response.cookies.set("user_role", mockUser.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
    });

    response.cookies.set("user_email", mockUser.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to process login." },
      { status: 500 }
    );
  }
}