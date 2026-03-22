import Link from "next/link";
import { ClipboardList, Clock, UserRound, ShieldCheck, ExternalLink } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";

type StatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub?: string;
};

function StatCard({ icon, label, value, sub }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-100 text-neutral-600">
          {icon}
        </span>
      </div>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-neutral-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-neutral-400">{sub}</p>}
    </div>
  );
}

const STATUS_LABELS: Record<string, string> = {
  received: "Received",
  in_progress: "In Progress",
  completed: "Completed",
  rejected: "Rejected",
};

const STATUS_BADGE: Record<string, "warning" | "blue" | "success" | "destructive" | "secondary"> = {
  received: "warning",
  in_progress: "blue",
  completed: "success",
  rejected: "destructive",
};

type IntakeRow = {
  id: string;
  referenceId: string;
  customerName: string;
  machineType: string;
  status: string;
  createdAt: Date;
};

function IntakeItem({ intake }: { intake: IntakeRow }) {
  return (
    <li className="flex items-center justify-between gap-4 px-5 py-3.5">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant={STATUS_BADGE[intake.status] ?? "secondary"}>
            {STATUS_LABELS[intake.status] ?? intake.status}
          </Badge>
          <span className="truncate text-sm font-medium text-neutral-900">
            {intake.customerName}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-neutral-500">
          {intake.referenceId} · {intake.machineType}
        </p>
      </div>
      <Link
        href={`/admin/reports/${intake.id}`}
        className="shrink-0 rounded-lg p-1.5 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
      >
        <ExternalLink className="h-4 w-4" />
      </Link>
    </li>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <p className="px-5 py-8 text-center text-sm text-neutral-400">{message}</p>
  );
}

export default async function AdminDashboardPage() {
  const user = await requireRole("admin");

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // Start of current ISO week (Monday)
  const dayOfWeek = now.getDay(); // 0 = Sun
  const diffToMonday = (dayOfWeek + 6) % 7;
  const startOfWeek = new Date(now);
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(now.getDate() - diffToMonday);

  const intakeSelect = {
    id: true,
    referenceId: true,
    customerName: true,
    machineType: true,
    status: true,
    createdAt: true,
  } as const;

  const [
    totalIntakes,
    intakesThisMonth,
    activeIntakes,
    uniqueCustomers,
    activeStaff,
    activeTasks,
    weekTasks,
  ] = await Promise.all([
    db.machineIntake.count(),
    db.machineIntake.count({ where: { createdAt: { gte: startOfMonth } } }),
    db.machineIntake.count({
      where: { status: { in: ["received", "in_progress"] } },
    }),
    db.machineIntake
      .findMany({ select: { email: true }, distinct: ["email"] })
      .then((rows) => rows.length),
    db.user.count({
      where: { role: { in: ["staff", "admin", "super_admin"] }, isActive: true },
    }),
    db.machineIntake.findMany({
      where: { status: { in: ["received", "in_progress"] } },
      select: intakeSelect,
      orderBy: { createdAt: "asc" },
    }),
    db.machineIntake.findMany({
      where: { createdAt: { gte: startOfWeek } },
      select: intakeSelect,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-neutral-500">Admin</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Welcome back, {user.name ?? "Admin"}.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={<ClipboardList className="h-5 w-5" />}
          label="Total intakes"
          value={totalIntakes}
          sub={`${intakesThisMonth} this month`}
        />
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Active intakes"
          value={activeIntakes}
          sub="Received or in progress"
        />
        <StatCard
          icon={<UserRound className="h-5 w-5" />}
          label="Unique customers"
          value={uniqueCustomers}
          sub="Distinct emails from intakes"
        />
        <StatCard
          icon={<ShieldCheck className="h-5 w-5" />}
          label="Active staff"
          value={activeStaff}
          sub="Staff, admin & super admins"
        />
      </div>

      {/* Task panels */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Active tasks */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-base font-semibold text-neutral-900">Active tasks</h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {activeTasks.length === 0
                ? "No active intakes right now."
                : `${activeTasks.length} intake${activeTasks.length === 1 ? "" : "s"} received or in progress`}
            </p>
          </div>
          {activeTasks.length === 0 ? (
            <EmptyState message="No active tasks — all caught up." />
          ) : (
            <ol className="divide-y divide-neutral-100">
              {activeTasks.map((intake) => (
                <IntakeItem key={intake.id} intake={intake} />
              ))}
            </ol>
          )}
        </div>

        {/* This week */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <div className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-base font-semibold text-neutral-900">This week</h2>
            <p className="mt-0.5 text-xs text-neutral-500">
              {weekTasks.length === 0
                ? "No intakes submitted this week."
                : `${weekTasks.length} intake${weekTasks.length === 1 ? "" : "s"} submitted since Monday`}
            </p>
          </div>
          {weekTasks.length === 0 ? (
            <EmptyState message="No intakes submitted this week yet." />
          ) : (
            <ol className="divide-y divide-neutral-100">
              {weekTasks.map((intake) => (
                <IntakeItem key={intake.id} intake={intake} />
              ))}
            </ol>
          )}
        </div>
      </div>
    </section>
  );
}
