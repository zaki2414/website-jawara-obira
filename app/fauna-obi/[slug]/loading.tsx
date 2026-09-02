// app/fauna-obi/[slug]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function FaunaDetailLoading() {
  return (
    <article className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="space-y-6 mb-10">
          <Skeleton className="h-5 w-56 rounded-md" />
          <Skeleton className="w-full h-72 md:h-115 rounded-2xl" />
        </div>

        <div className="grid md:grid-cols-12 md:gap-10 items-start">
          <div className="md:col-span-8 space-y-6">
            <div className="bg-background p-6 md:p-8 border-2 border-on-surface rounded-2xl hard-shadow-sm space-y-5">
              <Skeleton className="h-7 w-56 rounded-md" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
                <Skeleton className="h-16 rounded-lg" />
              </div>
            </div>
            <div className="bg-background p-6 md:p-8 border-2 border-on-surface rounded-2xl hard-shadow-sm space-y-3">
              <Skeleton className="h-7 w-48 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-2/3 rounded-md" />
            </div>
          </div>

          <div className="md:col-span-4 mt-6 md:mt-0">
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    </article>
  );
}
