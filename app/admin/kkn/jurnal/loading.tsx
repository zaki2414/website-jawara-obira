// app/admin/kkn/jurnal/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function KKNJournalListLoading() {
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
        <div className="mb-4 flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
          ))}
        </div>

        <Skeleton className="mb-4 h-14 w-full rounded-xl" />

        <div className="mb-2 grid grid-cols-7 gap-1.5 sm:gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full rounded-full" />
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {Array.from({ length: 35 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg sm:h-28 sm:rounded-xl" />
          ))}
        </div>
      </div>
    </main>
  );
}
