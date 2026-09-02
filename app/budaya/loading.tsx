// app/budaya/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

function CultureCardSkeleton() {
  return (
    <div className="bg-background border-4 border-on-surface rounded-2xl overflow-hidden hard-shadow h-full flex flex-col">
      <Skeleton className="h-48 sm:h-52 w-full rounded-none border-b-4 border-on-surface" />
      <div className="p-5 flex flex-col gap-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-24 rounded-md" />
          <Skeleton className="h-6 w-full rounded-md" />
          <Skeleton className="h-6 w-3/4 rounded-md" />
        </div>
        <div className="flex items-center justify-between border-t-2 border-dashed border-outline/50 pt-3">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-7 w-7 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export default function CultureCatalogLoading() {
  return (
    <section className="relative bg-natural-paper py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <div className="relative max-w-7xl mx-auto z-10 space-y-8">
        {/* Header skeleton — split hero (panel judul + spotlight) */}
        <div className="grid lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
          <div className="lg:col-span-7 border-4 border-on-surface rounded-3xl p-6 md:p-10 hard-shadow bg-background space-y-4">
            <Skeleton className="h-6 w-56 rounded-full" />
            <Skeleton className="h-10 w-full max-w-md rounded-md" />
            <Skeleton className="h-10 w-2/3 max-w-sm rounded-md" />
            <Skeleton className="h-4 w-full max-w-xl rounded-md" />
            <Skeleton className="h-4 w-3/4 max-w-lg rounded-md" />
          </div>
          <div className="lg:col-span-5 border-4 border-on-surface rounded-3xl p-6 md:p-8 hard-shadow-lg bg-background space-y-6">
            <Skeleton className="h-7 w-32 rounded-full" />
            <Skeleton className="h-14 w-24 rounded-md" />
            <div className="space-y-2 pt-4 border-t-2 border-dashed border-outline-variant">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          </div>
        </div>

        {/* Filter bar skeleton */}
        <div className="flex items-center gap-3 pt-2 pb-3">
          <Skeleton className="h-9 w-28 rounded-xl shrink-0" />
          <Skeleton className="h-9 w-20 rounded-xl shrink-0" />
          <Skeleton className="h-9 w-24 rounded-xl shrink-0" />
          <Skeleton className="h-9 w-24 rounded-xl shrink-0" />
          <Skeleton className="h-9 w-20 rounded-xl shrink-0" />
        </div>

        {/* Grid skeleton — kartu pertama besar (bento) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="sm:col-span-2">
            <CultureCardSkeleton />
          </div>
          {Array.from({ length: 5 }).map((_, i) => (
            <CultureCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
