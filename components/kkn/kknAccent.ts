// Sistem aksen warna berbasis desa untuk halaman detail KKN (proker & jurnal) —
// dipakai supaya "dokumen" yang tadinya polos abu-abu punya identitas warna
// yang konsisten dengan sistem aksen di domain lain (fauna/toga/budaya/umkm).
export type VillageAccent = "primary" | "tertiary" | "cream";

export function getVillageAccent(villageName?: string | null): VillageAccent {
  const name = (villageName || "").toLowerCase();
  if (name.includes("kawasi")) return "primary";
  if (name.includes("soligi")) return "tertiary";
  return "cream";
}

const ACCENT_CYCLE: VillageAccent[] = ["primary", "tertiary", "cream"];

/** Rotasi 3-tona untuk memberi variasi warna antar-section pada satu halaman detail. */
export function nextVillageAccent(accent: VillageAccent): VillageAccent {
  const idx = ACCENT_CYCLE.indexOf(accent);
  return ACCENT_CYCLE[(idx + 1) % ACCENT_CYCLE.length];
}

export const VILLAGE_ACCENT_STYLES: Record<
  VillageAccent,
  {
    /** Border solid untuk box utama & bingkai foto. */
    border: string;
    /** Pill/badge solid: bg-{accent} + teks kontrasnya. */
    badge: string;
    /** Warna teks/ikon aksen yang tetap kontras di atas bg-background. */
    text: string;
    /** Chip bundar untuk ikon judul section (tint lembut, bukan solid). */
    iconChip: string;
    /** Strip/kicker bar solid — dipakai di atas hero banner (pola TogaDetailHero/HeroBanner budaya). */
    topBar: string;
  }
> = {
  primary: {
    border: "border-primary",
    badge: "bg-primary text-on-primary",
    text: "text-primary",
    iconChip: "bg-primary/15 text-primary",
    topBar: "bg-primary",
  },
  tertiary: {
    border: "border-tertiary",
    badge: "bg-tertiary text-on-tertiary",
    text: "text-on-tertiary",
    iconChip: "bg-tertiary/20 text-on-tertiary",
    topBar: "bg-tertiary",
  },
  cream: {
    border: "border-on-surface",
    badge: "bg-cream text-on-surface",
    text: "text-on-surface",
    iconChip: "bg-cream/70 text-on-surface",
    topBar: "bg-cream",
  },
};
