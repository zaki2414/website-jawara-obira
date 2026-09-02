import type { Variants } from "framer-motion";
import { Sprout, Search, BookOpen, HeartPulse, CupSoda, HelpCircle, CheckCircle2, ArrowRight } from "lucide-react";

// ==========================================
// TIPE DATA
// ==========================================
export type TogaRecipe = {
  title: string;
  ingredients: string[];
  steps: string[];
};

export type TogaPlant = {
  id: string;
  name_id: string;
  name_latin: string;
  slug: string;
  description?: string;
  health_benefits?: string[];
  thumbnail_url?: string;
  recipes?: string | TogaRecipe[];
};

// ==========================================
// STATIC CONTENT
// ==========================================
export const TOGA_CONTENT = {
  eyebrow: "Apotek Hidup Obira",
  title: {
    main: "Ensiklopedia",
    italic: "Tanaman Obat",
  },
  description:
    "Kearsipan digital Tanaman Obat Keluarga (TOGA) khas Pulau Obi, Maluku Utara — lengkap dengan khasiat kesehatan dan resep racikan tradisional turun-temurun.",
  searchPlaceholder: "Cari nama tanaman Indonesia atau Latin...",
  searchLabel: "Cari",
  emptyTitle: "Tanaman Tidak Ditemukan",
  emptyDescription:
    "Kata kunci pencarian tidak cocok dengan basis data tanaman obat. Coba dengan kata kunci lain.",
  emptySuggestion: "Coba ubah kata kunci pencarian",
};

export const TOGA_DETAIL_CONTENT = {
  backLabel: "Kembali ke Ensiklopedia Toga",
  descriptionTitle: "Deskripsi Klasifikasi Tanaman",
  benefitsTitle: "Khasiat & Manfaat Kesehatan",
  recipesTitle: "Resep Racikan Tradisional",
  ingredientsLabel: "Komposisi Bahan",
  stepsLabel: "Tahap Pengolahan",
  fallbackAlt: "Banner Tanaman Obat",
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================
export function parseTogaRecipes(value: unknown): TogaRecipe[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as TogaRecipe[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

// ==========================================
// ACCENT COLOR SYSTEM — rotasi 2 token solid (primary/tertiary) berdasarkan
// posisi kartu di daftar (tanaman tidak punya kategori taksonomi), supaya
// kartu & panel detail tidak seragam putih-polos semua. Solid saja, tanpa
// modifier opacity — konsisten dengan aturan warna terbaru proyek.
// ==========================================
export type TogaAccent = "primary" | "tertiary";

// Sengaja mulai dari tertiary (kebalikan urutan fauna-obi yang mulai dari
// primary) supaya ritme warna toga tidak identik dengan fauna-obi meski
// sama-sama memakai palet primary/tertiary solid.
export function getTogaAccent(index: number): TogaAccent {
  return index % 2 === 0 ? "tertiary" : "primary";
}

export function nextTogaAccent(accent: TogaAccent): TogaAccent {
  return accent === "primary" ? "tertiary" : "primary";
}

/** Aksen deterministik dari slug — dipakai di halaman detail (tanpa index kartu),
 *  supaya satu spesimen selalu tampil dengan warna yang sama di setiap kunjungan. */
export function getTogaAccentFromSlug(slug: string): TogaAccent {
  let sum = 0;
  for (let i = 0; i < slug.length; i++) sum += slug.charCodeAt(i);
  return sum % 2 === 0 ? "tertiary" : "primary";
}

export const TOGA_ACCENT_STYLES: Record<
  TogaAccent,
  {
    /** Pill/fill solid: bg-{accent} + teks kontrasnya. */
    badge: string;
    /** Strip/dot aksen solid. */
    topBar: string;
    /** Border aksen solid saja (dipakai bareng bg-background — pola "info box"
     *  seragam: border-2 warna aksen di semua sisi + border-l-8 di sisi kiri). */
    border: string;
    /** Warna teks/ikon aksen yang tetap kontras di atas bg-background. */
    text: string;
  }
> = {
  primary: {
    badge: "bg-primary text-on-primary",
    topBar: "bg-primary",
    border: "border-primary",
    text: "text-primary",
  },
  tertiary: {
    badge: "bg-tertiary text-on-tertiary",
    topBar: "bg-tertiary",
    border: "border-tertiary",
    text: "text-on-tertiary",
  },
};

// Re-export icons
export const TOGA_ICONS = {
  Sprout, Search, BookOpen, HeartPulse, CupSoda, HelpCircle, CheckCircle2, ArrowRight,
};

// ==========================================
// ANIMATION VARIANTS (TYPE-SAFE)
// ==========================================
export const togaItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const togaCardVariants: Variants = {
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

export const togaFormVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const togaDetailItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};
