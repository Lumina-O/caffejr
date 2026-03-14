import { NextResponse } from "next/server";
import { requireAnyRole } from "@/lib/auth";

// TODO: Replace mock data with database calls and add pagination/search later.
export async function GET() {
  const user = await requireAnyRole(["super_admin"]);

  const users = [
    { id: "1", name: "Owen", email: "owen@example.com", role: "super_admin" },
    { id: "2", name: "Sarah", email: "sarah@example.com", role: "admin" },
    { id: "3", name: "John", email: "john@example.com", role: "staff" },
  ];

  return NextResponse.json({
    success: true,
    requestedBy: user.email,
    users,
  });
}