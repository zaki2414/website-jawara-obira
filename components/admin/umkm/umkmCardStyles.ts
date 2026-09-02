// 4 variasi BORDER krem (gradasi cream) yang dirotasi per kartu
// (index di grid) — paralel dengan BERITA_ACCENT_BORDERS/FAUNA_ACCENT_BORDERS,
// karena kotak menu "Manajemen UMKM" di dashboard admin berwarna cream
// (lihat accent: "cream" di constants/admin.ts). Sengaja file terpisah
// (bukan reuse langsung dari folder lain) supaya domain umkm tidak
// bergantung ke modul bernama domain lain.
export const UMKM_ACCENT_BORDERS = [
  "border-cream",
  "border-on-cream",
  "border-cream-container",
  "border-t-cream border-l-cream border-b-on-cream border-r-on-cream",
] as const;

// UMKM tanpa desa spesifik ("Umum / Tidak Spesifik" di form) ditampilkan
// sebagai 2 tag terpisah (Kawasi + Soligi), konsisten dengan
// getCultureVillageTags/getVillageTags — desa adalah dua entitas berbeda,
// jangan disatukan jadi satu string.
export function getUMKMVillageTags(villageLabel?: string | null): string[] {
  if (!villageLabel) return ["Kawasi", "Soligi"];
  return [villageLabel];
}
