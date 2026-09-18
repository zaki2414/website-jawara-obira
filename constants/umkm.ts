import type { Variants } from "framer-motion";
import {
  Store, Search, MapPin, Sparkles, Filter,
  UtensilsCrossed, Fish, Wrench, Palette, LayoutGrid,
  type LucideIcon,
} from "lucide-react";

// ==========================================
// TIPE DATA
// ==========================================
export type UMKMFeature = {
  feature: string;
};

export type UMKMItem = {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  business_type: string;
  short_description?: string;
  location_text?: string;
  umkm_features?: UMKMFeature[];
};

export type BusinessType = {
  value: string;
  label: string;
  emoji: string;
};

// ==========================================
// STATIC DATA
// ==========================================
export const UMKM_BUSINESS_TYPES: BusinessType[] = [
  { value: "all", label: "Semua Jenis Usaha", emoji: "📁" },
  { value: "toko", label: "Toko / Warung Kelontong", emoji: "🏪" },
  { value: "warung_makan", label: "Warung Makan & Kedai", emoji: "🍲" },
  { value: "hasil_laut", label: "Komoditas Hasil Laut", emoji: "🐟" },
  { value: "jasa", label: "Layanan Jasa / Montir", emoji: "🛠️" },
  { value: "kerajinan", label: "Kerajinan & Olah Tangan", emoji: "🎨" },
];

export const UMKM_CONTENT = {
  eyebrow: "Niaga Desa",
  title: {
    main: "Direktori UMKM",
    italic: "Lokal",
  },
  description:
    "Dokumentasi kolektif usaha mandiri, warung kelontong, dan penyedia jasa warga Kawasi & Soligi. Mari dukung roda ekonomi sirkular pulau kita.",
  searchPlaceholder: "Cari nama toko, produk, atau jasa...",
  filterLabel: "Saring",
  emptyTitle: "Entitas Usaha Tidak Ditemukan",
  emptyDescription:
    "Kata kunci atau filter pencarian tidak cocok dengan basis data mitra wirausaha desa. Coba dengan kata kunci atau filter yang berbeda.",
  emptySuggestion: "Coba ubah filter atau kata kunci pencarian",
  featuresLabel: "Fitur Unggulan",
  statsLabel: "Sebaran Jenis Usaha",
  statsTotalLabel: "Total Mitra Usaha",
  statsTypesLabel: "Jenis Usaha Terdaftar",
  statsTopTypeLabel: "Terbanyak",
};

// ==========================================
// ANIMATION VARIANTS (TYPE-SAFE)
// ==========================================
export const umkmContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const umkmItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const umkmCardVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: Math.min(i * 0.08, 0.4),
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export const umkmGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

export const umkmFormVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
export function formatBusinessType(type: string): string {
  return type.replace(/_/g, " ");
}

// ==========================================
// ACCENT COLOR SYSTEM — rotasi 3 token (primary/tertiary/cream)
// supaya taksonomi jenis usaha tidak monoton tapi tetap dalam palet resmi.
// ==========================================
export type BusinessAccent = "primary" | "tertiary" | "cream";

const ACCENT_CYCLE: BusinessAccent[] = ["primary", "tertiary", "cream"];

export const BUSINESS_TYPE_ACCENT_MAP: Record<string, BusinessAccent> =
  Object.fromEntries(
    UMKM_BUSINESS_TYPES.filter((t) => t.value !== "all").map((t, i) => [
      t.value,
      ACCENT_CYCLE[i % ACCENT_CYCLE.length],
    ]),
  );

export function getBusinessAccent(type?: string): BusinessAccent {
  if (!type) return "primary";
  return BUSINESS_TYPE_ACCENT_MAP[type] ?? "primary";
}

// Rotasi berbasis POSISI kartu di grid (bukan business_type) — dipakai
// UMKMCard supaya variasi primary/tertiary/cream selalu kelihatan di
// halaman, terlepas dari sebaran business_type di data asli (mis. kalau
// mayoritas UMKM terdaftar "toko", getBusinessAccent(type) di atas akan
// selalu balik "primary" untuk hampir semua kartu). Pola sama dengan
// getTogaAccent(index) di constants/toga.ts.
export function getBusinessAccentByIndex(index: number): BusinessAccent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length];
}

