// app/fauna-obi/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

function FaunaCardSkeleton() {
  return (
    <div className="bg-background border-2 border-on-surface rounded-2xl overflow-hidden hard-shadow h-full flex flex-col">
      <Skeleton className="h-56 w-full rounded-none border-b-2 border-on-surface" />
      <div className="p-6 flex flex-col gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20 rounded-md" />
          <Skeleton className="h-7 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-1/2 rounded-md" />
        </div>
        <div className="space-y-2 pt-3 border-t border-dashed border-outline-variant">
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
      </div>
    </div>
  );
}

export default function FaunaObiLoading() {
  return (
    <section className="relative bg-natural-paper py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Hero skeleton */}
        <div className="border-4 border-on-surface rounded-3xl p-6 md:p-10 hard-shadow-lg bg-background mb-8 md:mb-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-4 max-w-3xl w-full">
            <Skeleton className="h-6 w-48 rounded-full" />
            <Skeleton className="h-10 w-full max-w-md rounded-md" />
            <Skeleton className="h-10 w-2/3 max-w-sm rounded-md" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
          </div>
          <Skeleton className="h-28 w-45 rounded-2xl shrink-0" />
        </div>

        {/* Filter bar skeleton */}
        <div className="flex flex-col md:flex-row gap-5 mb-5 bg-background p-5 border-4 border-on-surface rounded-2xl hard-shadow-sm">
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="h-14 w-full md:w-50 rounded-xl" />
          <Skeleton className="h-14 w-full md:w-32 rounded-xl" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 py-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <FaunaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
