// 4 variasi BORDER kuning/emas (gradasi tertiary) yang dirotasi per kartu
// (index di grid) — paralel dengan KKN_ACCENT_BORDERS/PETA_ACCENT_BORDERS,
// karena kotak menu "Galeri Foto" di dashboard admin JUGA berwarna tertiary
// (satu keluarga aksen dengan KKN Hub/Peta Fasilitas). Sengaja file terpisah
// (bukan reuse langsung dari folder lain) supaya domain foto tidak
// bergantung ke modul bernama domain lain.
export const FOTO_ACCENT_BORDERS = [
  "border-tertiary",
  "border-on-tertiary",
  "border-tertiary-container",
  "border-t-tertiary border-l-tertiary border-b-on-tertiary border-r-on-tertiary",
] as const;