export function nextAccent(accent: BusinessAccent): BusinessAccent {
  const idx = ACCENT_CYCLE.indexOf(accent);
  return ACCENT_CYCLE[(idx + 1) % ACCENT_CYCLE.length];
}

export const BUSINESS_ACCENT_STYLES: Record<
  BusinessAccent,
  {
    badge: "solid" | "solid-tertiary" | "solid-cream";
    solidClass: string;
    chip: string;
    chipDot: string;
    topBar: string;
    panel: string;
    border: string;
    text: string;
    /** Warna judul kartu saat hover — kelas LITERAL, bukan `group-hover:${text}`,
     *  karena Tailwind memindai kelas dari sumber dan tidak pernah melihat
     *  kelas yang dirakit saat runtime. */
    hoverText: string;
  }
> = {
  primary: {
    badge: "solid",
    solidClass: "bg-primary text-on-primary",
    chip: "bg-primary/10 border-primary/30 text-primary",
    chipDot: "bg-primary",
    topBar: "bg-primary",
    panel: "bg-secondary-container/25 border-secondary",
    border: "border-primary",
    text: "text-primary",
    hoverText: "group-hover:text-primary-container",
  },
  tertiary: {
    badge: "solid-tertiary",
    solidClass: "bg-tertiary text-on-tertiary",
    chip: "bg-tertiary/15 border-tertiary/40 text-on-tertiary",
    chipDot: "bg-tertiary",
    topBar: "bg-tertiary",
    panel: "bg-tertiary-container/35 border-tertiary",
    border: "border-tertiary",
    text: "text-on-tertiary",
    hoverText: "group-hover:text-tertiary",
  },
  cream: {
    badge: "solid-cream",
    solidClass: "bg-cream text-on-surface",
    chip: "bg-cream/40 border-on-surface/20 text-on-surface",
    chipDot: "bg-cream border border-on-surface/30",
    topBar: "bg-cream",
    panel: "bg-cream/50 border-on-surface",
    border: "border-on-surface",
    text: "text-on-surface",
    hoverText: "group-hover:text-on-cream",
  },
};

// Re-export icons agar konsisten
export const UMKM_ICONS = {
  Store, Search, MapPin, Sparkles, Filter,
};

// Ikon per jenis usaha — SVG lucide, BUKAN emoji.
//
// Field `emoji` di UMKM_BUSINESS_TYPES masih dipakai <option> dropdown asli
// (elemen select tidak bisa memuat SVG), tapi di mana pun kita menggambar
// chrome sendiri (rail direktori, judul kelompok) ikon inilah yang dipakai:
// emoji dirender berbeda-beda per sistem operasi, ukurannya ikut font, dan
// warnanya tidak bisa diikat ke palet — jadi ia tidak pernah sebaris dengan
// ikon lucide lain di situs ini.
export const UMKM_TYPE_ICONS: Record<string, LucideIcon> = {
  all: LayoutGrid,
  toko: Store,
  warung_makan: UtensilsCrossed,
  hasil_laut: Fish,
  jasa: Wrench,
  kerajinan: Palette,
  // Nilai yang dipakai admin di lapangan tapi tidak pernah masuk daftar
  // UMKM_BUSINESS_TYPES di atas (lihat catatan normalizeBusinessType).
  produk: Store,
  kuliner: UtensilsCrossed,
};

