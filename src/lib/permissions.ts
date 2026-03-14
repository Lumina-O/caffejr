import type { UserRole } from "@/types/auth";

// TODO: Expand this into action-based permissions later, like "canEditBooking" or "canManageUsers".
const roleHierarchy: Record<UserRole, number> = {
  user: 0,
  staff: 1,
  admin: 2,
  super_admin: 3,
};

export function roleAtLeast(currentRole: UserRole, minimumRole: UserRole): boolean {
  return roleHierarchy[currentRole] >= roleHierarchy[minimumRole];
}

export function hasAnyRole(currentRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(currentRole);
}