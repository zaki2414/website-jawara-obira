import type { LucideIcon } from "lucide-react";
import { PageOrnament, PaperTexture, type OrnamentMotif } from "@/components/shared/PageOrnament";

export type HeroTone =
  | "budaya"
  | "umkm"
  | "fauna"
  | "toga"
  | "galeri"
  | "kkn"
  | "kkn-tim"
  | "kkn-jurnal";

type HeroStat = { value: string | number; label: string };

type PageHeroProps = {
  tone: HeroTone;
  /** Label kecil di atas judul — penanda arsip, bukan hiasan. */
  label: string;
  Icon?: LucideIcon;
  title: string;
  /** Baris kedua judul, dicetak dengan warna aksen. */
  titleAccent?: string;
  lead: string;
  /** Strip angka mendatar di bawah lead. Kosongkan bila halaman tidak punya
   *  angka yang layak ditonjolkan. */
  stats?: HeroStat[];
  motif?: OrnamentMotif;
  /**
   * Figur instrumen khas halaman ini (lihat components/shared/HeroFigures.tsx).
   * Mengikuti pola kompas di hero /profil: bentuk yang menjelaskan isi
   * halamannya, bukan hiasan yang bisa ditukar antar halaman.
   */
  figure?: React.ReactNode;
};

// Tiap domain mendapat BIDANG WARNA-nya sendiri. Ini satu-satunya sumber
// perbedaan identitas antar-hero sekarang, jadi kombinasinya sengaja dijaga
// agar tidak ada dua halaman yang kembar.
const TONE: Record<
  HeroTone,
  { field: string; text: string; accent: string; rule: string; divider: string }
> = {
  budaya: {
    field: "bg-tertiary",
    text: "text-on-tertiary",
    accent: "text-primary",
    rule: "bg-primary",
    divider: "border-on-tertiary/30",
  },
  umkm: {
    field: "bg-primary",
    text: "text-on-primary",
    accent: "text-tertiary",
    rule: "bg-tertiary",
    divider: "border-on-primary/30",
  },
  fauna: {
    field: "bg-primary-container",
    text: "text-on-primary-container",
    accent: "text-primary",
    rule: "bg-primary",
    divider: "border-on-primary-container/30",
  },
  toga: {
    field: "bg-herbal",
    text: "text-on-herbal",
    accent: "text-tertiary",
    rule: "bg-tertiary",
    divider: "border-on-herbal/30",
  },
  galeri: {
    field: "bg-on-surface",
    text: "text-background",
    accent: "text-tertiary",
    rule: "bg-tertiary",
    divider: "border-background/25",
  },
  kkn: {
    field: "bg-primary",
    text: "text-on-primary",
    accent: "text-tertiary",
    rule: "bg-tertiary",
    divider: "border-on-primary/30",
  },
  "kkn-tim": {
    field: "bg-cream-container",
    text: "text-on-surface",
    accent: "text-primary",
    rule: "bg-primary",
    divider: "border-on-surface/25",
  },
  "kkn-jurnal": {
    field: "bg-tertiary-container",
    text: "text-on-tertiary",
    accent: "text-primary",
    rule: "bg-primary",
    divider: "border-on-tertiary/30",
  },
};

/**
 * HERO HALAMAN — SATU BIDANG WARNA, TANPA KOTAK.
 *
 * Menggantikan pola lama yang dipakai SETIAP halaman daftar: dua kotak
 * bersebelahan, kiri berisi judul halaman, kanan berisi angka dan keterangan.
 * Tiga alasan pola itu dibuang:
 *
 * 1. Ia membuat tujuh halaman berbeda terbaca sebagai halaman yang sama.
 *    Yang berganti hanya teks dan warna di dalam kerangka yang identik, jadi
 *    berpindah antar-halaman tidak terasa seperti berpindah tempat.
 * 2. Kotak kanan memaksa informasi sekunder tampil sekeras judulnya sendiri.
 *    Angka "6 dokumentasi" tidak pernah sepenting nama halamannya, tapi
 *    diberi panel setara — jadi tidak ada jalur baca yang jelas.
 * 3. Dua panel bertepi tebal di dalam satu band berwarna berarti tiga lapis
 *    bingkai bersarang sebelum pembaca sampai ke satu kalimat pun.
 *
 * Gantinya mengikuti cara /profil bekerja — yang memang disukai: teks duduk
 * LANGSUNG di atas bidang warna, mengalir dari label kecil ke judul besar ke
 * paragraf, lalu angka-angkanya turun jadi strip mendatar tipis yang dipisah
 * garis. Tidak ada kotak sama sekali, dan hierarkinya jelas dari atas ke bawah.
 */
export function PageHero({
  tone,
  label,
  Icon,
  title,
  titleAccent,
  lead,
  stats = [],
  motif = 2,
  figure,
}: PageHeroProps) {
  const t = TONE[tone];

  return (
    <section
      className={`relative overflow-hidden border-b-4 border-on-surface ${t.field} ${t.text}`}
    >
      <PaperTexture opacity={0.06} />
      {/* Ornamen di sini lebih besar & lebih pekat daripada di badan halaman:
          ia berperan sebagai elemen grafis hero (seperti mawar kompas di
          /profil), bukan sekadar tekstur latar. */}
      <PageOrnament motif={motif} placement="top-right" size="xl" opacity={0.1} />
      {figure}

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24 lg:pr-[36%]">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />}
          <span className="text-label-sm font-black uppercase tracking-[0.2em]">{label}</span>
        </div>

        <h1 className="mt-6 font-serif text-5xl sm:text-6xl md:text-7xl font-black leading-[0.95] tracking-[-0.03em] text-balance max-w-[18ch]">
          {title}
          {titleAccent && <span className={`block ${t.accent}`}>{titleAccent}</span>}
        </h1>

        <div className={`mt-7 h-1 w-20 ${t.rule}`} aria-hidden="true" />

        <p className="mt-7 max-w-[58ch] text-body-lg leading-relaxed opacity-90">{lead}</p>

        {stats.length > 0 && (
          /* Strip angka mendatar — dipisah garis vertikal, bukan dikotaki.
             Ini yang menggantikan panel kanan: informasinya tetap ada, tapi
             bobot visualnya kembali ke tempat yang benar, di bawah judul. */
          <dl
            className={`mt-12 flex flex-wrap items-end gap-x-10 gap-y-6 border-t-2 ${t.divider} pt-6`}
          >
            {stats.map((stat) => (
              <div key={stat.label} className="min-w-24">
                <dd className="font-serif text-4xl md:text-5xl font-black leading-none tabular">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 text-label-sm font-black uppercase tracking-[0.14em] opacity-75">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
