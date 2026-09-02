import type { Variants } from "framer-motion";
import { Camera, Image as ImageIcon, Aperture, Filter } from "lucide-react";

// ==========================================
// TIPE DATA
// ==========================================
export type GalleryItem = {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  category: string;
  uploaded_at?: string;
};

// Kategori sama persis dengan opsi <select> di components/admin/UploadForm.tsx
// (userType="gallery") — daftar ini jadi satu-satunya sumber kebenaran untuk
// filter di halaman publik, jangan diketik ulang manual di komponen lain.
export const GALERI_CATEGORIES = ["Semua", "Alam", "Budaya", "Kegiatan", "Keseharian"] as const;

// ==========================================
// STATIC CONTENT
// ==========================================
export const GALERI_CONTENT = {
  heroEyebrow: "Arsip Visual",
  heroTitle: {
    main: "Galeri Foto",
    italic: "Pulau Obi",
  },
  heroDescription:
    "Rekam jejak keindahan alam, dokumentasi kebudayaan, dan denyut nadi keseharian masyarakat di Desa Kawasi dan Desa Soligi.",
  spotlightLabel: "Sorotan Arsip",
  counterLabel: "Foto Terdokumentasi",
  spotlightCaption: "Distribusi foto per kategori",
  filterLabel: "Kategori:",
  emptyTitle: "Belum Ada Koleksi Foto",
  emptyDescription: "Kliping gambar mengenai wilayah belum diunggah ke peladen.",
  emptySuggestion: "Kembali lagi nanti untuk melihat dokumentasi terbaru",
  emptyFilteredTitle: "Tidak Ada Foto di Kategori Ini",
  emptyFilteredDescription: "Belum ada foto yang diunggah untuk kategori yang dipilih.",
  emptyFilteredSuggestion: "Coba pilih kategori lain, atau kembali ke \"Semua\" untuk melihat semua koleksi.",
};

// Re-export icons
export const GALERI_ICONS = {
  Camera, ImageIcon, Aperture, Filter,
};

// ==========================================
// KATEGORI COLOR SYSTEM — rotasi 3 token (primary/tertiary/cream), pola sama
// dengan CATEGORY_ACCENT_MAP di constants/budaya.ts, supaya taksonomi
// kategori foto tidak monoton satu warna tapi tetap dalam palet resmi.
// ==========================================
export type GaleriCategoryAccent = "primary" | "tertiary" | "cream";

const ACCENT_CYCLE: GaleriCategoryAccent[] = ["primary", "tertiary", "cream"];

export const GALERI_CATEGORY_ACCENT_MAP: Record<string, GaleriCategoryAccent> = Object.fromEntries(
  GALERI_CATEGORIES.filter((c) => c !== "Semua").map((cat, i) => [cat, ACCENT_CYCLE[i % ACCENT_CYCLE.length]]),
);

export function getGaleriCategoryAccent(category?: string): GaleriCategoryAccent {
  if (!category) return "primary";
  return GALERI_CATEGORY_ACCENT_MAP[category] ?? "primary";
}

export const GALERI_CATEGORY_ACCENT_STYLES: Record<
  GaleriCategoryAccent,
  { badge: string; dot: string; ring: string }
> = {
  primary: { badge: "bg-primary text-on-primary", dot: "bg-primary", ring: "focus-visible:ring-primary" },
  tertiary: { badge: "bg-tertiary text-on-tertiary", dot: "bg-tertiary", ring: "focus-visible:ring-tertiary" },
  cream: { badge: "bg-cream text-on-surface", dot: "bg-cream border border-on-surface/30", ring: "focus-visible:ring-secondary" },
};

// ==========================================
// ANIMATION VARIANTS (TYPE-SAFE)
// ==========================================
export const galeriHeroVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};

export const galeriCardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      delay: Math.min(i * 0.06, 0.36),
      ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
    },
  }),
};
