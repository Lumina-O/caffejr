import type { ReactNode } from "react";
import { requireRole } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";

type AdminLayoutProps = {
  children: ReactNode;
};

export default async function AdminLayout({ children }: AdminLayoutProps) {
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