// 4 variasi BORDER kuning/emas (gradasi tertiary) yang dirotasi per kartu
// (index di grid) — dipakai bersama oleh KKNTeamMemberCard.tsx (+ preview
// kartu di form masing-masing), konsisten dengan kotak menu "KKN Hub" di
// dashboard admin yang sekarang berwarna tertiary (constants/admin.ts).
// Varian ke-4 pakai 2 warna dibagi per sisi (bevel) supaya tetap solid-color
// (bukan gradient tipis yang susah kelihatan di border).
export const KKN_ACCENT_BORDERS = [
  "border-tertiary",
  "border-on-tertiary",
  "border-tertiary-container",
  "border-t-tertiary border-l-tertiary border-b-on-tertiary border-r-on-tertiary",
] as const;

// Jurnal tanpa desa spesifik ("Umum / Kedua Desa") TETAP tampil sebagai 2 tag
// terpisah (Kawasi + Soligi) — konsisten dengan getVillageTags di
// KKNTeamMemberCard.tsx, desa adalah dua entitas berbeda, jangan disatukan.
// Dipakai oleh KKNJournalCalendar.tsx dan KKNJournalForm.tsx (pratinjau).
export function getJournalVillageTags(villageName?: string | null): string[] {
  if (!villageName) return ["Kawasi", "Soligi"];
  return [villageName];
}
