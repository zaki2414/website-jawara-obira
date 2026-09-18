import type { Variants } from "framer-motion";
import { Shrub, Waves, type LucideIcon } from "lucide-react";

// ==========================================
// TIPE DATA
// ==========================================
export type ProfilBadge = {
  icon: typeof Shrub;
  label: string;
  colorClass: string;
};

// Dipakai bersama oleh VillagePickerMap.tsx, VillageDetailPanel.tsx,
// VillageExplorer.tsx, dan VillageMapSection.tsx (peta kadaster) — satu
// state "desa terpilih" yang sama dipakai di kedua peta pada /profil.
export type VillageKey = "kawasi" | "soligi";

// Konten desa (nama, deskripsi, statistik, foto) sekarang datang dari tabel
// `villages` + `village_statistics` (dikelola admin di /admin/desa) — BUKAN
// hardcode lagi. Yang tetap hardcode di sini cuma hal teknis/desain yang
// tidak masuk akal diedit non-developer: warna badge per desa (badgeColor,
// string — aman diserialisasi lintas Server->Client). Ikon Lucide SENGAJA
// TIDAK ikut di VillageContent — referensi komponen React tidak boleh
// dikirim dari Server Component (app/profil/page.tsx) ke Client Component
// (VillageExplorer/VillageDetailPanel) lewat props (persis catatan
// AdminMenuIconKey di constants/admin.ts). Consumer yang butuh ikon resolve
// sendiri dari VILLAGE_VISUAL_META[village].icon di dalam file "use client"
// masing-masing.
// title/longDesc/highlight SENGAJA tidak ada di sini — kolomnya (`title`,
// `long_description`, `highlight`) tidak pernah dibuat di tabel `villages`,
// jadi tiap kali admin coba simpan (via VillageForm.tsx), Postgrest menolak
// SELURUH update karena satu kolom saja tidak dikenal (PGRST204) — termasuk
// saat yang ingin diubah cuma thumbnail. Tipe & form ini disederhanakan
// supaya cuma memuat kolom yang benar-benar ada.
export type VillageContent = {
  id: VillageKey;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  population: number | null;
  households: number | null;
  hamlets: number | null;
  areaKm2: number | null;
  badgeColor: string;
};

// GSAP (VillagePickerMap.tsx) menganimasikan fill/stroke SVG lewat
// interpolasi warna — ia butuh nilai hex literal (tidak bisa resolve
// var(--color-*)), jadi nilai ini SENGAJA dicerminkan manual dari token di
// app/globals.css. Jaga agar tetap sinkron kalau token warna berubah:
// default -> --color-surface-container-high, hover -> --color-tertiary,
// active -> --color-primary, stroke -> --color-on-surface.
export const MAP_THEME = {
  default: "#ece7e1",
  hover: "#FEBE00",
  active: "#006689",
  stroke: "#1d1c18",
};

// Dipakai di tempat yang cuma butuh label pendek + ikon (mis. tombol toggle
// desa di VillageMapSection.tsx, termasuk versi admin/peta yang TIDAK
// nge-fetch VillageContent penuh) — nama di sini SENGAJA statis (bukan dari
// tabel villages) karena "Kawasi"/"Soligi" adalah identitas rute/slug, bukan
// konten yang wajar diedit non-developer.
export const VILLAGE_VISUAL_META: Record<VillageKey, { name: string; badgeColor: string; icon: LucideIcon }> = {
  kawasi: {
    name: "Desa Kawasi",
    badgeColor: "bg-ocean-100 text-ocean-700 border-ocean-700",
    icon: Waves,
  },
  soligi: {
    name: "Desa Soligi",
    badgeColor: "bg-tropic-100 text-tropic-700 border-tropic-700",
    icon: Shrub,
  },
};

// Bentuk baris mentah dari getAllVillages()/getVillageById() (lib/supabase/
// queries.ts) — `select("*, village_statistics(*)")` tanpa Database generic
// jadi tidak typed ketat dari Supabase; field longgar di sini sekadar
// menangkap bentuknya, bukan sumber kebenaran skema.
type RawVillageRow = {
  slug?: string;
  name?: string;
  description?: string | null;
  thumbnail_url?: string | null;
  village_statistics?:
    | { population?: number | null; households?: number | null; hamlets?: number | null; area_km2?: number | null }
    | { population?: number | null; households?: number | null; hamlets?: number | null; area_km2?: number | null }[]
    | null;
};

// Gabungkan baris DB (konten, bisa null selama admin belum isi) + meta
// visual statis (icon/badgeColor/fallback name) — dipakai app/profil/page.tsx
// SEKALI di server sebelum dikirim ke client components, supaya
// VillageDetailPanel dkk. tidak perlu tahu bentuk mentah hasil join Supabase.
// Selalu mengembalikan KEDUA desa (kawasi & soligi) meski salah satu baris
// DB gagal dimuat, supaya Record<VillageKey, VillageContent> di pemanggil
// tidak pernah punya key yang hilang.
export function mergeVillageContent(rows: RawVillageRow[]): Record<VillageKey, VillageContent> {
  const bySlug = new Map(rows.map((row) => [row.slug, row]));

  const entries = (Object.keys(VILLAGE_VISUAL_META) as VillageKey[]).map((key) => {
    const row = bySlug.get(key);
    const rawStats = row?.village_statistics;
    const stats = Array.isArray(rawStats) ? rawStats[0] : rawStats;
    const meta = VILLAGE_VISUAL_META[key];

    const content: VillageContent = {
      id: key,
      name: row?.name || meta.name,
      slug: key,
      description: row?.description ?? null,
      image: row?.thumbnail_url ?? null,
      population: stats?.population ?? null,
      households: stats?.households ?? null,
      hamlets: stats?.hamlets ?? null,
      areaKm2: stats?.area_km2 ?? null,
      badgeColor: meta.badgeColor,
    };
    return [key, content] as const;
  });

  return Object.fromEntries(entries) as Record<VillageKey, VillageContent>;
}

// ==========================================
// ANIMATION VARIANTS
// ==========================================
export const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

export const titleVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
};

// ==========================================
// STATIC CONTENT
// ==========================================
export const PROFIL_BADGES: ProfilBadge[] = [
  {
    icon: Shrub,
    label: "Biodiversitas & Budaya",
    colorClass: "text-tropic-700",
  },
  {
    icon: Waves,
    label: "Biodiversitas & Budaya",
    colorClass: "text-ocean-700",
  },
];

export const PROFIL_CONTENT = {
  // Judul+deskripsi lengkap SENGAJA tidak ada lagi di sini — dulu ada, tapi
  // isinya duplikat persis dengan HeroSection.tsx ("Bentang Alam Pulau Obi"
  // + deskripsinya membahas hal yang sama). eyebrow dipakai sebagai badge
  // kecil saja di VillageExplorer.tsx, bukan header lengkap.
  eyebrow: "Navigasi Spasial",
  heroEyebrow: "Eksplorasi Wilayah",
  heroTitle: {
    main: "Profil Wilayah",
    italic: "Obira",
  },
  heroDescription:
    "Jelajahi potensi, demografi, dan kearifan lokal Desa Kawasi dan Desa Soligi melalui peta interaktif di bawah ini.",
};