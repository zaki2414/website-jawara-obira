import type { AdminAccentTone } from "@/constants/admin";

// Dipakai bersama oleh components/admin/dashboard/** dan components/admin/kkn/**
// (kartu solid-color di dashboard admin & KKN hub) — jangan duplikasi per fitur.
//
// Catatan penting: TIDAK ADA token --color-on-secondary di globals.css, jadi
// bg-secondary tidak pernah dipasangkan dengan text di sini. cream dipasangkan
// dengan text-on-surface (bukan text-on-cream, token itu juga tidak ada).
export const ADMIN_ACCENT_STYLES: Record<
  AdminAccentTone,
  { solidBg: string; text: string; subtext: string }
> = {
  primary: {
    solidBg: "bg-primary",
    text: "text-on-primary",
    subtext: "text-on-primary/75",
  },
  tertiary: {
    solidBg: "bg-tertiary",
    text: "text-on-tertiary",
    subtext: "text-on-tertiary/75",
  },
  cream: {
    solidBg: "bg-cream",
    text: "text-on-surface",
    subtext: "text-on-surface/70",
  },
};
