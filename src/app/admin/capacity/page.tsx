"use client";

import { useMemo, useState } from "react";

type TicketStatus = "pending" | "confirmed" | "in-progress" | "done";
type CalendarView = "month" | "week";

type Ticket = {
  id: string;
  customerName: string;
  title: string;
  date: string;
  time?: string;
  status: TicketStatus;
};

type CalendarDay = {
  date: Date;
  inCurrentMonth: boolean;
};

const MAX_TICKETS_PER_DAY = 5;

const mockTickets: Ticket[] = [
  {
    id: "1",
    customerName: "John Hansen",
    title: "Coffee machine repair",
    date: "2026-03-03",
    time: "09:00",
    status: "confirmed",
  },
  {
    id: "2",
    customerName: "Sarah Nielsen",
    title: "Descaling service",
    date: "2026-03-03",
    time: "11:30",
    status: "pending",
  },
  {
    id: "3",
    customerName: "Ali Ahmed",
    title: "Water leak inspection",
    date: "2026-03-07",
    time: "10:00",
    status: "in-progress",
  },
  {
    id: "4",
    customerName: "Emma Larsen",
    title: "Pump replacement",
    date: "2026-03-07",
    time: "13:00",
    status: "confirmed",
  },
  {
    id: "5",
    customerName: "Lucas Jensen",
    title: "Steam wand issue",
    date: "2026-03-07",
    time: "15:00",
    status: "confirmed",
  },
  {
    id: "6",
    customerName: "Mia Pedersen",
    title: "General maintenance",
    date: "2026-03-10",
    time: "09:30",
    status: "done",
  },
  {
    id: "7",
    customerName: "Noah Sørensen",
    title: "Electrical issue",
    date: "2026-03-10",
    time: "12:00",
    status: "confirmed",
  },
  {
    id: "8",
    customerName: "Ella Kristensen",
    title: "Pressure problem",
    date: "2026-03-10",
    time: "14:00",
    status: "pending",
  },
  {
    id: "9",
    customerName: "Leo Madsen",
    title: "Group head service",
    date: "2026-03-12",
    time: "08:30",
    status: "confirmed",
  },
  {
    id: "10",
    customerName: "Anna Holm",
    title: "Cleaning and inspection",
    date: "2026-03-12",
    time: "10:00",
    status: "confirmed",
  },
  {
    id: "11",
    customerName: "Mark Olsen",
    title: "No power issue",
    date: "2026-03-12",
    time: "11:30",
    status: "confirmed",
  },
  {
    id: "12",
    customerName: "Julie Thomsen",
    title: "Boiler issue",
    date: "2026-03-12",
    time: "13:00",
    status: "pending",
  },
  {
    id: "13",
    customerName: "David Berg",
    title: "Full service",
    date: "2026-03-12",
    time: "15:00",
    status: "confirmed",
  },
];

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateFromKey(dateString: string) {
  return new Date(`${dateString}T00:00:00`);
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatWeekTitle(start: Date, end: Date) {
  const startLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
  }).format(start);

  const endLabel = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: start.getMonth() === end.getMonth() ? undefined : "short",
    year: start.getFullYear() === end.getFullYear() ? undefined : "numeric",
  }).format(end);

  const yearLabel = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
  }).format(end);

  return `${startLabel} - ${endLabel} ${yearLabel}`;
}

function formatFullDate(dateString: string) {
  const date = parseDateFromKey(dateString);
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getShortWeekday(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
  }).format(date);
}

function getStatusFromCount(count: number, max: number) {
  if (count === 0) return "empty";
  if (count >= max) return "full";
  if (count >= Math.ceil(max * 0.7)) return "busy";
  return "available";
}

function getDayStyles(status: string, isSelected: boolean) {
  const baseSelected = isSelected
    ? "ring-2 ring-[#b19359] border-[#b19359] shadow-sm"
    : "border-neutral-200";

  switch (status) {
    case "full":
      return `${baseSelected} bg-red-50/80 hover:bg-red-50`;
    case "busy":
      return `${baseSelected} bg-yellow-50/80 hover:bg-yellow-50`;
    case "available":
      return `${baseSelected} bg-green-50/80 hover:bg-green-50`;
    default:
      return `${baseSelected} bg-white hover:bg-neutral-50`;
  }
}

function getCountBadgeStyles(status: string, inCurrentMonth: boolean) {
  if (!inCurrentMonth) {
    return "bg-neutral-300 text-white";
  }

  switch (status) {
    case "full":
    case "busy":
    case "available":
      return "bg-neutral-900 text-white";
    default:
      return "bg-neutral-200 text-neutral-700";
  }
}

