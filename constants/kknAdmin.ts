import { Users, NotebookPen, Rocket, type LucideIcon } from "lucide-react";

// String key, BUKAN komponen LucideIcon langsung — KKNMenuCard.tsx yang
// mengonsumsi ini adalah "use client", dan referensi komponen (fungsi) tidak
// bisa dikirim sebagai prop dari Server Component ke Client Component.
// Key di-resolve ke komponen ikon aslinya di dalam KKNMenuCard.tsx sendiri.
export type KKNHubIconKey = "users" | "notebook-pen" | "rocket";

// Ukuran tile bento — hanya 2 tingkat karena cuma 3 menu di hub ini:
// "feature" (besar, 2x2) dan "compact" (kecil, 1x1). Lihat KKNMenuGrid.tsx.
export type KKNHubTileSize = "feature" | "compact";

// Tidak ada field "accent" 3-warna seperti dashboard utama — seluruh section
// KKN (hub + tim/jurnal/proker) sengaja satu keluarga biru. "tone" di bawah
// cuma membedakan SHADE biru per kartu (lihat TONE_STYLES di KKNMenuCard.tsx):
// light = bg-primary-container (terang), medium = bg-primary (sedang),
// dark = bg-on-primary-container (gelap) — 3 nilai warna yang benar-benar
// terpisah supaya kelihatan beda, bukan gradasi CSS yang ujungnya mirip.
export type KKNHubTone = "medium" | "dark" | "light";

export type KKNHubMenuItem = {
  title: string;
  description: string;
  href: string;
  icon: KKNHubIconKey;
  action: string;
  size: KKNHubTileSize;
  tone: KKNHubTone;
};

export const KKN_HUB_MENU_ITEMS: KKNHubMenuItem[] = [
  {
    title: "Manajemen Tim",
    description:
      "Perbarui profil anggota, penempatan posko (Kawasi/Soligi), dan struktur role.",
    href: "/admin/kkn/tim",
    icon: "users",
    action: "Atur Anggota",
    size: "feature",
    tone: "medium",
  },
  {
    title: "Jurnal Kegiatan",
    description: "Kelola log harian, progres lapangan, dan kalender kegiatan sub-unit.",
    href: "/admin/kkn/jurnal",
    icon: "notebook-pen",
    action: "Kelola Jurnal",
    size: "compact",
    tone: "dark",
  },
  {
    title: "Hasil & Luaran Proker",
    description: "Input indikator ketercapaian, unggah dokumentasi, dan metrik dampak.",
    href: "/admin/kkn/proker",
    icon: "rocket",
    action: "Kelola Proker",
    size: "compact",
    tone: "light",
  },
];

export type KKNHubStatKey = "journals" | "prokers" | "members";

export type KKNHubStatMeta = {
  key: KKNHubStatKey;
  label: string;
  icon: LucideIcon;
  emptyHint: string;
};

// KKNStatCard (components/admin/kkn/KKNStatCard.tsx) adalah Server Component
// biasa, jadi icon di sini boleh referensi komponen LucideIcon langsung — beda
// dengan KKN_HUB_MENU_ITEMS di atas yang dikonsumsi client component.
export const KKN_HUB_STAT_META: KKNHubStatMeta[] = [
  {
    key: "journals",
    label: "Total Jurnal",
    icon: NotebookPen,
    emptyHint: "Belum ada jurnal",
  },
  {
    key: "prokers",
    label: "Program Kerja",
    icon: Rocket,
    emptyHint: "Belum ada proker",
  },
  {
    key: "members",
    label: "Anggota Tim",
    icon: Users,
    emptyHint: "Belum ada anggota",
  },
];
