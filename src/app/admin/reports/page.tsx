import { requireRole } from "@/lib/auth";

const reportCards = [
  {
    title: "Total Bookings",
    value: "128",
    description: "All registered bookings in the system.",
  },
  {
    title: "Open Capacity Slots",
    value: "34",
    description: "Available slots that can still be assigned.",
  },
  {
    title: "Completed Jobs",
    value: "89",
    description: "Finished jobs marked as done.",
  },
  {
    title: "Pending Actions",
    value: "12",
    description: "Items still waiting for follow-up.",
  },
];

const recentReports = [
  {
    id: "REP-001",
    name: "Weekly Capacity Summary",
    status: "Ready",
    updatedAt: "2026-03-11 08:30",
  },
  {
    id: "REP-002",
    name: "Monthly Booking Overview",
    status: "Processing",
    updatedAt: "2026-03-10 16:10",
  },
  {
    id: "REP-003",
    name: "Engineer Workload Snapshot",
    status: "Ready",
    updatedAt: "2026-03-09 11:45",
  },
];

export default async function ReportsPage() {
  await requireRole("admin");

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm font-medium text-neutral-500">Admin</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight text-neutral-900">
          Reports
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-neutral-600">
          View business snapshots, generated summaries, and operational trends.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {reportCards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-neutral-500">{card.title}</p>
            <p className="mt-3 text-3xl font-semibold text-neutral-900">
              {card.value}
            </p>
            <p className="mt-2 text-sm text-neutral-600">{card.description}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent reports
          </h2>
          <p className="mt-1 text-sm text-neutral-600">
            Latest generated and available reports.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  ID
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Report
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Updated
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200 bg-white">
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td className="px-5 py-4 text-sm font-medium text-neutral-900">
                    {report.id}
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-700">
                    {report.name}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700">
                      {report.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm text-neutral-600">
                    {report.updatedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TODO: Connect these report cards and table rows to real database data and add export/download actions. */}
    </section>
  );
}