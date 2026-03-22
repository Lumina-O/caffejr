"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Dispatch, SetStateAction } from "react";
import {
  Home,
  LayoutDashboard,
  CalendarDays,
  FileText,
  Activity,
  Users,
  LogOut,
  Menu,
  type LucideIcon,
} from "lucide-react";
import type { UserRole } from "@/types/auth";
import { roleAtLeast } from "@/lib/permissions";
import { cn } from "@/lib/utils";

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

  const canManageBookings = roleAtLeast(userRole, "staff");
  const canViewReports = roleAtLeast(userRole, "admin");
  const canViewLog = roleAtLeast(userRole, "admin");
  const canManageUsers = roleAtLeast(userRole, "super_admin");

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-neutral-200 bg-white transition-all duration-300",
        open ? "w-64" : "w-16"
      )}
    >
      {/* Top */}
      <div>
        <div className="flex items-center justify-between p-3">
          {open && (
            <span className="text-sm font-semibold text-neutral-600">Admin</span>
          )}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="rounded-md p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            aria-label={open ? "Close sidebar" : "Open sidebar"}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>

        {open && (
          <div className="px-4 pb-4">
            <p className="text-xs text-neutral-500">Signed in as</p>
            <p className="text-sm font-semibold text-neutral-900">{userName}</p>
            <p className="text-xs uppercase tracking-wide text-neutral-400">
              {userRole.replace("_", " ")}
            </p>
          </div>
        )}

        <nav className="flex flex-col gap-1 px-2">
          <NavItem href="/" icon={Home} label="Home" open={open} exact />
          <NavItem href="/admin" icon={LayoutDashboard} label="Dashboard" open={open} exact />

          {canManageBookings && (
            <NavItem href="/admin/capacity" icon={CalendarDays} label="Capacity" open={open} />
          )}

          {canViewReports && (
            <NavItem href="/admin/reports" icon={FileText} label="Reports" open={open} />
          )}

          {canViewLog && (
            <NavItem href="/admin/log" icon={Activity} label="Log" open={open} />
          )}

          {canManageUsers && (
            <NavItem href="/admin/users" icon={Users} label="Users" open={open} />
          )}
        </nav>
      </div>

      {/* Bottom */}
      <div className="mt-auto px-2 pb-4">
        <button
          onClick={handleLogout}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50",
            !open && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}

type NavItemProps = {
  href: string;
  icon: LucideIcon;
  label: string;
  open: boolean;
  exact?: boolean;
};

function NavItem({ href, icon: Icon, label, open, exact = false }: NavItemProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
        isActive
          ? "bg-neutral-900 text-white"
          : "text-neutral-700 hover:bg-neutral-100",
        !open && "justify-center"
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      {open && <span>{label}</span>}
    </Link>
  );
}
