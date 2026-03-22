import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getSession } from "@/lib/session";
import AdminShell from "@/components/admin/AdminShell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const session = await getSession();
  if (session.mustChangePassword) redirect("/change-password");

  const user = await requireRole("admin");

  return (
    <AdminShell
      userRole={user.role}
      userName={user.name ?? "Admin"}
    >
      {children}
    </AdminShell>
  );
}