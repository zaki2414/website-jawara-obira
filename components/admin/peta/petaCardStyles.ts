// 4 variasi BORDER kuning/emas (gradasi tertiary) yang dirotasi per kartu
// (index di grid) — paralel dengan KKN_ACCENT_BORDERS/FOTO_ACCENT_BORDERS,
// karena kotak menu "Peta Fasilitas" di dashboard admin JUGA berwarna
// tertiary (accent: "tertiary" di constants/admin.ts). Sengaja file
// terpisah (bukan reuse langsung dari folder kkn/foto) supaya domain peta
// tidak bergantung ke modul bernama domain lain.
export const PETA_ACCENT_BORDERS = [
  "border-tertiary",
  "border-on-tertiary",
  "border-tertiary-container",
  "border-t-tertiary border-l-tertiary border-b-on-tertiary border-r-on-tertiary",
] as const;
