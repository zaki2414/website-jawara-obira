// app/umkm/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

function UMKMCardSkeleton() {
  return (
    <div className="bg-background border-2 border-on-surface rounded-2xl overflow-hidden hard-shadow h-full flex flex-col">
      <Skeleton className="h-56 w-full rounded-none border-b-2 border-on-surface" />
      <div className="p-6 flex flex-col gap-4">
        <div className="space-y-2">
          <Skeleton className="h-7 w-3/4 rounded-md" />
          <Skeleton className="h-4 w-full rounded-md" />
          <Skeleton className="h-4 w-2/3 rounded-md" />
        </div>
        <div className="space-y-3 pt-3 border-t border-dashed border-outline-variant">
          <Skeleton className="h-4 w-1/2 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UMKMListLoading() {
  return (
    <section className="relative bg-natural-paper py-16 px-6 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header skeleton */}
        <div className="text-center mb-10 p-8 md:p-12 border-4 border-on-surface rounded-3xl bg-background hard-shadow space-y-5">
          <Skeleton className="h-8 w-40 rounded-full mx-auto" />
          <Skeleton className="h-12 w-full max-w-lg rounded-md mx-auto" />
          <Skeleton className="h-4 w-full max-w-2xl rounded-md mx-auto" />
          <Skeleton className="h-4 w-2/3 max-w-xl rounded-md mx-auto" />
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-4">
            <Skeleton className="h-7 w-28 rounded-full" />
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-7 w-28 rounded-full" />
          </div>
        </div>

        {/* Search form skeleton */}
        <div className="flex flex-col md:flex-row gap-5 mb-5 bg-background p-5 border-4 border-on-surface rounded-2xl hard-shadow-sm">
          <Skeleton className="h-14 flex-1 rounded-xl" />
          <Skeleton className="h-14 w-full md:w-50 rounded-xl" />
          <Skeleton className="h-14 w-full md:w-32 rounded-xl" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 py-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <UMKMCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
