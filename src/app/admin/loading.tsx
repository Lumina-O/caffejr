import { Skeleton } from "@/components/ui/skeleton";

function StatCardSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-9 rounded-xl" />
      </div>
      <Skeleton className="mt-3 h-8 w-16" />
      <Skeleton className="mt-2 h-3 w-28" />
    </div>
  );
}

function PanelSkeleton() {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
      <div className="border-b border-neutral-100 px-5 py-4">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="mt-2 h-3 w-40" />
      </div>
      <ol className="divide-y divide-neutral-100">
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i} className="flex items-center justify-between gap-4 px-5 py-3.5">
            <div className="min-w-0 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <Skeleton className="h-3 w-40" />
            </div>
            <Skeleton className="h-7 w-7 rounded-lg" />
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function AdminDashboardLoading() {
  return (
    <section className="space-y-6">
      <div>
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-2 h-8 w-48" />
        <Skeleton className="mt-3 h-4 w-56" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <PanelSkeleton />
        <PanelSkeleton />
      </div>
    </section>
  );
}
