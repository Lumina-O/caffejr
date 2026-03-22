import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";

const PER_PAGE = 20;

function statusBadgeClass(status: string) {
  switch (status) {
    case "completed":
      return "bg-neutral-100 text-neutral-700";
    case "in_progress":
      return "bg-blue-100 text-blue-700";
    case "received":
      return "bg-yellow-100 text-yellow-700";
    case "rejected":
      return "bg-red-100 text-red-700";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await requireRole("admin");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));
  const skip = (page - 1) * PER_PAGE;

  const [
    totalBookings,
    openSlots,
    completedJobs,
    pendingActions,
    intakes,
    totalIntakes,
  ] = await Promise.all([
    db.booking.count(),
    db.booking.count({ where: { status: { in: ["pending", "confirmed"] } } }),
    db.machineIntake.count({ where: { status: "completed" } }),
    db.machineIntake.count({ where: { status: { in: ["received", "in_progress"] } } }),
    db.machineIntake.findMany({
      select: {
        id: true,
        referenceId: true,
        customerName: true,
        brand: true,
        model: true,
        machineType: true,
        status: true,
        photoCount: true,
        pdfUrl: true,
        createdAt: true,
        closedAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: PER_PAGE,
    }),
    db.machineIntake.count(),
  ]);

  const totalPages = Math.ceil(totalIntakes / PER_PAGE);

  const statCards = [
    {
      title: "Total Bookings",
      value: totalBookings,
      description: "All registered bookings in the system.",
    },
    {
      title: "Open Capacity Slots",
      value: openSlots,
      description: "Bookings pending or confirmed.",
    },
    {
      title: "Completed Jobs",
      value: completedJobs,
      description: "Machine intakes marked as completed.",
    },
    {
      title: "Pending Actions",
      value: pendingActions,
      description: "Intakes received or in progress.",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
            Reports
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-neutral-600">
            View business snapshots and machine intake submissions.
          </p>
        </div>

        <a
          href="/api/admin/intakes/export"
          className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
        >
          Export CSV
        </a>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-neutral-500">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold text-neutral-900">{card.value}</p>
            <p className="mt-2 text-sm text-neutral-600">{card.description}</p>
          </div>
        ))}
      </div>

      {/* Machine intake submissions */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">Machine intake submissions</h2>
          <p className="mt-1 text-sm text-neutral-600">
            {totalIntakes} total submission{totalIntakes !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {["Reference", "Customer", "Machine", "Photos", "Status", "Submitted", "Closed", "PDF"].map(
                  (h) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 ${h === "PDF" ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 bg-white">
              {intakes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-sm text-neutral-500">
                    No submissions yet.
                  </td>
                </tr>
              ) : (
                intakes.map((intake) => (
                  <tr key={intake.id}>
                    <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                      <Link
                        href={`/admin/reports/${intake.id}`}
                        className="hover:underline"
                      >
                        {intake.referenceId}
                      </Link>
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-700">
                      {intake.customerName}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">
                      {intake.brand} {intake.model}
                      <span className="ml-2 text-xs text-neutral-400">{intake.machineType}</span>
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-600">{intake.photoCount}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${statusBadgeClass(intake.status)}`}
                      >
                        {intake.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-500">
                      {formatDate(intake.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-sm text-neutral-500">
                      {intake.closedAt ? formatDate(intake.closedAt) : <span className="text-neutral-300">—</span>}
                    </td>
                    <td className="px-5 py-4 text-right">
                      {intake.pdfUrl ? (
                        <a
                          href={`/api/admin/intakes/${intake.id}/pdf`}
                          className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
                        >
                          Download
                        </a>
                      ) : (
                        <span className="text-xs text-neutral-400">No PDF</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-neutral-200 px-5 py-4">
            <p className="text-sm text-neutral-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              {page > 1 && (
                <Link
                  href={`?page=${page - 1}`}
                  className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Previous
                </Link>
              )}
              {page < totalPages && (
                <Link
                  href={`?page=${page + 1}`}
                  className="rounded-xl border border-neutral-300 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