function getStatusDot(status: string) {
  switch (status) {
    case "full":
      return "bg-red-500";
    case "busy":
      return "bg-yellow-500";
    case "available":
      return "bg-green-500";
    default:
      return "bg-neutral-300";
  }
}

function getProgressBarColor(status: string) {
  switch (status) {
    case "full":
      return "bg-red-500";
    case "busy":
      return "bg-yellow-500";
    case "available":
      return "bg-green-500";
    default:
      return "bg-neutral-300";
  }
}

function getBadgeStyles(status: TicketStatus) {
  switch (status) {
    case "done":
      return "bg-neutral-100 text-neutral-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "confirmed":
      return "bg-green-100 text-green-700";
    case "pending":
    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function getCalendarDays(currentMonth: Date) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const mondayBasedStart = (firstDayOfMonth.getDay() + 6) % 7;
  const totalDays = lastDayOfMonth.getDate();

  const days: CalendarDay[] = [];

  for (let i = mondayBasedStart; i > 0; i--) {
    days.push({
      date: new Date(year, month, 1 - i),
      inCurrentMonth: false,
    });
  }

  for (let day = 1; day <= totalDays; day++) {
    days.push({
      date: new Date(year, month, day),
      inCurrentMonth: true,
    });
  }

  while (days.length % 7 !== 0) {
    const nextDay = days.length - (mondayBasedStart + totalDays) + 1;
    days.push({
      date: new Date(year, month + 1, nextDay),
      inCurrentMonth: false,
    });
  }

  return days;
}

function getStartOfWeek(date: Date) {
  const clone = new Date(date);
  const day = (clone.getDay() + 6) % 7;
  clone.setDate(clone.getDate() - day);
  clone.setHours(0, 0, 0, 0);
  return clone;
}

function getWeekDays(anchorDate: Date) {
  const start = getStartOfWeek(anchorDate);
  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return {
      date,
      inCurrentMonth: true,
    };
  });
}

