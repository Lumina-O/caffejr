import { Skeleton } from "@/components/ui/skeleton";

function FieldSkeleton() {
  return (
    <div>
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-2 h-4 w-32" />
    </div>
  );
}

export default function IntakeDetailLoading() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-3 h-8 w-40" />
          <Skeleton className="mt-2 h-4 w-48" />
        </div>
        <div className="flex flex-col items-end gap-3">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Details */}
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-5 w-32" />
            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <FieldSkeleton key={i} />
              ))}
            </dl>
          </div>

          {/* PDF viewer */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="mt-4 h-[480px] w-full rounded-xl" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-5 w-28" />
            <div className="mt-4 space-y-4">
              <FieldSkeleton />
              <FieldSkeleton />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <Skeleton className="h-5 w-24" />
            <ol className="mt-4 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <li key={i} className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
