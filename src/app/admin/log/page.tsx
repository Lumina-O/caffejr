import Link from "next/link";
import {
  UserPlus,
  UserCog,
  ClipboardList,
  Pencil,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type FilterType = "all" | "users" | "intakes";

const FILTERS: { value: FilterType; label: string }[] = [
  { value: "all", label: "All activity" },
  { value: "users", label: "Users" },
  { value: "intakes", label: "Intakes" },
];

type LogEntry = {
  id: string;
  timestamp: Date;
  action: "created" | "updated" | "deleted";
  category: "user" | "intake";
  title: string;
  detail: string;
  actor?: string;
  link?: string;
};

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function resolveUserAction(action: string): LogEntry["action"] {
  if (action === "create") return "created";
  if (action === "delete") return "deleted";
  return "updated";
}

function resolveIntakeField(field: string | null) {
  if (!field) return "";
  switch (field) {
    case "status": return "Status";
    case "price": return "Price";
    case "engineerNotes": return "Engineer notes";
    default: return field;
  }
}

// Maps (action, category) → { icon, badge variant, label }
type EntryMeta = {
  Icon: LucideIcon;
  badgeVariant: "default" | "secondary" | "success" | "warning" | "destructive" | "blue" | "outline";
  actionLabel: string;
};

function entryMeta(action: LogEntry["action"], category: LogEntry["category"]): EntryMeta {
  if (category === "user") {
    if (action === "created") return { Icon: UserPlus, badgeVariant: "success", actionLabel: "CREATED" };
    if (action === "deleted") return { Icon: Trash2, badgeVariant: "destructive", actionLabel: "DELETED" };
    return { Icon: UserCog, badgeVariant: "secondary", actionLabel: "UPDATED" };
  }
  // intake
  if (action === "created") return { Icon: ClipboardList, badgeVariant: "success", actionLabel: "CREATED" };
  if (action === "deleted") return { Icon: Trash2, badgeVariant: "destructive", actionLabel: "DELETED" };
  return { Icon: Pencil, badgeVariant: "blue", actionLabel: "UPDATED" };
}

function categoryLabel(category: LogEntry["category"]) {
  switch (category) {
    case "user": return "User";
    case "intake": return "Intake";
  }
}

export default async function LogPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  await requireRole("admin");

  const { type } = await searchParams;
  const filter: FilterType =
    type === "users" || type === "intakes" ? type : "all";

  const LIMIT = 200;

  const [auditLogs, intakeLogs] = await Promise.all([
    filter === "all" || filter === "users"
      ? db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: LIMIT })
      : Promise.resolve([]),
    filter === "all" || filter === "intakes"
      ? db.intakeChangeLog.findMany({ orderBy: { createdAt: "desc" }, take: LIMIT })
      : Promise.resolve([]),
  ]);

  // Collect intake IDs referenced in logs and check which still exist
  const referencedIntakeIds = [...new Set(intakeLogs.map((e) => e.intakeId).filter(Boolean))];
  const existingIntakes = await db.machineIntake.findMany({
    where: { id: { in: referencedIntakeIds } },
    select: { id: true },
  });
  const existingIntakeIds = new Set(existingIntakes.map((i) => i.id));

  const entries: LogEntry[] = [
    ...auditLogs.map((e) => ({
      id: `audit-${e.id}`,
      timestamp: e.createdAt,
      action: resolveUserAction(e.action),
      category: "user" as const,
      title: e.detail,
      detail: `Target: ${e.targetEmail}`,
      actor: e.actorEmail,
    })),
    ...intakeLogs.map((e) => {
      const action: "created" | "updated" | "deleted" =
        e.action === "created" || e.action === "deleted" ? e.action : "updated";

      let title = "";
      let detail = e.referenceId ? `Ref: ${e.referenceId}` : "";

      if (action === "created") {
        title = "New intake submitted";
      } else if (action === "deleted") {
        title = "Intake deleted";
      } else {
        const fieldName = resolveIntakeField(e.field);
        title = `${fieldName} updated`;
        detail = `${e.oldValue ?? "—"} → ${e.newValue ?? "—"}${e.referenceId ? ` · ${e.referenceId}` : ""}`;
      }

      return {
        id: `intake-${e.id}`,
        timestamp: e.createdAt,
        action,
        category: "intake" as const,
        title,
        detail,
        actor: e.actorEmail !== "system" ? e.actorEmail : undefined,
        link: action !== "deleted" && existingIntakeIds.has(e.intakeId) ? `/admin/reports/${e.intakeId}` : undefined,
      };
    }),
  ];

  entries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  const visible = entries.slice(0, LIMIT);

  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-neutral-500">Admin</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
          Activity Log
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          A unified timeline of all actions — user management, intake changes, and new submissions.
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTERS.map(({ value, label }) => (
          <Button
            key={value}
            variant={filter === value ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={value === "all" ? "/admin/log" : `/admin/log?type=${value}`}>
              {label}
            </Link>
          </Button>
        ))}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>
            {visible.length === 0
              ? "No activity recorded yet."
              : `Showing ${visible.length} most recent event${visible.length === 1 ? "" : "s"}.`}
          </CardDescription>
        </CardHeader>

        {visible.length === 0 ? (
          <div className="px-5 py-12 text-center text-sm text-neutral-400">
            No activity yet.
          </div>
        ) : (
          <ol className="divide-y divide-neutral-100">
            {visible.map((entry) => {
              const { Icon, badgeVariant, actionLabel } = entryMeta(entry.action, entry.category);
              return (
                <li
                  key={entry.id}
                  className="flex items-start gap-4 px-5 py-4"
                >
                  {/* Icon */}
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                    <Icon className="h-4 w-4 text-neutral-600" />
                  </div>

                  {/* Body */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={badgeVariant}>{actionLabel}</Badge>
                      <span className="rounded-full border border-neutral-200 px-2 py-0.5 text-[11px] font-medium text-neutral-500">
                        {categoryLabel(entry.category)}
                      </span>
                      {entry.link ? (
                        <Link
                          href={entry.link}
                          className="text-sm font-medium text-neutral-900 hover:underline"
                        >
                          {entry.title}
                        </Link>
                      ) : (
                        <span className="text-sm font-medium text-neutral-900">{entry.title}</span>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-neutral-500">{entry.detail}</p>
                  </div>

                  {/* Right side: actor + time */}
                  <div className="shrink-0 text-right">
                    {entry.actor && (
                      <p className="text-xs font-medium text-neutral-700">{entry.actor}</p>
                    )}
                    <time className="text-xs text-neutral-400">
                      {formatDateTime(entry.timestamp)}
                    </time>
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </Card>

      {entries.length >= LIMIT && (
        <p className="text-center text-xs text-neutral-400">
          Showing the {LIMIT} most recent entries.
        </p>
      )}
    </section>
  );
}
