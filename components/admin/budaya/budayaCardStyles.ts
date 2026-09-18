// 4 variasi BORDER biru (gradasi primary) yang dirotasi per kartu (index di
// grid) — paralel dengan KKN_ACCENT_BORDERS/PETA_ACCENT_BORDERS, karena
// kotak menu "Manajemen Budaya" di dashboard
// admin sekarang berwarna primary (accent: "primary" di constants/admin.ts).
export const BUDAYA_ACCENT_BORDERS = [
  "border-primary",
  "border-on-primary-container",
  "border-primary-container",
  "border-t-primary border-l-primary border-b-on-primary-container border-r-on-primary-container",
] as const;

// Desa asal artikel budaya TETAP tampil sebagai 2 tag terpisah (Kawasi +
// Soligi) kalau tidak spesifik satu desa — konsisten dengan getVillageTags di
// components/admin/kkn/kknCardStyles.ts, desa adalah dua entitas berbeda,
// jangan disatukan. Terima LABEL yang sudah di-resolve (nama desa), bukan
// slug — daftar (getAllCulture) sudah mengembalikan villages.name langsung,
// sedangkan form perlu memetakan slug ("kawasi"/"soligi") ke label dulu
// sebelum memanggil ini, supaya satu fungsi berlaku untuk kedua sumber data.
export function getCultureVillageTags(villageLabel?: string | null): string[] {
  if (!villageLabel) return ["Kawasi", "Soligi"];
  return [villageLabel];
}
