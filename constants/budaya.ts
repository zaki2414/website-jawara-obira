import type { Variants } from "framer-motion";
import {
  Sparkles, MapPin, ArrowUpRight, AlertCircle, Filter,
} from "lucide-react";

// ==========================================
// TIPE DATA
// ==========================================
export type CultureItem = {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnail_url?: string;
  published_at?: string;
  extra_images?: ExtraImage[] | string;
  content?: string;
  villages?: {
    name: string;
  };
};

export type ExtraImage = {
  url: string;
  caption?: string;
};

// ==========================================
// STATIC DATA
// ==========================================
export const BUDAYA_CATEGORIES = [
  "Semua",
  "Tradisi",
  "Ritus",
  "Kesenian",
  "Kuliner",
  "Alat Tradisional",
] as const;

export const BUDAYA_CONTENT = {
  heroEyebrow: "Khazanah Budaya Maluku Utara",
  heroTitle: {
    main: "Arsip Kebudayaan",
    italic: "Pulau Obi",
  },
  heroDescription:
    "Penjelajahan interaktif melintasi dimensi tradisi, ritus sakral, kesenian, hingga cita rasa khas nusantara yang diwariskan luhur di Desa Kawasi & Soligi.",
  filterLabel: "Kategori:",
  counterLabel: "Dokumentasi Terverifikasi",
  spotlightLabel: "Sorotan Arsip",
  spotlightCaption: "Distribusi dokumentasi per kategori budaya",
  emptyTitle: "Belum Terhimpun",
  emptyDescription:
    "Dokumentasi kebudayaan pada kategori ini sedang dalam tahap riset lapangan dan verifikasi adat setempat.",
  errorTitle: "Koneksi Gagal",
  loadingText: "Menyinkronkan Lembaran Tradisi...",
};

// ==========================================
// ANIMATION VARIANTS
// ==========================================
export const cultureCardVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      delay: Math.min(i * 0.04, 0.25),
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  }),
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const detailItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const BUDAYA_ICONS = {
  Sparkles, MapPin, ArrowUpRight, AlertCircle, Filter,
};

// ==========================================
// CATEGORY COLOR SYSTEM — rotasi 3 token (primary/tertiary/cream)
// supaya taksonomi kategori tidak monoton tapi tetap dalam palet resmi.
// ==========================================
export type CategoryAccent = "primary" | "tertiary" | "cream";

const ACCENT_CYCLE: CategoryAccent[] = ["primary", "tertiary", "cream"];

export const CATEGORY_ACCENT_MAP: Record<string, CategoryAccent> =
  Object.fromEntries(
    BUDAYA_CATEGORIES.filter((c) => c !== "Semua").map((cat, i) => [
      cat,
      ACCENT_CYCLE[i % ACCENT_CYCLE.length],
    ]),
  );

export function getCategoryAccent(category?: string): CategoryAccent {
  if (!category) return "primary";
  return CATEGORY_ACCENT_MAP[category] ?? "primary";
}

export function nextAccent(accent: CategoryAccent): CategoryAccent {
  const idx = ACCENT_CYCLE.indexOf(accent);
  return ACCENT_CYCLE[(idx + 1) % ACCENT_CYCLE.length];
}

export const CATEGORY_ACCENT_STYLES: Record<
  CategoryAccent,
  {
    badge: string;
    hoverBadge: string;
    dot: string;
    topBar: string;
    panel: string;
    border: string;
    ring: string;
    text: string;
    /** Warna judul kartu saat hover — kelas LITERAL, bukan `group-hover:${text}`,
     *  karena Tailwind memindai kelas dari sumber dan tidak pernah melihat
     *  kelas yang dirakit saat runtime. */
    hoverText: string;
  }
> = {
  primary: {
    badge: "bg-primary text-on-primary",
    hoverBadge: "hover:bg-primary hover:text-on-primary",
    dot: "bg-primary",
    topBar: "bg-primary",
    panel: "bg-primary-container/25 border-primary",
    border: "border-primary",
    ring: "focus-visible:ring-primary",
    text: "text-primary",
    hoverText: "group-hover:text-primary",
  },
  tertiary: {
    badge: "bg-tertiary text-on-tertiary",
    hoverBadge: "hover:bg-tertiary hover:text-on-tertiary",
    dot: "bg-tertiary",
    topBar: "bg-tertiary",
    panel: "bg-tertiary-container/35 border-tertiary",
    border: "border-tertiary",
    ring: "focus-visible:ring-tertiary",
    text: "text-on-tertiary",
    hoverText: "group-hover:text-on-tertiary",
  },
  cream: {
    badge: "bg-cream text-on-surface",
    hoverBadge: "hover:bg-cream hover:text-on-surface",
    dot: "bg-cream border border-on-surface/30",
    topBar: "bg-cream",
    panel: "bg-cream/50 border-on-surface",
    border: "border-on-surface",
    ring: "focus-visible:ring-secondary",
    text: "text-on-surface",
    hoverText: "group-hover:text-on-surface",
  },
};

// ==========================================
// DETAIL PAGE - VARIANTS & CONTENT
// ==========================================

export const DETAIL_CONTENT = {
  backLabel: "Kembali ke Katalog Budaya",
  mobileGalleryTitle: "Dokumentasi Terlampir",
  fallbackAlt: {
    hero: "Banner Budaya",
    side: "Kliping Lampiran",
    mobile: "Lampiran Budaya",
  },
  metaLabels: {
    date: "Dipublikasikan",
    origin: "Asal",
  },
};

export const detailContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const mobileGalleryContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

export const mobileGalleryItemVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};