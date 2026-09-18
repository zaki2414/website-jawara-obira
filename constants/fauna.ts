import type { Variants } from "framer-motion";
import { Bird, Search, MapPin, Sparkles, Filter, Leaf } from "lucide-react";

// ==========================================
// TIPE DATA
// ==========================================
export type Fauna = {
  id: string;
  name_local: string;
  name_scientific: string;
  slug: string;
  class?: string;
  order_name?: string;
  family?: string;
  iucn_status?: string;
  conservation_notes?: string;
  habitat?: string;
  diet?: string;
  behavior?: string;
  distribution?: string;
  description?: string;
  physical_characteristics?: string;
  thumbnail_url?: string;
  image_source?: string;
  documentations?: string | FaunaImage[];
};

export type FaunaImage = {
  url: string;
  caption?: string;
};

export type FaunaClass = {
  value: string;
  label: string;
  emoji: string;
};

// ==========================================
// STATIC DATA
// ==========================================
export const FAUNA_CLASSES: FaunaClass[] = [
  { value: "all", label: "Semua Kelas Satwa", emoji: "🦎" },
  { value: "Aves", label: "Burung (Aves)", emoji: "🦅" },
  { value: "Reptilia", label: "Reptil (Reptilia)", emoji: "🐍" },
  { value: "Mammalia", label: "Mamalia (Mammalia)", emoji: "🦇" },
  { value: "Amphibia", label: "Amfibi (Amphibia)", emoji: "🐸" },
];

export const FAUNA_CONTENT = {
  eyebrow: "Endemisme Pulau Obi",
  title: {
    main: "Inventarisasi",
    italic: "Fauna Obi",
  },
  description:
    "Koleksi dokumentasi satwa liar endemik Pulau Obi, Maluku Utara. Dari aves eksotis hingga reptil purba, setiap spesimen merekam kekayaan biodiversitas yang perlu dijaga.",
  searchPlaceholder: "Cari nama lokal, ilmiah, atau famili...",
  filterLabel: "Saring",
  emptyTitle: "Spesimen Tidak Ditemukan",
  emptyDescription:
    "Kata kunci atau filter pencarian tidak cocok dengan basis data fauna. Coba dengan kata kunci atau filter kelas yang berbeda.",
  emptySuggestion: "Coba ubah filter kelas atau kata kunci pencarian",
};

// ==========================================
// IUCN STATUS STYLES
// ==========================================
export const IUCN_STYLES: Record<string, string> = {
  LC: "bg-status-safe text-on-surface border-2 border-on-surface",
  NT: "bg-status-caution text-on-surface border-2 border-on-surface",
  VU: "bg-status-warning text-on-primary border-2 border-on-surface",
  EN: "bg-status-danger text-on-primary border-2 border-on-surface font-black",
  // animate-pulse dihapus: denyut tak berujung dicadangkan untuk indikator
  // loading (CLAUDE.md §3.5). Pada badge status, ia justru menarik perhatian
  // terus-menerus ke satu baris dan menyulitkan membaca daftar panjang —
  // bobot & warna merah tua sudah cukup menandai status paling genting.
  CR: "bg-status-critical text-on-primary border-2 border-on-surface font-black",
  // Belum dievaluasi / data kurang — netral, bukan "aman".
  NE: "bg-surface-container-high text-on-surface-variant border-2 border-outline",
  DD: "bg-surface-container-high text-on-surface-variant border-2 border-outline",
};

/** Urutan keparahan, dipakai untuk mengurutkan legenda & ringkasan status. */
export const IUCN_ORDER = ["CR", "EN", "VU", "NT", "LC", "NE", "DD"] as const;

export const IUCN_LABELS: Record<string, string> = {
  LC: "Risiko Rendah",
  NT: "Hampir Terancam",
  VU: "Rentan",
  EN: "Terancam",
  CR: "Kritis",
  NE: "Belum Dievaluasi",
  DD: "Data Kurang",
};

/**
 * Ambil KODE IUCN dari nilai apa pun yang tersimpan di database.
 *
 * Kolom `iucn_status` diisi admin sebagai teks bebas, dan yang benar-benar ada
 * di data berbentuk "Least Concern (LC)", "Vulnerable (VU)", "Belum
 * Dievaluasi (NE)" — bukan kode pendek. Sebelumnya IUCN_STYLES di-lookup
 * langsung dengan string penuh itu, jadi TIDAK PERNAH kena: seluruh badge
 * status konservasi jatuh ke gaya netral abu-abu, dan perbedaan antara satwa
 * Rentan dan Risiko Rendah hilang sama sekali dari halaman.
 */
