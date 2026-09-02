// app/budaya/[slug]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function CultureDetailLoading() {
  return (
    <article className="relative bg-background py-12 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* Top nav row */}
        <div className="flex items-center justify-between mb-10 border-b border-dashed border-on-surface/10 pb-4">
          <Skeleton className="h-5 w-56 rounded-md" />
          <Skeleton className="hidden md:block h-9 w-48 rounded-xl" />
        </div>

        {/* Hero banner */}
        <Skeleton className="w-full h-64 md:h-112.5 rounded-2xl mb-16" />

        {/* Desktop content grid */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-16 md:items-start mt-6">
          <div className="md:col-span-7 space-y-8">
            <Skeleton className="h-8 w-40 rounded-full" />
            <Skeleton className="h-12 w-full rounded-md" />
            <Skeleton className="h-12 w-2/3 rounded-md" />
            <Skeleton className="h-14 w-full max-w-md rounded-2xl" />
            <div className="space-y-3 pt-4">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-5/6 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>
          </div>
          <div className="md:col-span-5 space-y-6 pl-6">
            <Skeleton className="w-[82%] aspect-4/5 rounded-2xl" />
          </div>
        </div>

        {/* Mobile stack */}
        <div className="md:hidden space-y-8 mt-6">
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-10 w-full rounded-md" />
          <Skeleton className="h-14 w-full rounded-2xl" />
          <Skeleton className="w-full aspect-4/3 rounded-2xl" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-full rounded-md" />
            <Skeleton className="h-4 w-2/3 rounded-md" />
          </div>
        </div>
      </div>
    </article>
  );
}
