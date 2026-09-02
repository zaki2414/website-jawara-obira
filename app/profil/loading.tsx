// app/profil/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="px-6 py-20 md:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <Skeleton className="mx-auto mb-4 h-4 w-40 rounded-full" />
          <Skeleton className="mx-auto mb-3 h-12 w-3/4 rounded-lg" />
          <Skeleton className="mx-auto h-4 w-2/3 rounded-full" />
        </div>
      </div>

      <section className="border-b-4 border-on-surface bg-natural-paper px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="h-[60vh] min-h-96 w-full rounded-2xl" />
        </div>
      </section>

      <section className="border-b-4 border-on-surface px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          <Skeleton className="mb-2 h-4 w-40 rounded-full" />
          <Skeleton className="mb-3 h-8 w-2/3 rounded-lg" />
          <Skeleton className="mb-8 h-4 w-full max-w-2xl rounded-full" />
          <Skeleton className="h-[70vh] min-h-100 w-full rounded-2xl" />
        </div>
      </section>
    </main>
  );
}