// ── Ketahanan terhadap data nyata ────────────────────────────────────────
// Nilai `business_type` di database TIDAK terbatas pada daftar di atas: form
// admin membiarkan admin mengetik bebas, jadi yang benar-benar tersimpan
// adalah "Produk" (14), "Jasa" (1), "Kuliner" (1), "warung_makan" (1) —
// kapitalisasi campur, dua di antaranya tidak pernah ada di konstanta.
// Akibatnya, sebelum ini, 16 dari 17 usaha tidak bisa disaring lewat UI.
//
// Selama form admin belum dibatasi ke daftar tetap, sisi baca WAJIB
// menormalkan: bandingkan tanpa peduli besar-kecil huruf, dan tampilkan
// label apa adanya untuk nilai yang tidak dikenal alih-alih menyembunyikannya.
export function normalizeBusinessType(value?: string | null): string {
  return (value ?? "").trim().toLowerCase();
}

export function resolveBusinessTypeLabel(value?: string | null): string {
  const key = normalizeBusinessType(value);
  const known = UMKM_BUSINESS_TYPES.find((t) => t.value === key);
  if (known) return known.label;
  if (!key) return "Lainnya";
  // Nilai tak dikenal tetap ditampilkan, dirapikan seperlunya.
  return key
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ==========================================
// DETAIL PAGE - TYPES
// ==========================================
export type ExtraGalleryImage = {
  id: string;
  image_url: string;
  caption?: string;
};

export type UMKMProduct = {
  item_name: string;
  category?: {
    name: string;
    icon?: string;
  };
};

export type UMKM = {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  business_type: string;
  short_description?: string;
  full_description?: string;
  location_text?: string;
  // Titik pin Google Maps (kolom `latitude`/`longitude` di tabel `umkm` —
  // sudah ada di schema sebelum fitur ini, sebelumnya tidak dipakai sama
  // sekali). `blok` BUKAN kolom tabel — diturunkan on-the-fly di
  // getUMKMBySlug() dengan point-in-polygon terhadap bangunan.geojson desa
  // yang bersangkutan (lib/geo.ts), jadi selalu sinkron dengan peta kadaster
  // tanpa perlu admin isi manual/tabel bisa basi.
  latitude?: number | null;
  longitude?: number | null;
  blok?: string | null;
  umkm_features?: { feature: string }[];
  products?: UMKMProduct[];
  gallery?: ExtraGalleryImage[];
};

// ==========================================
// DETAIL PAGE - CONTENT
// ==========================================
export const UMKM_DETAIL_CONTENT = {
  backLabel: "Kembali ke Direktori Usaha",
  profileTitle: "Profil Usaha",
  productsTitle: "Inventaris Dagang & Layanan",
  galleryTitle: "Galeri Lapak Usaha",
  featuresTitle: "Atribut Layanan",
  mapTitle: "Informasi Pemetaan",
  mapSubtitle: "Peta Kartografi Desa",
  mapStatus: "Dalam Sinkronisasi Sistem",
  mapEmptyText: "Lokasi peta belum ditambahkan admin.",
  blokLabel: "Blok/Dusun",
  gmapsButtonLabel: "Buka di Google Maps",
  fallbackCategory: "Lainnya",
  fallbackIcon: "📋",
  fallbackAlt: {
    hero: "Banner UMKM",
    gallery: "Dokumentasi Usaha",
  },
};

// ==========================================
// DETAIL PAGE - VARIANTS (TYPE-SAFE)
// ==========================================
export const umkmDetailContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const umkmDetailItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export const umkmGalleryItemVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export const umkmFeatureItemVariants: Variants = {
  hidden: { opacity: 0, x: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

// ==========================================
// HELPER - Group products by category
// ==========================================
export type GroupedProducts = Record<string, { items: string[]; icon: string }>;

export function groupProductsByCategory(products: UMKMProduct[] | undefined): GroupedProducts {
  const grouped: GroupedProducts = {};
  
  if (!products) return grouped;

  products.forEach((p) => {
    const catName = p.category?.name || UMKM_DETAIL_CONTENT.fallbackCategory;
    const catIcon = p.category?.icon || UMKM_DETAIL_CONTENT.fallbackIcon;

    if (!grouped[catName]) {
      grouped[catName] = { items: [], icon: catIcon };
    }
    grouped[catName].items.push(p.item_name);
  });

  return grouped;
}