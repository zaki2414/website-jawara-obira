import { Landmark, Images, Store, type LucideIcon } from "lucide-react";

export type AdminAccentTone = "primary" | "tertiary" | "cream";

// "wide" = sm:col-span-2 (fallback tablet, sebelum lgArea eksplisit aktif
// di lg:) — lihat SIZE_SPAN di MenuCard.tsx.
export type AdminMenuSize = "wide" | "compact";

// String key, BUKAN komponen LucideIcon langsung — MenuCard.tsx yang
// mengonsumsi ini adalah "use client", dan referensi komponen (fungsi) tidak
// bisa dikirim sebagai prop dari Server Component ke Client Component.
// Key di-resolve ke komponen ikon aslinya di dalam MenuCard.tsx sendiri.
export type AdminMenuIconKey =
  | "backpack"
  | "images"
  | "store"
  | "landmark"
  | "bird"
  | "sprout"
  | "map"
  | "compass";

export type AdminMenuItem = {
  title: string;
  description: string;
  href: string;
  icon: AdminMenuIconKey;
  accent: AdminAccentTone;
  action: string;
  // Posisi eksplisit di grid 4 kolom x 3 baris (lg: ke atas) — kelas
  // col-start/col-end/row-start/row-end Tailwind langsung, BUKAN
  // grid-auto-flow: dense yang posisinya tidak bisa diprediksi persis.
  // Di bawah lg:, fallback ke `size` (wide=sm:col-span-2 lewat SIZE_SPAN
  // di MenuCard.tsx, auto-flow biasa).
  lgArea: string;
  size: AdminMenuSize;
};

// Layout lg: (posisi diminta persis, lihat lgArea per item):
//   [KKN Hub  ][KKN Hub  ][Fauna    ][Budaya   ]
//   [UMKM     ][Galeri   ][Galeri   ][Toga     ]
//   [Desa     ][Desa     ][Peta     ][Peta     ]
// `accent` pola diagonal: KKN Hub/Galeri/Peta (diagonal kiri-atas ke
// kanan-bawah) = tertiary (kuning); Budaya (pojok kanan-atas) & Desa (pojok
// kiri-bawah) = primary (biru); sisanya = cream.
//
// Delapan tile, bukan sembilan: seksi Berita dihapus seluruhnya (halaman
// publik /berita, admin, komponen, dan query-nya). Desa dinaikkan jadi
// `wide` supaya 4 kolom x 3 baris tetap terisi penuh tanpa sel bolong —
// 4 tile wide (2 sel) + 4 tile compact (1 sel) = 12 sel.
export const ADMIN_MENU_ITEMS: AdminMenuItem[] = [
  {
    title: "KKN Hub",
    description: "Kelola profil anggota, jurnal harian, dan proker tim KKN.",
    href: "/admin/kkn",
    icon: "backpack",
    accent: "tertiary",
    action: "Kelola KKN",
    size: "wide",
    lgArea: "lg:col-start-1 lg:col-end-3 lg:row-start-1 lg:row-end-2",
  },
  {
    title: "Manajemen Fauna",
    description: "Kelola data satwa endemik Pulau Obi.",
    href: "/admin/fauna-obi",
    icon: "bird",
    accent: "cream",
    action: "Kelola Fauna Obi",
    size: "compact",
    lgArea: "lg:col-start-3 lg:col-end-4 lg:row-start-1 lg:row-end-2",
  },
  {
    title: "Manajemen Budaya",
    description: "Kelola artikel budaya & kearifan lokal Pulau Obi.",
    href: "/admin/budaya",
    icon: "landmark",
    accent: "primary",
    action: "Kelola Budaya",
    size: "compact",
    lgArea: "lg:col-start-4 lg:col-end-5 lg:row-start-1 lg:row-end-2",
  },
  {
    title: "Manajemen UMKM",
    description: "Kelola usaha mikro, kecil, dan menengah lokal.",
    href: "/admin/umkm",
    icon: "store",
    accent: "cream",
    action: "Kelola UMKM",
    size: "compact",
    lgArea: "lg:col-start-1 lg:col-end-2 lg:row-start-2 lg:row-end-3",
  },
  {
    title: "Galeri Foto",
    description: "Upload & atur foto kegiatan, alam, dan dokumentasi desa.",
    href: "/admin/galeri",
    icon: "images",
    accent: "tertiary",
    action: "Upload Foto",
    size: "wide",
    lgArea: "lg:col-start-2 lg:col-end-4 lg:row-start-2 lg:row-end-3",
  },
  {
    title: "Manajemen Toga",
    description: "Kelola koleksi tanaman obat keluarga.",
    href: "/admin/toga",
    icon: "sprout",
    accent: "cream",
    action: "Kelola Toga",
    size: "compact",
    lgArea: "lg:col-start-4 lg:col-end-5 lg:row-start-2 lg:row-end-3",
  },
  {
    title: "Profil Desa",
    description: "Kelola deskripsi, statistik & foto Desa Kawasi dan Soligi.",
    href: "/admin/desa",
    icon: "compass",
    accent: "primary",
    action: "Kelola Desa",
    size: "wide",
    lgArea: "lg:col-start-1 lg:col-end-3 lg:row-start-3 lg:row-end-4",
  },
  {
    title: "Peta Fasilitas",
    description: "Kelola deskripsi & foto fasilitas umum di peta Desa Kawasi.",
    href: "/admin/peta",
    icon: "map",
    accent: "tertiary",
    action: "Kelola Peta",
    size: "wide",
    lgArea: "lg:col-start-3 lg:col-end-5 lg:row-start-3 lg:row-end-4",
  },
];

export type AdminStatKey = "culture" | "gallery" | "umkm";

export type AdminStatMeta = {
  key: AdminStatKey;
  label: string;
  icon: LucideIcon;
  accent: AdminAccentTone;
  emptyHint: string;
};

export const ADMIN_STAT_META: AdminStatMeta[] = [
  {
    key: "culture",
    label: "Artikel Budaya",
    icon: Landmark,
    accent: "tertiary",
    emptyHint: "Belum ada artikel",
  },
  {
    key: "gallery",
    label: "Foto Galeri",
    icon: Images,
    accent: "cream",
    emptyHint: "Belum ada foto",
  },
  {
    key: "umkm",
    label: "Data UMKM",
    icon: Store,
    accent: "primary",
    emptyHint: "Belum terdaftar",
  },
];
