import { Card, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityLogLoading() {
  return (
    <section className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-4 w-16" />
        <Skeleton className="mt-2 h-8 w-48" />
        <Skeleton className="mt-3 h-4 w-96 max-w-full" />
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-md" />
        ))}
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-28" />
          <Skeleton className="mt-2 h-4 w-56" />
        </CardHeader>

        <ol className="divide-y divide-neutral-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="flex items-start gap-4 px-5 py-4">
              <Skeleton className="mt-0.5 h-8 w-8 shrink-0 rounded-xl" />
              <div className="min-w-0 flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="h-3 w-56 max-w-full" />
              </div>
              <Skeleton className="h-3 w-24" />
            </li>
          ))}
        </ol>
      </Card>
    </section>
  );
}
