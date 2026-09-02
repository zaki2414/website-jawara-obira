// app/umkm/[slug]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function UMKMDetailLoading() {
  return (
    <article className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <div className="relative max-w-6xl mx-auto px-6 space-y-12 z-10">
        <Skeleton className="h-5 w-24 rounded-md" />

        <Skeleton className="w-full h-72 md:h-105 rounded-2xl" />

        <div className="grid md:grid-cols-3 gap-10 items-start">
          <div className="md:col-span-2 space-y-10">
            <div className="bg-background p-8 border-2 border-on-surface rounded-2xl hard-shadow-sm space-y-6">
              <Skeleton className="h-7 w-48 rounded-md" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-2/3 rounded-md" />
              </div>
            </div>
            <div className="bg-background p-8 border-2 border-on-surface rounded-2xl hard-shadow-sm space-y-6">
              <Skeleton className="h-7 w-56 rounded-md" />
              <div className="grid sm:grid-cols-2 gap-6">
                <Skeleton className="h-24 rounded-md" />
                <Skeleton className="h-24 rounded-md" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-56 rounded-2xl" />
          </div>
        </div>
      </div>
    </article>
  );
}
