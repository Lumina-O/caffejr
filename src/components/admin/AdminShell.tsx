"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import type { UserRole } from "@/types/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

type AdminShellProps = {
  children: ReactNode;
  userRole: UserRole;
  userName: string;
};

export default function AdminShell({
  children,
  userRole,
  userName,
}: AdminShellProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <AdminSidebar
        userRole={userRole}
        userName={userName}
        open={open}
        setOpen={setOpen}
      />

      <main
        className={`min-h-screen transition-all duration-300 ${
          open ? "pl-16 md:pl-64" : "pl-16"
        }`}
      >
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}