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

// Rotasi 3-warna (primary/tertiary/cream) untuk kartu Program Kerja — semua
// proker dalam satu grid yang sama dirotasi bersama (tidak dikelompokkan per
// desa seperti Tim). Satu objek per warna supaya border kartu DAN tag metrik
// dampak di dalamnya selalu aksen yang sama (bukan border ikut rotasi tapi
// tag-nya tetap primary terus). Pasangan warna chip sama dengan
// BUSINESS_ACCENT_STYLES di constants/umkm.ts (sudah divalidasi kontras).
export const PROKER_CARD_ACCENTS = [
  { border: "border-primary", chip: "bg-primary/10 border-primary/30 text-primary" },
  { border: "border-tertiary", chip: "bg-tertiary/15 border-tertiary/40 text-on-tertiary" },
  { border: "border-cream", chip: "bg-cream/40 border-on-surface/20 text-on-surface" },
] as const;
