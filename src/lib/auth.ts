import { redirect } from "next/navigation";
import type { AuthUser, UserRole } from "@/types/auth";
import { roleAtLeast } from "@/lib/permissions";
import { getSession } from "@/lib/session";

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await getSession();

  if (!session.userId || !session.role) {
    return null;
  }

  return {
    id: session.userId,
    name: session.name,
    email: session.email,
    role: session.role as UserRole,
  };
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

export async function requireRole(minimumRole: UserRole): Promise<AuthUser> {
  const user = await requireAuth();

  if (!roleAtLeast(user.role, minimumRole)) {
    redirect("/unauthorized");
  }

  return user;
}

export async function requireAnyRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}