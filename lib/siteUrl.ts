// Satu sumber kebenaran untuk URL absolut situs.
//
// Dibutuhkan sitemap.xml, robots.txt, dan `metadataBase` — ketiganya harus
// memancarkan URL absolut, sementara komponen Next lainnya cukup dengan path
// relatif. Urutan resolusinya sengaja begini:
//
//   1. NEXT_PUBLIC_SITE_URL — isi ini di Vercel kalau situs sudah punya domain
//      sendiri (mis. https://jawaraobira.id). Paling eksplisit, paling menang.
//   2. VERCEL_PROJECT_PRODUCTION_URL — diisi Vercel otomatis dengan domain
//      produksi project (tanpa skema), jadi deploy tetap menghasilkan sitemap
//      yang benar walau langkah 1 terlupakan.
//   3. localhost — supaya `npm run dev` dan `npm run build` lokal tidak pecah.
//
// JANGAN hardcode domain di tempat lain; kalau domainnya berubah, satu-satunya
// baris yang perlu disentuh ada di sini (atau cukup env var-nya saja).
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/+$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/+$/, "")}`;

  return "http://localhost:3000";
}
