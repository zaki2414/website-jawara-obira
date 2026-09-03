// app/(home)/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

// Suspense fallback KHUSUS homepage (route group "(home)" supaya tidak
// menimpa app/loading.tsx generik yang dipakai route lain). Sebelumnya
// homepage jatuh ke app/loading.tsx — kartu spinner ~979px vs konten asli
// ~4700px, jadi begitu data selesai fetch dan konten asli di-stream,
// footer melompat turun ribuan px = CLS 0.307 ("poor") terukur lewat
// Playwright. Fix: skeleton per-section yang tingginya mendekati layout
// asli (lihat kelas section persis sama dengan HeroSection/StatsSection/
// PotensiBento/KKNSection), jadi swap ke konten asli nyaris tidak
// menggeser apa pun. TIDAK render <Footer/> di sini — Footer hidup di
// app/layout.tsx di LUAR {children}, jadi selalu tampil apa adanya
// terlepas dari status Suspense; me-render-nya lagi di sini cuma
// menduplikasi <footer> di DOM (sempat kejadian, sudah diperbaiki).
export default function HomeLoading() {
  return (
    <div className="animate-pulse" aria-hidden="true">
      {/* ─── HERO ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-natural-paper">
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 w-full -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-28">
          <div className="space-y-8">
            <Skeleton className="h-9 w-64 rounded-full" />
            <div className="space-y-3">
              <Skeleton className="h-14 md:h-16 lg:h-20 w-full max-w-2xl rounded-lg" />
              <Skeleton className="h-14 md:h-16 lg:h-20 w-2/3 max-w-xl rounded-lg" />
            </div>
            <div className="space-y-2 max-w-2xl">
              <Skeleton className="h-5 w-full rounded" />
              <Skeleton className="h-5 w-4/5 rounded" />
            </div>
            <div className="flex flex-wrap gap-4 pt-2">
              <Skeleton className="h-14 w-44 rounded-full" />
              <Skeleton className="h-14 w-44 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="relative bg-primary py-24 overflow-hidden border-y-4 border-on-surface">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-natural-paper/20 p-8 rounded-2xl border-4 border-on-surface/20 min-h-55"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ─── POTENSI BENTO ─── */}
      <section className="bg-natural-paper py-24 md:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-16 md:mb-20 max-w-3xl space-y-4">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-11 md:h-14 w-full max-w-xl rounded-lg" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => {
              const isWide = i === 0 || i === 3 || i === 4;
              return (
                <Skeleton
                  key={i}
                  className={`h-64 rounded-2xl ${isWide ? "md:col-span-2" : ""}`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── KKN ─── */}
      <section className="relative bg-primary py-32 border-y-4 border-on-surface overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
            <div className="space-y-8">
              <Skeleton className="h-8 w-48 rounded-full bg-natural-paper/20" />
              <Skeleton className="h-16 md:h-20 w-full rounded-lg bg-natural-paper/20" />
              <div className="space-y-2 max-w-[58ch]">
                <Skeleton className="h-5 w-full rounded bg-natural-paper/20" />
                <Skeleton className="h-5 w-3/4 rounded bg-natural-paper/20" />
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <Skeleton className="h-14 w-52 rounded-full bg-natural-paper/20" />
                <Skeleton className="h-14 w-52 rounded-full bg-natural-paper/20" />
              </div>
            </div>
            <div className="relative h-85" />
          </div>
          <div className="border-t-4 border-dashed border-on-surface/30 pt-16">
            <Skeleton className="h-10 w-72 rounded-lg bg-natural-paper/20 mb-12" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-96 rounded-2xl bg-natural-paper/20" />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
