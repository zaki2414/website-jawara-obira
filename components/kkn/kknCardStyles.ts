import type { Variants } from "framer-motion";

// Animasi masuk kartu KKN Tim/Proker — bentuknya sama persis dengan
// faunaCardVariants/umkmCardVariants (constants/fauna.ts, constants/umkm.ts),
// didefinisikan ulang di sini (bukan diimpor lintas domain) supaya domain
// kkn tidak bergantung ke modul domain lain.
export const kknCardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: Math.min(i * 0.08, 0.4),
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

// 3 variasi border biru (primary) untuk kartu anggota Desa Kawasi, 3 variasi
// kuning/emas (tertiary) untuk Desa Soligi — dirotasi per index DALAM
// masing-masing kelompok desa (bukan lintas keduanya), sesuai permintaan
// eksplisit. Pola warna sama dengan *_ACCENT_BORDERS di components/admin/,
// tapi cuma 3 varian (bukan 4) karena tidak butuh varian "bevel" split-warna
// untuk kartu publik yang lebih sederhana ini.
export const KAWASI_TEAM_ACCENT_BORDERS = [
  "border-primary",
  "border-on-primary-container",
  "border-primary-container",
] as const;

export const SOLIGI_TEAM_ACCENT_BORDERS = [
  "border-tertiary",
  "border-on-tertiary",
  "border-tertiary-container",
] as const;

/**
 * AKSEN KARTU ANGGOTA — SATU WARNA, DIPAKAI DI SEMUA BAGIAN KARTU.
 *
 * Sebelumnya rotasi warna hanya menyentuh BORDER, sementara chip klaster dan
 * warna hover selalu memakai primary/tertiary yang sama untuk semua kartu.
 * Akibatnya sebuah kartu bisa bertepi biru muda tapi chip-nya biru tua dan
 * hover-nya biru tua juga — warnanya jadi terbaca acak, bukan sebagai satu
 * identitas kartu.
 *
 * Sekarang tiap entri di bawah adalah SATU aksen utuh: border, strip di bawah
 * foto, chip klaster, dan warna judul saat hover semuanya diambil dari objek
 * yang sama. Jadi kalau sebuah kartu "biru muda", ia biru muda di seluruh
 * bagiannya.
 *
 * Kawasi memakai keluarga biru, Soligi memakai keluarga kuning — pembagian
 * yang memang disengaja supaya desa bisa dibedakan sekilas.
 */
export type TeamCardAccent = {
  border: string;
  bar: string;
  chip: string;
  hoverTitle: string;
};

export const KAWASI_TEAM_ACCENTS: readonly TeamCardAccent[] = [
  {
    border: "border-primary",
    bar: "bg-primary",
    chip: "bg-primary text-on-primary",
    hoverTitle: "group-hover:text-primary",
  },
  {
    border: "border-on-primary-container",
    bar: "bg-on-primary-container",
    chip: "bg-on-primary-container text-on-primary",
    hoverTitle: "group-hover:text-on-primary-container",
  },
  {
    border: "border-primary-container",
    bar: "bg-primary-container",
    chip: "bg-primary-container text-on-primary-container",
    hoverTitle: "group-hover:text-primary-container",
  },
] as const;

export const SOLIGI_TEAM_ACCENTS: readonly TeamCardAccent[] = [
  {
    border: "border-tertiary",
    bar: "bg-tertiary",
    chip: "bg-tertiary text-on-tertiary",
    hoverTitle: "group-hover:text-on-tertiary",
  },
  {
    border: "border-on-tertiary",
    bar: "bg-on-tertiary",
    chip: "bg-on-tertiary text-tertiary-container",
    hoverTitle: "group-hover:text-on-tertiary",
  },
  {
    border: "border-tertiary-container",
    bar: "bg-tertiary-container",
    chip: "bg-tertiary-container text-on-tertiary",
    hoverTitle: "group-hover:text-on-tertiary",
  },
] as const;

// Rotasi 3-warna (primary/tertiary/cream) untuk kartu Program Kerja — semua
// proker dalam satu grid yang sama dirotasi bersama (tidak dikelompokkan per
// desa seperti Tim). Satu objek per warna supaya border kartu DAN angka metrik
// dampak di dalamnya selalu aksen yang sama (bukan border ikut rotasi tapi
// angkanya tetap primary terus).
//
// `metricValue` menggantikan `chip` yang lama: metrik tidak lagi tampil
// sebagai pil kecil "Label: nilai", melainkan angka besar dengan label di
// bawahnya, jadi yang dibutuhkan cuma warna teksnya.
//
// Kartu beraksen emas memakai on-tertiary (#423A21), BUKAN tertiary (#FEBE00).
// Kuning itu hanya ~1.7:1 di atas kertas #fef9f2 — tidak terbaca sebagai
// angka. on-tertiary ≈ 11:1, primary ≈ 6.5:1, on-surface ≈ 16:1.
// `hoverTitle` mengikuti pola BUSINESS_ACCENT_STYLES.hoverText di
// constants/umkm.ts — judul kartu berubah ke warna aksen kartunya sendiri
// saat kursor masuk. Kelasnya sengaja LITERAL (bukan dirakit runtime seperti
// `group-hover:${text}`), karena Tailwind memindai kelas dari teks sumber dan
// tidak pernah melihat kelas yang baru dibentuk saat render.
//
// Nilainya diambil dari keluarga warna yang sama dengan UMKM, tapi memakai
// anggota keluarga yang TERBACA di atas kertas kartu (#fef9f2). Nilai harfiah
// UMKM tidak dipakai untuk dua aksen karena kontrasnya jatuh:
//   primary-container #51b8ea -> 2.13:1   (UMKM primary.hoverText)
//   tertiary          #FEBE00 -> 1.59:1   (UMKM tertiary.hoverText)
// Judul yang di-hover jadi nyaris hilang. Penggantinya sewarna keluarga:
//   primary     #006689 -> 6.15:1
//   on-tertiary #423A21 -> 10.78:1
//   on-cream    #5C4A2E -> 8.10:1  (sama persis dengan UMKM, sudah terbaca)
export const PROKER_CARD_ACCENTS = [
  {
    border: "border-primary",
    bar: "bg-primary",
    metricValue: "text-primary",
    hoverTitle: "group-hover:text-primary",
  },
  {
    border: "border-tertiary",
    bar: "bg-tertiary",
    metricValue: "text-on-tertiary",
    hoverTitle: "group-hover:text-on-tertiary",
  },
  {
    border: "border-cream",
    bar: "bg-cream",
    metricValue: "text-on-surface",
    hoverTitle: "group-hover:text-on-cream",
  },
] as const;
