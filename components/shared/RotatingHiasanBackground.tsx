import { PageOrnament, PaperTexture, type OrnamentMotif } from "@/components/shared/PageOrnament";

type RotatingHiasanBackgroundProps = {
  hiasan: OrnamentMotif;
  /**
   * "full" — motif utama + tanda kedua yang lebih kecil di sudut berlawanan,
   * untuk section yang sangat tinggi. "elegant" — satu tanda saja.
   */
  density?: "full" | "elegant";
  /** Sudut tempat tanda utama menggantung. */
  placement?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

/**
 * Nama komponen ini dipertahankan supaya lima pemanggilnya tidak perlu diubah,
 * tapi ORNAMENNYA TIDAK LAGI BERPUTAR.
 *
 * Rotasi abadi dibuang karena bertentangan dengan hal yang ingin dibangun
 * halaman-halaman ini: motif kompas pada lembar arsip adalah sesuatu yang
 * TERCETAK. Begitu ia berputar pelan tanpa henti, ia berhenti terbaca sebagai
 * cetakan dan berubah jadi elemen UI yang bergerak sendiri — dan tiga instance
 * yang berputar bersamaan membuat halaman tidak pernah terasa diam.
 *
 * Efek sampingnya bagus: komponen ini sekarang Server Component murni tanpa
 * animasi, jadi tidak ada lagi keyframe yang berjalan di lima halaman
 * sekaligus bahkan saat ornamennya di luar viewport.
 */
export function RotatingHiasanBackground({
  hiasan,
  density = "full",
  placement = "bottom-right",
}: RotatingHiasanBackgroundProps) {
  // Motif pendamping dipilih yang jelas berbeda bentuknya dari motif utama.
  const counter: OrnamentMotif = ((hiasan % 5) + 1) as OrnamentMotif;

  return (
    <>
      <PaperTexture opacity={0.045} />
      <PageOrnament
        motif={hiasan}
        placement={placement}
        size={density === "full" ? "xl" : "lg"}
        opacity={density === "full" ? 0.065 : 0.055}
        marks={density === "full" ? 3 : 2}
        counterMotif={counter}
      />
    </>
  );
}
