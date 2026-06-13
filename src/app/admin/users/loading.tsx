import { Skeleton } from "@/components/ui/skeleton";

const USER_COLUMNS = ["Name", "Email", "Role", "Status", "Joined", "Actions"];

export default function UsersLoading() {
  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Skeleton className="h-4 w-16" />
          <Skeleton className="mt-2 h-8 w-28" />
          <Skeleton className="mt-3 h-4 w-80 max-w-full" />
        </div>
        <Skeleton className="h-12 w-28 rounded-2xl" />
      </div>

      {/* Users table */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-4">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-neutral-200">
            <thead className="bg-neutral-50">
              <tr>
                {USER_COLUMNS.map((h) => (
                  <th
                    key={h}
                    className={`px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 ${h === "Actions" ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 bg-white">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-40" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                  <td className="px-5 py-4"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-5 py-4 text-right">
                    <Skeleton className="ml-auto h-8 w-20 rounded-xl" />
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
