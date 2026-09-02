// app/admin/umkm/[id]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminUMKMFormLoading() {
  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-4 border-on-surface bg-background p-7 hard-shadow-lg sm:p-9">
          <Skeleton className="mb-4 h-4 w-64 rounded-full" />
          <Skeleton className="mb-3 h-10 w-1/2 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-full" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2">
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-3 w-24 rounded-full" />
                  <Skeleton className="h-11 w-full rounded-lg" />
                </div>
              ))}
            </div>
            <Skeleton className="h-11 w-full rounded-lg" />
            <Skeleton className="h-16 w-full rounded-lg" />
            <Skeleton className="h-24 w-full rounded-lg" />
            <Skeleton className="h-28 w-full rounded-xl" />
            <div className="space-y-2 border-t-2 border-dashed border-outline-variant pt-6">
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="h-11 w-full rounded-lg" />
            </div>
            <div className="space-y-2 border-t-2 border-dashed border-outline-variant pt-6">
              <Skeleton className="h-4 w-40 rounded-full" />
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </div>
            <div className="grid gap-4 border-t-2 border-dashed border-outline-variant pt-6 md:grid-cols-2">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-32 w-full rounded-xl" />
            </div>
            <div className="flex gap-4 border-t-2 border-dashed border-outline-variant pt-4">
              <Skeleton className="h-11 w-36 rounded-xl" />
              <Skeleton className="h-11 w-28 rounded-xl" />
            </div>
          </div>

          <Skeleton className="min-h-72 rounded-2xl border-2 border-on-surface lg:col-span-1" />
        </div>
      </div>
    </main>
  );
}
