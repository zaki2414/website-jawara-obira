// app/galeri/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

function GaleriCardSkeleton({ tall = false }: { tall?: boolean }) {
  return (
    <div className="break-inside-avoid mb-6 bg-background border-2 border-on-surface rounded-xl overflow-hidden hard-shadow">
      <Skeleton className={`w-full rounded-none border-b-2 border-on-surface ${tall ? "h-72" : "h-48"}`} />
      <div className="p-5 space-y-2.5">
        <Skeleton className="h-5 w-20 rounded-md" />
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-full rounded-md" />
      </div>
    </div>
  );
}

export default function GaleriLoading() {
  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Hero skeleton */}
      <section className="relative bg-tertiary border-b-4 border-on-surface min-h-[45vh] flex items-center overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-24 z-10 w-full space-y-6">
          <Skeleton className="h-8 w-40 rounded-full" />
          <Skeleton className="h-16 w-full max-w-lg rounded-md" />
          <Skeleton className="h-16 w-2/3 max-w-md rounded-md" />
          <Skeleton className="h-5 w-full max-w-xl rounded-md" />
        </div>
      </section>

      {/* Grid skeleton */}
      <section className="relative bg-natural-paper py-16 md:py-24 px-6 border-b-4 border-on-surface">
        <div className="max-w-7xl mx-auto">
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
            {[true, false, false, false, true, false].map((tall, i) => (
              <GaleriCardSkeleton key={i} tall={tall} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
