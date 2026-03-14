import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { AuthUser, UserRole } from "@/types/auth";
import { roleAtLeast } from "@/lib/permissions";

// TODO: Replace cookie-based auth with real session/JWT validation and database user lookup.
export async function getCurrentUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();

  const role = cookieStore.get("user_role")?.value as UserRole | undefined;
  const email = cookieStore.get("user_email")?.value;

  if (!role || !email) {
    return null;
  }

  return {
    id: "1",
    name: email.split("@")[0],
    email,
    role,
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