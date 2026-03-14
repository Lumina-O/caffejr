import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set("user_role", "", {
    path: "/",
    expires: new Date(0),
  });

  response.cookies.set("user_email", "", {
    path: "/",
    expires: new Date(0),
  });

  return response;
}

/*
TODO:
- If using JWT later, invalidate token here
- If using sessions, destroy the session
- Optionally add logout audit logs
*/