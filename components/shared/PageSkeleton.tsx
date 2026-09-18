import { Skeleton } from "@/components/ui/skeleton";

/**
 * KERANGKA MUAT UNTUK HALAMAN DAFTAR.
 *
 * Skeleton hanya berguna kalau bentuknya benar-benar bentuk halaman yang akan
 * muncul. Versi sebelumnya masih menggambar hero DUA PANEL bersebelahan
 * (kolom judul + kolom statistik) — susunan yang sudah lama diganti — jadi
 * setiap kali halaman dimuat, pembaca melihat kerangka satu layout lalu
 * mendapat layout yang sama sekali lain. Itu lebih buruk daripada tidak ada
 * skeleton sama sekali, karena tata letaknya "melompat" tepat saat konten
 * datang.
 *
 * Bentuk di bawah mengikuti susunan yang berlaku sekarang: band hero berwarna
 * satu bidang (label → judul → garis aksen → lead → strip angka), lalu bar
 * filter, lalu grid kartu.
 */

type ListingSkeletonProps = {
  /** Warna band hero, mis. "bg-tertiary". Disamakan dengan tone halamannya
   *  supaya warna yang muncul saat memuat sudah warna yang benar. */
  heroField?: string;
  /** Ground di bawah hero. */
  ground?: string;
  /** Jumlah kartu contoh. */
  cards?: number;
  /** Apakah halaman punya bar pencarian (kotak tinggi) atau chip. */
  filter?: "search" | "chips" | "none";
  /** Jumlah angka di strip statistik hero. */
  stats?: number;
};

export function ListingSkeleton({
  heroField = "bg-surface-container",
  ground = "bg-natural-paper",
  cards = 6,
  filter = "search",
  stats = 3,
}: ListingSkeletonProps) {
  return (
    <div>
      {/* ── BAND HERO ── */}
      <section className={`relative overflow-hidden border-b-4 border-on-surface ${heroField}`}>
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
          <Skeleton className="h-4 w-44 rounded-full bg-on-surface/10" />
          <div className="mt-6 space-y-3">
            <Skeleton className="h-12 w-72 max-w-full rounded-lg bg-on-surface/10 md:h-16" />
            <Skeleton className="h-12 w-96 max-w-full rounded-lg bg-on-surface/10 md:h-16" />
          </div>
          <Skeleton className="mt-7 h-1 w-20 rounded-none bg-on-surface/20" />
          <div className="mt-7 space-y-2">
            <Skeleton className="h-4 w-full max-w-xl rounded-md bg-on-surface/10" />
            <Skeleton className="h-4 w-2/3 max-w-md rounded-md bg-on-surface/10" />
          </div>

          {stats > 0 && (
            <div className="mt-12 flex flex-wrap gap-x-10 gap-y-6 border-t-2 border-on-surface/20 pt-6">
              {Array.from({ length: stats }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-10 w-16 rounded-md bg-on-surface/10 md:h-12" />
                  <Skeleton className="h-3 w-24 rounded-md bg-on-surface/10" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ISI ── */}
      <section
        className={`relative ${ground} min-h-screen overflow-hidden border-b-4 border-on-surface px-4 py-10 sm:px-6 md:px-8 md:py-16`}
      >
        <div className="relative z-10 mx-auto max-w-7xl space-y-8">
          {filter === "search" && (
            <div className="flex flex-col gap-3 rounded-2xl border-4 border-on-surface bg-background p-3 hard-shadow sm:flex-row sm:items-center">
              <Skeleton className="h-12 flex-1 rounded-xl" />
              <Skeleton className="h-12 rounded-xl sm:w-56" />
              <Skeleton className="h-12 w-32 rounded-xl" />
            </div>
          )}

          {filter === "chips" && (
            <div className="flex gap-2 overflow-hidden pb-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-11 w-28 shrink-0 rounded-xl" />
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {Array.from({ length: cards }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/** Satu kartu — bentuknya mengikuti EntityCardShell: gambar, strip aksen,
 *  lalu blok keterangan. */
export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border-2 border-on-surface bg-background hard-shadow">
      <Skeleton className="h-56 w-full rounded-none border-b-2 border-on-surface" />
      <Skeleton className="h-1.5 w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-6">
        <Skeleton className="h-5 w-24 rounded-full" />
        <Skeleton className="h-7 w-full rounded-md" />
        <Skeleton className="h-7 w-3/4 rounded-md" />
        <div className="mt-auto border-t-2 border-dashed border-outline-variant pt-3">
          <Skeleton className="h-4 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}