export function getIucnCode(status?: string | null): string {
  if (!status) return "";
  const text = status.trim();
  // 1. Kode di dalam kurung — bentuk paling umum di data ini.
  const inParens = text.match(/\(([A-Za-z]{2})\)\s*$/);
  if (inParens) return inParens[1].toUpperCase();
  // 2. Sudah berupa kode pendek.
  const bare = text.toUpperCase();
  if (bare.length === 2 && bare in IUCN_STYLES) return bare;
  // 3. Dicocokkan dari frasa Inggris/Indonesia yang lazim dipakai.
  const lower = text.toLowerCase();
  if (lower.includes("critical") || lower.includes("kritis")) return "CR";
  if (lower.includes("endanger") || lower.includes("terancam punah")) return "EN";
  if (lower.includes("vulnerable") || lower.includes("rentan")) return "VU";
  if (lower.includes("near threatened") || lower.includes("hampir")) return "NT";
  if (lower.includes("least concern") || lower.includes("risiko rendah")) return "LC";
  if (lower.includes("data deficient") || lower.includes("data kurang")) return "DD";
  if (lower.includes("not evaluated") || lower.includes("belum dievaluasi")) return "NE";
  return "";
}

export function getIucnBrutalistClass(status?: string): string {
  return (
    IUCN_STYLES[getIucnCode(status)] ||
    "bg-surface-container text-on-surface border-2 border-outline"
  );
}

/** Label ringkas untuk badge: kode + nama Indonesianya. */
export function getIucnLabel(status?: string | null): string {
  const code = getIucnCode(status);
  if (!code) return "Tanpa Status";
  return `${code} · ${IUCN_LABELS[code] ?? ""}`.trim();
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================
export function parseFaunaImages(value: unknown): FaunaImage[] {
  if (!value) return [];
  if (Array.isArray(value)) return value as FaunaImage[];
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
// ANIMATION VARIANTS (TYPE-SAFE)
// ==========================================
export const faunaContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const faunaItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export const faunaCardVariants: Variants = {
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

export const faunaGridVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

export const faunaFormVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// Re-export icons
export const FAUNA_ICONS = {
  Bird, Search, MapPin, Sparkles, Filter, Leaf,
};

// ==========================================
// ACCENT COLOR SYSTEM — rotasi 2 token solid (primary/tertiary) per kelas
// taksonomi, supaya kartu & panel detail tidak seragam putih-polos semua.
// Sengaja dibatasi ke background/primary/tertiary TANPA modifier opacity —
// setiap nilai di bawah harus warna solid, bukan tint/opacity.
// IUCN status TIDAK ikut sistem ini — warnanya semantik (safe→critical),
// tetap pakai IUCN_STYLES di atas apa adanya.
// ==========================================
export type FaunaAccent = "primary" | "tertiary";

const ACCENT_CYCLE: FaunaAccent[] = ["primary", "tertiary"];

export const FAUNA_CLASS_ACCENT_MAP: Record<string, FaunaAccent> =
  Object.fromEntries(
    FAUNA_CLASSES.filter((c) => c.value !== "all").map((c, i) => [
      c.value,
      ACCENT_CYCLE[i % ACCENT_CYCLE.length],
    ]),
  );

export function getFaunaAccent(faunaClass?: string): FaunaAccent {
  if (!faunaClass) return "primary";
  return FAUNA_CLASS_ACCENT_MAP[faunaClass] ?? "primary";
}

export function nextFaunaAccent(accent: FaunaAccent): FaunaAccent {
  const idx = ACCENT_CYCLE.indexOf(accent);
  return ACCENT_CYCLE[(idx + 1) % ACCENT_CYCLE.length];
}

export const FAUNA_ACCENT_STYLES: Record<
  FaunaAccent,
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
    /** Warna judul kartu saat hover. Ditulis sebagai kelas LITERAL (bukan
     *  `group-hover:${text}`) karena Tailwind memindai kelas dari sumber dan
     *  tidak pernah melihat kelas yang dirakit saat runtime. */
    hoverText: string;
  }
> = {
  primary: {
    badge: "bg-primary text-on-primary",
    topBar: "bg-primary",
    border: "border-primary",
    text: "text-primary",
    hoverText: "group-hover:text-primary",
  },
  tertiary: {
    badge: "bg-tertiary text-on-tertiary",
    topBar: "bg-tertiary",
    border: "border-tertiary",
    text: "text-on-tertiary",
    hoverText: "group-hover:text-on-tertiary",
  },
};

// ==========================================
// DETAIL PAGE - CONTENT
// ==========================================
export const FAUNA_DETAIL_CONTENT = {
  backLabel: "Kembali ke Inventarisasi Fauna",
  fallbackClass: "Satwa",
  taxonomyTitle: "Informasi Dasar & Taksonomi",
  descriptionTitle: "Deskripsi Biologis",
  physicalTitle: "Morfologi & Ciri Fisik",
  conservationTitle: "Catatan Konservasi",
  ecologyTitle: "Ekologi, Habitat & Perilaku",
  galleryTitle: "Dokumentasi Lapangan",
  labels: {
    class: "Kelas",
    order: "Ordo",
    family: "Famili",
    habitat: "Habitat Utama",
    diet: "Rantai Makanan",
    behavior: "Pola Perilaku",
    distribution: "Sebaran di Obi",
  },
  fallbackAlt: {
    hero: "Banner Fauna",
    gallery: "Dokumentasi Fauna",
  },
};

// ==========================================
// DETAIL PAGE - VARIANTS (TYPE-SAFE)
// ==========================================
export const faunaDetailContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

export const faunaDetailItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};