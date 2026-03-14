// TODO: Add more roles or granular permissions later if the admin system grows.
export type UserRole = "user" | "staff" | "admin" | "super_admin";

export type AuthUser = {
  id: string;
  name?: string;
  email?: string;
  role: UserRole;
};