function addDays(date: Date, days: number) {
  const clone = new Date(date);
  clone.setDate(clone.getDate() + days);
  return clone;
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

function getMonthTotals(currentMonth: Date, ticketsByDate: Record<string, Ticket[]>) {
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();

  let emptyDays = 0;
  let daysWithTickets = 0;
  let fullDays = 0;

  const lastDay = new Date(currentYear, currentMonthIndex + 1, 0).getDate();

  for (let day = 1; day <= lastDay; day++) {
    const dateKey = formatDateKey(new Date(currentYear, currentMonthIndex, day));
    const count = ticketsByDate[dateKey]?.length ?? 0;

    if (count === 0) emptyDays++;
    if (count > 0) daysWithTickets++;
    if (count >= MAX_TICKETS_PER_DAY) fullDays++;
  }

  return { emptyDays, daysWithTickets, fullDays };
}

function getWeekTotals(anchorDate: Date, ticketsByDate: Record<string, Ticket[]>) {
  const weekDays = getWeekDays(anchorDate);

  let emptyDays = 0;
  let daysWithTickets = 0;
  let fullDays = 0;

  for (const day of weekDays) {
    const dateKey = formatDateKey(day.date);
    const count = ticketsByDate[dateKey]?.length ?? 0;

    if (count === 0) emptyDays++;
    if (count > 0) daysWithTickets++;
    if (count >= MAX_TICKETS_PER_DAY) fullDays++;
  }

  return { emptyDays, daysWithTickets, fullDays };
}

export default function CapacityCalendarPage() {
  const [viewMode, setViewMode] = useState<CalendarView>("month");
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1));
  const [selectedDate, setSelectedDate] = useState("2026-03-12");

  const ticketsByDate = useMemo(() => {
    return mockTickets.reduce<Record<string, Ticket[]>>((acc, ticket) => {
      if (!acc[ticket.date]) {
        acc[ticket.date] = [];
      }
      acc[ticket.date].push(ticket);
      return acc;
    }, {});
  }, []);

  const selectedDateObj = useMemo(() => parseDateFromKey(selectedDate), [selectedDate]);

  const monthDays = useMemo(() => getCalendarDays(currentMonth), [currentMonth]);
  const weekDays = useMemo(() => getWeekDays(selectedDateObj), [selectedDateObj]);

  const visibleDays = viewMode === "month" ? monthDays : weekDays;

  const selectedTickets = ticketsByDate[selectedDate] ?? [];
  const selectedCount = selectedTickets.length;
  const selectedRemaining = Math.max(MAX_TICKETS_PER_DAY - selectedCount, 0);

  const totals = useMemo(() => {
    return viewMode === "month"
      ? getMonthTotals(currentMonth, ticketsByDate)
      : getWeekTotals(selectedDateObj, ticketsByDate);
  }, [viewMode, currentMonth, selectedDateObj, ticketsByDate]);

  const weekStart = useMemo(() => getStartOfWeek(selectedDateObj), [selectedDateObj]);
  const weekEnd = useMemo(() => addDays(weekStart, 6), [weekStart]);

  function goToPrevious() {
    if (viewMode === "month") {
      setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
      return;
    }

    const nextSelected = addDays(selectedDateObj, -7);
    setSelectedDate(formatDateKey(nextSelected));
    if (!isSameMonth(nextSelected, currentMonth)) {
      setCurrentMonth(new Date(nextSelected.getFullYear(), nextSelected.getMonth(), 1));
    }
  }

  function goToNext() {
    if (viewMode === "month") {
      setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
      return;
    }

    const nextSelected = addDays(selectedDateObj, 7);
    setSelectedDate(formatDateKey(nextSelected));
    if (!isSameMonth(nextSelected, currentMonth)) {
      setCurrentMonth(new Date(nextSelected.getFullYear(), nextSelected.getMonth(), 1));
    }
  }

  function renderDayCard(
    day: CalendarDay,
    options?: {
      compact?: boolean;
      showWeekdayInside?: boolean;
    }
  ) {
    const compact = options?.compact ?? false;
    const showWeekdayInside = options?.showWeekdayInside ?? false;

    const dateKey = formatDateKey(day.date);
    const tickets = ticketsByDate[dateKey] ?? [];
    const count = tickets.length;
    const remaining = Math.max(MAX_TICKETS_PER_DAY - count, 0);
    const status = getStatusFromCount(count, MAX_TICKETS_PER_DAY);
    const isSelected = selectedDate === dateKey;

    return (
      <button
        key={dateKey}
        type="button"
        onClick={() => setSelectedDate(dateKey)}
        className={`rounded-2xl border p-3 text-left transition ${
          compact ? "h-[132px] w-full" : "h-[136px] sm:h-[152px]"
        } ${getDayStyles(status, isSelected)} ${!day.inCurrentMonth ? "opacity-40" : ""}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between gap-2">
            <div>
              {showWeekdayInside ? (
                <div className="text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
                  {getShortWeekday(day.date)}
                </div>
              ) : null}

              <span
                className={`text-sm font-semibold ${
                  day.inCurrentMonth ? "text-neutral-900" : "text-neutral-500"
                }`}
              >
                {day.date.getDate()}
              </span>
            </div>

            <span
              className={`inline-flex min-w-8 items-center justify-center rounded-full px-2 py-1 text-xs font-semibold ${getCountBadgeStyles(
                status,
                day.inCurrentMonth
              )}`}
            >
              {count}
            </span>
          </div>

          <div className="mt-3 flex justify-center">
            {count === 0 ? (
              <span className="text-xs text-neutral-400">No items</span>
            ) : (
              <span className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700">
                {count} {count === 1 ? "item" : "items"}
              </span>
            )}
          </div>

          <div className="mt-auto pt-3">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-neutral-200">
                <div
                  className={`h-full rounded-full ${getProgressBarColor(status)}`}
                  style={{
                    width: `${Math.min((count / MAX_TICKETS_PER_DAY) * 100, 100)}%`,
                  }}
                />
              </div>

              <span className={`h-3 w-3 rounded-full ${getStatusDot(status)}`} />
            </div>

            <div className="mt-2 text-xs text-neutral-500">{remaining} left</div>
          </div>
        </div>
      </button>
    );
  }

  return (
    <main className="mx-auto max-w-[1700px] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
            Ticket Capacity Calendar
          </h1>
          <p className="mt-2 text-sm text-neutral-600 sm:text-base">
            See how filled each day is, spot empty days fast, and click a date to review all tickets.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:w-fit">
          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-sm text-neutral-500">Days with tickets</div>
            <div className="mt-1 text-2xl font-semibold text-neutral-900">
              {totals.daysWithTickets}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-sm text-neutral-500">Empty days</div>
            <div className="mt-1 text-2xl font-semibold text-neutral-900">
              {totals.emptyDays}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-sm text-neutral-500">Full days</div>
            <div className="mt-1 text-2xl font-semibold text-neutral-900">
              {totals.fullDays}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[2.3fr_0.7fr]">
        <section className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="text-3xl font-semibold text-neutral-900">
                {viewMode === "month"
                  ? formatMonthTitle(currentMonth)
                  : formatWeekTitle(weekStart, weekEnd)}
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex rounded-full border border-neutral-300 bg-neutral-50 p-1">
                  <button
                    type="button"
                    onClick={() => setViewMode("month")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      viewMode === "month"
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-700 hover:bg-white"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("week")}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                      viewMode === "week"
                        ? "bg-neutral-900 text-white"
                        : "text-neutral-700 hover:bg-white"
                    }`}
                  >
                    Week
                  </button>
                </div>

                <button
                  type="button"
                  onClick={goToPrevious}
                  className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Previous
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  className="rounded-full border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {viewMode === "month" ? (
            <>
              <div className="mb-3 hidden sm:grid sm:grid-cols-7 sm:gap-3">
                {weekdayLabels.map((label) => (
                  <div
                    key={label}
                    className="px-1 py-2 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:text-sm"
                  >
                    {label}
                  </div>
                ))}
              </div>

              <div className="hidden sm:grid sm:grid-cols-7 sm:gap-3">
                {visibleDays.map((day) => renderDayCard(day))}
              </div>

              <div className="sm:hidden">
  <div className="space-y-3">
    {weekDays.map((day) =>
      renderDayCard(day, {
        compact: true,
        showWeekdayInside: true,
      })
    )}
  </div>
</div>
            </>
          ) : (
            <>
              <div className="hidden sm:grid sm:grid-cols-7 sm:gap-3">
                {weekDays.map((day) => (
                  <div
                    key={`label-${formatDateKey(day.date)}`}
                    className="px-1 py-2 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500 sm:text-sm"
                  >
                    {getShortWeekday(day.date)}
                  </div>
                ))}
              </div>

              <div className="hidden sm:grid sm:grid-cols-7 sm:gap-3">
                {weekDays.map((day) => renderDayCard(day))}
              </div>

              <div className="sm:hidden">
                <div className="mb-3 flex items-center justify-between">
                  {weekDays.map((day) => (
                    <div
                      key={`mobile-label-${formatDateKey(day.date)}`}
                      className="flex-1 px-1 text-center text-[11px] font-semibold uppercase tracking-wide text-neutral-500"
                    >
                      {getShortWeekday(day.date)}
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 overflow-x-auto pb-2">
                  {weekDays.map((day) =>
                    renderDayCard(day, {
                      compact: true,
                      showWeekdayInside: false,
                    })
                  )}
                </div>
              </div>
            </>
          )}

          <div className="mt-5 flex flex-wrap gap-4 text-sm text-neutral-600">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-neutral-300 bg-white" />
              Empty
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-green-500" />
              Available
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-yellow-500" />
              Almost full
            </div>
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500" />
              Full
            </div>
          </div>
        </section>

        <aside className="rounded-3xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
          <h2 className="text-2xl font-semibold text-neutral-900">
            {formatFullDate(selectedDate)}
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-neutral-50 p-3.5">
              <div className="text-sm text-neutral-500">Tickets</div>
              <div className="mt-1 text-2xl font-semibold text-neutral-900">
                {selectedCount}
              </div>
            </div>

            <div className="rounded-2xl bg-neutral-50 p-3.5">
              <div className="text-sm text-neutral-500">Remaining spots</div>
              <div className="mt-1 text-2xl font-semibold text-neutral-900">
                {selectedRemaining}
              </div>
            </div>
          </div>

          <div className="mt-7">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
              Tickets for this day
            </h3>

            {selectedTickets.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-sm text-neutral-600">
                No tickets booked for this day.
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {selectedTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="rounded-2xl border border-neutral-200 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-lg font-semibold text-neutral-900">
                          {ticket.customerName}
                        </p>
                        <p className="mt-1 text-sm text-neutral-600">
                          {ticket.title}
                        </p>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${getBadgeStyles(
                          ticket.status
                        )}`}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <div className="mt-3 text-sm text-neutral-500">
                      {ticket.time ? `Time: ${ticket.time}` : "Time not set"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* TODO: Replace mockTickets with real ticket data from your backend or CMS, add filters for technician/status/location, and connect each ticket card to its detailed ticket page. */}
    </main>
  );
}