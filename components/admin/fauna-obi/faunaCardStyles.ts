// 4 variasi BORDER krem (gradasi cream) yang dirotasi per kartu (index di
// grid) — paralel dengan KKN_ACCENT_BORDERS (biru) dan BUDAYA_ACCENT_BORDERS
// (kuning/tertiary), tapi dari keluarga CREAM karena kotak menu "Manajemen
// Fauna" di dashboard admin berwarna cream.
//
// Token cream/cream-container/on-cream ditambahkan ke app/globals.css khusus
// untuk ini — sebelumnya cuma ada SATU nilai cream (tanpa container/on-*),
// tidak cukup untuk 4 variasi. Kontras teks sudah divalidasi manual (WCAG):
// - cream (L≈0.66) + on-cream (L≈0.07) → ~5.75:1
// - cream-container (L≈0.82, lebih terang dari cream) + on-cream → ~7:1
export const FAUNA_ACCENT_BORDERS = [
  "border-cream",
  "border-on-cream",
  "border-cream-container",
  "border-t-cream border-l-cream border-b-on-cream border-r-on-cream",
] as const;
