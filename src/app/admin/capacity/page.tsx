"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type IntakeStatus = "received" | "in_progress" | "completed" | "rejected";
type CalendarView = "month" | "week";

type IntakeItem = {
  id: string;
  referenceId: string;
  customerName: string;
  machineType: string;
  status: IntakeStatus;
  startDate: string;
  endDate: string;
};

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

const MAX_ITEMS_PER_DAY = 5;
const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ALL_STATUSES: IntakeStatus[] = ["received", "in_progress", "completed", "rejected"];

function formatDateKey(date: Date) {
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, "0");
  const d = `${date.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatMonthParam(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function parseDateKey(s: string) {
  return new Date(`${s}T00:00:00`);
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(date);
}

function formatWeekTitle(start: Date, end: Date) {
  const s = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" }).format(start);
  const e = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: start.getMonth() === end.getMonth() ? undefined : "short",
  }).format(end);
  const year = new Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(end);
  return `${s} – ${e} ${year}`;
}

function formatFullDate(s: string) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parseDateKey(s));
}

function getShortWeekday(date: Date) {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(date);
}

function getStartOfWeek(date: Date) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() - ((clone.getDay() + 6) % 7));
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function addDays(date: Date, n: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function getCalendarDays(month: Date): CalendarDay[] {
  const y = month.getFullYear();
  const m = month.getMonth();
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  const offset = (firstDay.getDay() + 6) % 7;
  const days: CalendarDay[] = [];
  for (let i = offset; i > 0; i--) days.push({ date: new Date(y, m, 1 - i), inCurrentMonth: false });
  for (let d = 1; d <= lastDay.getDate(); d++) days.push({ date: new Date(y, m, d), inCurrentMonth: true });
  while (days.length % 7 !== 0) {
    days.push({ date: new Date(y, m + 1, days.length - (offset + lastDay.getDate()) + 1), inCurrentMonth: false });
  }
  return days;
}

function getWeekDays(anchor: Date): CalendarDay[] {
  const start = getStartOfWeek(anchor);
  return Array.from({ length: 7 }, (_, i) => ({ date: addDays(start, i), inCurrentMonth: true }));
}

function buildItemsByDate(intakes: IntakeItem[]): Record<string, IntakeItem[]> {
  const result: Record<string, IntakeItem[]> = {};
  for (const intake of intakes) {
    const start = parseDateKey(intake.startDate);
    const end = parseDateKey(intake.endDate);
    const cur = new Date(start);
    while (cur <= end) {
      const key = formatDateKey(cur);
      if (!result[key]) result[key] = [];
      result[key].push(intake);
      cur.setDate(cur.getDate() + 1);
    }
  }
  return result;
}

function capacityStatus(count: number) {
  if (count === 0) return "empty";
  if (count >= MAX_ITEMS_PER_DAY) return "full";
  if (count >= Math.ceil(MAX_ITEMS_PER_DAY * 0.7)) return "busy";
  return "available";
}

function dayCardClass(status: string, selected: boolean) {
  const ring = selected ? "ring-2 ring-[#b19359] border-[#b19359] shadow-sm" : "border-neutral-200";
  switch (status) {
    case "full":      return `${ring} bg-red-50/80 hover:bg-red-50`;
    case "busy":      return `${ring} bg-yellow-50/80 hover:bg-yellow-50`;
    case "available": return `${ring} bg-green-50/80 hover:bg-green-50`;
    default:          return `${ring} bg-white hover:bg-neutral-50`;
  }
}

function progressColor(status: string) {
  switch (status) {
    case "full":      return "bg-red-500";
    case "busy":      return "bg-yellow-500";
    case "available": return "bg-green-500";
    default:          return "bg-neutral-300";
  }
}

function statusDot(status: string) {
  switch (status) {
    case "full":      return "bg-red-500";
    case "busy":      return "bg-yellow-500";
    case "available": return "bg-green-500";
    default:          return "bg-neutral-300";
  }
}

function intakeBadgeVariant(status: IntakeStatus) {
  switch (status) {
    case "completed":  return "secondary" as const;
    case "in_progress": return "blue" as const;
    case "received":   return "warning" as const;
    case "rejected":   return "destructive" as const;
  }
}

export default function CapacityCalendarPage() {
  const [viewMode, setViewMode] = useState<CalendarView>("month");
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const [intakes, setIntakes] = useState<IntakeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<IntakeStatus | "all">("all");
  const [machineTypeFilter, setMachineTypeFilter] = useState("all");

  async function fetchData(month: Date) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tickets?month=${formatMonthParam(month)}`);
      const data = await res.json();
      setIntakes(data.intakes ?? []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchData(currentMonth); }, [currentMonth]);

  // Close modal on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setModalOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  async function handleStatusUpdate(id: string, newStatus: IntakeStatus) {
    setUpdatingId(id);
    try {
      const res = await fetch(`/api/admin/intakes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setIntakes((prev) => prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i)));
      }
    } finally {
      setUpdatingId(null);
    }
  }

  const machineTypes = useMemo(
    () => Array.from(new Set(intakes.map((i) => i.machineType).filter(Boolean))).sort(),
    [intakes]
  );

  const filtered = useMemo(
    () =>
      intakes.filter((i) => {
        if (statusFilter !== "all" && i.status !== statusFilter) return false;
        if (machineTypeFilter !== "all" && i.machineType !== machineTypeFilter) return false;
        return true;
      }),
    [intakes, statusFilter, machineTypeFilter]
  );

  const itemsByDate = useMemo(() => buildItemsByDate(filtered), [filtered]);

  const anchorDate = useMemo(
    () => selectedDate ? parseDateKey(selectedDate) : new Date(),
    [selectedDate]
  );
  const monthDays = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const weekDays = useMemo(() => getWeekDays(anchorDate), [anchorDate]);
  const visibleDays = viewMode === "month" ? monthDays : weekDays;

  const selectedItems = selectedDate ? (itemsByDate[selectedDate] ?? []) : [];
  const weekStart = useMemo(() => getStartOfWeek(anchorDate), [anchorDate]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  // Month/week totals
  const totals = useMemo(() => {
    const days = viewMode === "month"
      ? Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate() },
          (_, i) => formatDateKey(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i + 1)))
      : weekDays.map((d) => formatDateKey(d.date));

    let empty = 0, active = 0, full = 0;
    for (const key of days) {
      const c = itemsByDate[key]?.length ?? 0;
      if (c === 0) empty++;
      if (c > 0) active++;
      if (c >= MAX_ITEMS_PER_DAY) full++;
    }
    return { empty, active, full };
  }, [viewMode, currentMonth, weekDays, itemsByDate]);

  function navigate(dir: 1 | -1) {
    if (viewMode === "month") {
      setCurrentMonth((p) => new Date(p.getFullYear(), p.getMonth() + dir, 1));
    } else {
      const next = addDays(anchorDate, dir * 7);
      setSelectedDate(formatDateKey(next));
      if (!isSameMonth(next, currentMonth)) {
        setCurrentMonth(new Date(next.getFullYear(), next.getMonth(), 1));
      }
    }
  }

  function renderDayCard(day: CalendarDay, compact = false, showWeekday = false) {
    const key = formatDateKey(day.date);
    const items = itemsByDate[key] ?? [];
    const count = items.length;
    const remaining = Math.max(MAX_ITEMS_PER_DAY - count, 0);
    const status = capacityStatus(count);
    const isSelected = selectedDate === key && modalOpen;

    return (
      <button
        key={key}
        type="button"
        onClick={() => {
          setSelectedDate(key);
          setModalOpen(true);
        }}
        className={`rounded-2xl border p-3 text-left transition ${compact ? "h-[132px] w-full" : "h-[136px] sm:h-[152px]"} ${dayCardClass(status, isSelected)} ${!day.inCurrentMonth ? "opacity-40" : ""}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              {showWeekday && (
                <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {getShortWeekday(day.date)}
                </div>
              )}
              <span className={`text-sm font-semibold ${day.inCurrentMonth ? "text-neutral-900" : "text-neutral-500"}`}>
                {day.date.getDate()}
              </span>
            </div>
            <span className={`inline-flex min-w-8 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${count > 0 ? "bg-neutral-900 text-white" : "bg-neutral-200 text-neutral-700"}`}>
              {count}
            </span>
          </div>

          <div className="mt-3 flex justify-center">
            {count === 0
              ? <span className="text-xs text-neutral-400">No intakes</span>
              : <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">{count} {count === 1 ? "intake" : "intakes"}</span>
            }
          </div>

          <div className="mt-auto pt-3">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                <div className={`h-full rounded-full ${progressColor(status)}`} style={{ width: `${Math.min((count / MAX_ITEMS_PER_DAY) * 100, 100)}%` }} />
              </div>
              <span className={`h-3 w-3 rounded-full ${statusDot(status)}`} />
            </div>
            <div className="mt-2 text-xs text-neutral-500">{remaining} left</div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">Capacity</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Track active machine intakes across the calendar. Click any day to see details.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:w-fit">
          {[
            { label: "Days with intakes", value: totals.active },
            { label: "Empty days", value: totals.empty },
            { label: "Full days", value: totals.full },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
              <div className="text-xs text-neutral-500">{label}</div>
              <div className="mt-1 text-2xl font-semibold text-neutral-900">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-neutral-600">Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as IntakeStatus | "all")}
            className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
          >
            <option value="all">All statuses</option>
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}</option>
            ))}
          </select>
        </div>

        {machineTypes.length > 0 && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-neutral-600">Machine type</label>
            <select
              value={machineTypeFilter}
              onChange={(e) => setMachineTypeFilter(e.target.value)}
              className="rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
            >
              <option value="all">All types</option>
              {machineTypes.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        )}

        {loading && <span className="flex items-center text-sm text-neutral-400">Loading…</span>}
      </div>

      {/* Calendar — full width */}
      <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h2 className="text-3xl font-semibold text-neutral-900">
            {viewMode === "month" ? formatMonthTitle(currentMonth) : formatWeekTitle(weekStart, weekEnd)}
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex rounded-full border border-neutral-300 bg-neutral-50 p-1">
              {(["month", "week"] as CalendarView[]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setViewMode(v)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${viewMode === v ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-white"}`}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
            <button type="button" onClick={() => navigate(-1)} className="rounded-full border border-neutral-300 p-2.5 text-neutral-700 transition hover:bg-neutral-50">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" onClick={() => navigate(1)} className="rounded-full border border-neutral-300 p-2.5 text-neutral-700 transition hover:bg-neutral-50">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {viewMode === "month" ? (
          <>
            <div className="mb-3 hidden sm:grid sm:grid-cols-7 sm:gap-3">
              {WEEKDAY_LABELS.map((l) => (
                <div key={l} className="px-1 py-2 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">{l}</div>
              ))}
            </div>
            <div className="hidden sm:grid sm:grid-cols-7 sm:gap-3">
              {visibleDays.map((day) => renderDayCard(day))}
            </div>
            <div className="space-y-3 sm:hidden">
              {weekDays.map((day) => renderDayCard(day, true, true))}
            </div>
          </>
        ) : (
          <>
            <div className="hidden sm:grid sm:grid-cols-7 sm:gap-3">
              {weekDays.map((day) => (
                <div key={`lbl-${formatDateKey(day.date)}`} className="px-1 py-2 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  {getShortWeekday(day.date)}
                </div>
              ))}
            </div>
            <div className="hidden sm:grid sm:grid-cols-7 sm:gap-3">
              {weekDays.map((day) => renderDayCard(day))}
            </div>
            <div className="sm:hidden">
              <div className="mb-3 flex">
                {weekDays.map((day) => (
                  <div key={`mlbl-${formatDateKey(day.date)}`} className="flex-1 text-center text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                    {getShortWeekday(day.date)}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {weekDays.map((day) => renderDayCard(day, true, false))}
              </div>
            </div>
          </>
        )}

        <div className="mt-5 flex flex-wrap gap-4 text-sm text-neutral-500">
          {[
            { dot: "border border-neutral-300 bg-white", label: "Empty" },
            { dot: "bg-green-500", label: "Available" },
            { dot: "bg-yellow-500", label: "Almost full" },
            { dot: "bg-red-500", label: "Full" },
          ].map(({ dot, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className={`h-3 w-3 rounded-full ${dot}`} />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Day detail modal */}
      {modalOpen && selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div
            ref={modalRef}
            className="flex w-full max-w-md flex-col rounded-3xl bg-white shadow-2xl"
            style={{ maxHeight: "85vh" }}
          >
            {/* Modal header */}
            <div className="flex items-start justify-between border-b border-neutral-100 px-6 py-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {selectedItems.length} {selectedItems.length === 1 ? "intake" : "intakes"} ·{" "}
                  {Math.max(MAX_ITEMS_PER_DAY - selectedItems.length, 0)} remaining
                </p>
                <h2 className="mt-1 text-xl font-semibold text-neutral-900">
                  {formatFullDate(selectedDate)}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="ml-4 rounded-xl p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto px-6 py-5">
              {selectedItems.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-8 text-center text-sm text-neutral-500">
                  No intakes for this day.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedItems.map((item) => (
                    <div key={item.id} className="rounded-2xl border border-neutral-200 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-neutral-900">{item.customerName}</p>
                          <p className="mt-0.5 text-xs text-neutral-400">{item.referenceId}</p>
                          <p className="mt-1 text-xs text-neutral-500">{item.machineType}</p>
                        </div>
                        <Badge variant={intakeBadgeVariant(item.status)}>
                          {item.status.replace("_", " ")}
                        </Badge>
                      </div>

                      {item.startDate !== item.endDate && (
                        <p className="mt-2 text-xs text-neutral-400">Since {item.startDate}</p>
                      )}

                      <div className="mt-3 flex items-center gap-2">
                        <select
                          value={item.status}
                          disabled={updatingId === item.id}
                          onChange={(e) => handleStatusUpdate(item.id, e.target.value as IntakeStatus)}
                          className="flex-1 rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 disabled:opacity-50"
                        >
                          {ALL_STATUSES.map((s) => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ")}</option>
                          ))}
                        </select>
                        <Link
                          href={`/admin/reports/${item.id}`}
                          className="rounded-xl border border-neutral-300 p-2 text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900"
                          title="Open report"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
