// 4 variasi BORDER krem (gradasi cream) yang dirotasi per kartu (index di
// grid) — paralel dengan FAUNA_ACCENT_BORDERS/FOTO_ACCENT_BORDERS, karena
// kotak menu "Manajemen Toga" di dashboard admin JUGA berwarna cream
// (accent: "cream" di constants/admin.ts), satu keluarga aksen dengan
// Fauna Obi & Galeri. Sengaja file terpisah (bukan reuse langsung dari
// folder fauna-obi/foto) supaya domain toga tidak bergantung ke modul
// bernama domain lain.
export const TOGA_ACCENT_BORDERS = [
  "border-cream",
  "border-on-cream",
  "border-cream-container",
  "border-t-cream border-l-cream border-b-on-cream border-r-on-cream",
] as const;
