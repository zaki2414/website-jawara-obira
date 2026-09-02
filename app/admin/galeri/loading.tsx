// app/admin/galeri/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminGalleryLoading() {
  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-4 border-on-surface bg-background p-7 hard-shadow-lg sm:p-9">
          <Skeleton className="mb-4 h-4 w-56 rounded-full" />
          <Skeleton className="mb-3 h-10 w-2/3 rounded-lg" />
          <Skeleton className="h-4 w-72 rounded-full" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <Skeleton className="h-20 w-full rounded-lg" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <Skeleton className="min-h-72 rounded-2xl border-2 border-on-surface lg:col-span-1" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <Skeleton className="mb-2 h-7 w-48 rounded-lg" />
        <Skeleton className="h-4 w-56 rounded-full" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-2xl border-2 border-on-surface bg-background hard-shadow-sm"
            >
              <Skeleton className="h-48 rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-5 w-3/4 rounded-md" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
