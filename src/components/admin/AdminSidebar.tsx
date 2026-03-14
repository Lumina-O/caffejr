"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import type { UserRole } from "@/types/auth";
import { roleAtLeast } from "@/lib/permissions";

type AdminSidebarProps = {
  userRole: UserRole;
  userName: string;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function AdminSidebar({
  userRole,
  userName,
  open,
  setOpen,
}: AdminSidebarProps) {
  const router = useRouter();

  const canManageUsers = roleAtLeast(userRole, "super_admin");
  const canManageBookings = roleAtLeast(userRole, "staff");
  const canViewReports = roleAtLeast(userRole, "admin");

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-neutral-200 bg-white transition-all duration-300 ${
        open ? "w-64" : "w-16"
      }`}
    >
      {/* Top */}
      <div>
        <div className="flex items-center justify-between p-3">
          {open && (
            <span className="text-sm font-semibold text-neutral-600">
              Admin
            </span>
          )}

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-md p-2 hover:bg-neutral-100"
            aria-label={open ? "Close sidebar" : "Open sidebar"}
          >
            ☰
          </button>
        </div>

        {open && (
          <div className="px-4 pb-4">
            <p className="text-xs text-neutral-500">Signed in as</p>
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              {userRole.replace("_", " ")}
            </p>
          </div>
        )}

        <nav className="flex flex-col gap-1 px-2">
          <NavItem href="/" icon="🏠" label="Home" open={open} />
          <NavItem href="/admin" icon="📊" label="Dashboard" open={open} />

          {canManageBookings && (
            <NavItem
              href="/admin/capacity"
              icon="📅"
              label="Capacity"
              open={open}
            />
          )}

          {canViewReports && (
            <NavItem
              href="/admin/reports"
              icon="📈"
              label="Reports"
              open={open}
            />
          )}

          {canManageUsers && (
            <NavItem
              href="/admin/users"
              icon="👥"
              label="Users"
              open={open}
            />
          )}
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="mt-auto px-2 pb-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <span className="flex h-5 w-5 items-center justify-center text-lg">
            🚪
          </span>

          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

type NavItemProps = {
  href: string;
  icon: string;
  label: string;
  open: boolean;
};

function NavItem({ href, icon, label, open }: NavItemProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
    >
      <span className="flex h-5 w-5 items-center justify-center text-lg">
        {icon}
      </span>

      {open && <span>{label}</span>}
    </Link>
  );
}