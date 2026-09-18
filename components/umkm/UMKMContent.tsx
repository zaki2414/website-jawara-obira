import {
  UMKMHeader,
  UMKMSearchForm,
  UMKMGrid,
  UMKMEmptyState,
} from "@/components/umkm";
import { RotatingHiasanBackground } from "@/components/shared/RotatingHiasanBackground";
import type { UMKMItem } from "@/constants/umkm";

type UMKMContentProps = {
  items: UMKMItem[];
  initialQ?: string;
  initialType?: string;
  businessTypeCounts: Record<string, number>;
};

// Server Component: tidak ada state sama sekali di halaman ini — penyaringan
// dijalankan lewat URL (?q=&type=), jadi tiap hasil saringan punya alamat
// sendiri yang bisa dibagikan dan tetap berfungsi tanpa JavaScript.
export default function UMKMContent({
  items,
  initialQ,
  initialType,
  businessTypeCounts,
}: UMKMContentProps) {
  // Bento hanya saat daftar penuh: begitu pengunjung menyaring, kartu
  // berukuran seragam lebih mudah dibandingkan satu sama lain.
  const isBento = !initialQ && (!initialType || initialType === "all");

  return (
    <div>
      <UMKMHeader businessTypeCounts={businessTypeCounts} />

      <section className="relative bg-natural-paper py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
        <RotatingHiasanBackground hiasan={1} density="elegant" />

        <div className="relative max-w-7xl mx-auto z-10 space-y-8">
          <UMKMSearchForm initialQ={initialQ} initialType={initialType} />

          {items.length > 0 ? (
            <UMKMGrid items={items} isBento={isBento} />
          ) : (
            <UMKMEmptyState />
          )}
        </div>
      </section>
    </div>
  );
}
