// app/admin/kkn/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function KKNAdminHubLoading() {
  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl border-4 border-on-surface bg-background p-7 hard-shadow-lg sm:p-9">
          <Skeleton className="mb-4 h-4 w-48 rounded-full" />
          <Skeleton className="mb-3 h-10 w-2/3 rounded-lg" />
          <Skeleton className="h-4 w-64 rounded-full" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-12">
          <Skeleton className="mb-4 h-6 w-48 rounded-md" />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border-2 border-on-surface bg-background p-5 hard-shadow-sm"
              >
                <Skeleton className="size-11 shrink-0 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-12 rounded-md" />
                  <Skeleton className="h-3 w-24 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Skeleton className="mb-4 h-6 w-56 rounded-md" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:auto-rows-[minmax(170px,auto)]">
            <Skeleton className="min-h-56 rounded-2xl border-2 border-on-surface md:col-span-2 md:row-span-2" />
            <Skeleton className="min-h-40 rounded-2xl border-2 border-on-surface" />
            <Skeleton className="min-h-40 rounded-2xl border-2 border-on-surface" />
          </div>
        </section>
      </div>
    </main>
  );
}
