import { Skeleton } from "@/components/ui/skeleton";

const COLUMNS = ["Reference", "Customer", "Machine", "Photos", "Status", "Submitted", "Closed", "PDF"];

export default function ReportsLoading() {
  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-2 h-8 w-40" />
          <Skeleton className="mt-3 h-4 w-72" />
        </div>
        <Skeleton className="h-12 w-32 rounded-2xl" />
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-3 h-8 w-16" />
            <Skeleton className="mt-2 h-4 w-44" />
          </div>
        ))}
      </div>

      {/* Submissions table */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <Skeleton className="h-6 w-56" />
          <Skeleton className="mt-2 h-4 w-32" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {COLUMNS.map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 ${h === "PDF" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {Array.from({ length: 8 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-32" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-8" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-5 py-4 text-right">
                    <Skeleton className="ml-auto h-8 w-24 rounded-xl" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
