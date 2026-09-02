// 4 variasi BORDER krem (gradasi cream) yang dirotasi per kartu (index di
// grid) — paralel dengan FAUNA_ACCENT_BORDERS/TOGA_ACCENT_BORDERS/
// FOTO_ACCENT_BORDERS, karena kotak menu "Manajemen Berita" di dashboard
// admin sekarang berwarna cream (accent: "cream" di constants/admin.ts).
// Sengaja file terpisah (bukan reuse langsung dari folder fauna-obi) supaya
// domain berita tidak bergantung ke modul bernama domain lain.
export const BERITA_ACCENT_BORDERS = [
  "border-cream",
  "border-on-cream",
  "border-cream-container",
  "border-t-cream border-l-cream border-b-on-cream border-r-on-cream",
] as const;

// Berita tanpa desa spesifik ditampilkan sebagai 2 tag terpisah (Kawasi +
// Soligi), konsisten dengan getJournalVillageTags/getCultureVillageTags —
// desa adalah dua entitas berbeda, jangan disatukan jadi satu string.
export function getNewsVillageTags(villageName?: string | null): string[] {
  if (!villageName) return ["Kawasi", "Soligi"];
  return [villageName];
}
