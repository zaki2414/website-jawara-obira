import {
  Newspaper, Info, Birdhouse, User, BriefcaseBusiness, Store,
  Bird, Sprout, Palette, Camera,
} from "lucide-react";

// ==========================================
// TYPES
// ==========================================
export type Village = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  location?: string;
};

// Bentuk satu entri di kolom JSONB `documentation` kkn_prokers — sama dengan
// KKNProkerDoc lokal di components/admin/KKNProkerForm.tsx, didefinisikan
// ulang di sini (bukan diimpor) karena itu type form-specific sedangkan ini
// dipakai jalur baca publik (constants/ tidak boleh depend ke components/).
// `image_url` dipertahankan sebagai fallback key untuk data lama yang mungkin
// pernah ditulis dengan nama kolom berbeda.
export type ProkerDocumentation = {
  url?: string;
  image_url?: string;
  caption?: string;
};

export type Proker = {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  image_url?: string;
  impact_metrics?: Record<string, string>;
  documentation?: ProkerDocumentation[] | string | null;
};

export type HomeStats = {
  desa: number;
  penduduk: number;
  proker: number;
  umkm: number;
};

export type KKNStats = {
  jurnal: number;
  proker: number;
};

// ==========================================
// STATIC DATA
// ==========================================
export const POTENSI_DESA = [
  {
    id: 1,
    href: "/fauna-obi",
    icon: Bird,
    title: "Fauna Endemik",
    desc: "Inventarisasi herpetofauna dan satwa endemik yang hanya ada di Pulau Obi.",
    color: "bg-primary",
    accent: "text-on-primary",
    border: "border-on-surface",
  },
  {
    id: 2,
    href: "/toga",
    icon: Sprout,
    title: "Tanaman Obat",
    desc: "Ensiklopedia digital TOGA (Tanaman Obat Keluarga) khas Maluku Utara.",
    color: "bg-cream",
    accent: "text-on-cream",
    border: "border-on-surface",
  },
  {
    id: 3,
    href: "/umkm",
    icon: Store,
    title: "UMKM Lokal",
    desc: "Direktori usaha mikro kecil menengah dari kedua desa.",
    color: "bg-tertiary",
    accent: "text-on-tertiary",
    border: "border-on-surface",
  },
  {
    id: 4,
    href: "/budaya",
    icon: Palette,
    title: "Budaya & Tradisi",
    desc: "Dokumentasi kearifan lokal, tradisi, dan kesenian masyarakat.",
    color: "bg-cream",
    accent: "text-on-cream",
    border: "border-on-surface",
  },
  {
    id: 5,
    href: "/galeri",
    icon: Camera,
    title: "Galeri Desa",
    desc: "Dokumentasi visual kehidupan sehari-hari dan keindahan alam.",
    color: "bg-tertiary",
    accent: "text-on-tertiary",
    border: "border-on-surface",
  },
  {
    id: 6,
    href: "/berita",
    icon: Newspaper,
    title: "Berita Desa",
    desc: "Update terkini kegiatan dan perkembangan desa.",
    color: "bg-primary",
    accent: "text-on-primary",
    border: "border-on-surface",
  },
] as const;

export const HERO_CTA_BUTTONS = [
  { href: "/profil", label: "Profil Desa", icon: Info, variant: "primary" as const },
  { href: "/berita", label: "Berita Terkini", icon: Newspaper, variant: "outline" as const },
] as const;

export const HERO_WORDS = ["Selamat Datang", "di Pulau Obi"];

// Jumlah penduduk TIDAK ada tabelnya di Supabase (angka pendekatan manual,
// beda dari desa/proker/umkm yang dihitung live dari DB) — konstanta
// terpisah di sini, bukan dipaksa masuk hasil query getHomePageData-style,
// supaya jelas ini bukan angka yang "seharusnya" query tapi tidak pernah
// diupdate.
export const APPROX_POPULATION = 1200;

export const STATS_CARDS = [
  { icon: Birdhouse, key: "desa", label: "Desa", formatter: (v: number) => v.toString() },
  { icon: User, key: "penduduk", label: "Penduduk", formatter: (v: number) => `${v.toLocaleString("id-ID")}+` },
  { icon: BriefcaseBusiness, key: "proker", label: "Program Kerja", formatter: (v: number) => `${v}+` },
  { icon: Store, key: "umkm", label: "UMKM Aktif", formatter: (v: number) => `${v}+` },
] as const;