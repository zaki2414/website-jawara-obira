import { PageOrnament, PaperTexture, type OrnamentMotif } from "@/components/shared/PageOrnament";

type AnimatedBackgroundVariant = "orbs" | "orbs-particles" | "scroll-parallax" | "scroll-glow";

type AnimatedBackgroundProps = {
  /**
   * Nama varian dipertahankan supaya pemanggil lama tidak perlu diubah, meski
   * isinya sudah lama bukan "orb" — dan sejak revisi ini juga tidak lagi
   * beranimasi sama sekali.
   */
  variant?: AnimatedBackgroundVariant;
};

const VARIANT_CONFIG: Record<
  AnimatedBackgroundVariant,
  { motif: OrnamentMotif; placement: "top-right" | "bottom-left" | "bottom-right" | "right-center"; size: "lg" | "xl"; opacity: number; counter?: OrnamentMotif }
> = {
  orbs: { motif: 4, placement: "top-right", size: "lg", opacity: 0.06 },
  "orbs-particles": { motif: 2, placement: "bottom-left", size: "xl", opacity: 0.065, counter: 3 },
  "scroll-parallax": { motif: 2, placement: "right-center", size: "xl", opacity: 0.06 },
  "scroll-glow": { motif: 1, placement: "bottom-right", size: "xl", opacity: 0.05 },
};

/**
 * Lapisan latar dekoratif — sekarang Server Component murni.
 *
 * Riwayat file ini merekam dua kesalahan berturut-turut: mula-mula ia berisi
 * orb gradien blur + partikel mengambang (dekorasi generik yang bisa ditempel
 * ke situs mana pun), lalu diganti motif kompas yang MASIH berputar dan
 * bergeser mengikuti scroll. Keduanya salah untuk alasan yang sama — halaman
 * arsip tidak butuh latar yang bergerak sendiri.
 *
 * Yang tersisa sekarang hanya dua hal yang memang punya asal-usul pada benda
 * cetak: raster titik dan satu cap ornamen yang terpotong tepi.
 */
export function AnimatedBackground({ variant = "orbs-particles" }: AnimatedBackgroundProps) {
  const cfg = VARIANT_CONFIG[variant];

  return (
    <>
      <PaperTexture opacity={0.04} />
      <PageOrnament
        motif={cfg.motif}
        placement={cfg.placement}
        size={cfg.size}
        opacity={cfg.opacity}
        marks={3}
        counterMotif={cfg.counter ?? 1}
      />
    </>
  );
}
