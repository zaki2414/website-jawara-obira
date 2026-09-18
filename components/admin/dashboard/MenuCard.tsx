import Link from "next/link";
import {
  ArrowRight,
  Backpack,
  Images,
  Store,
  Landmark,
  Bird,
  Sprout,
  Map,
  Compass,
} from "lucide-react";
import type { AdminMenuIconKey, AdminMenuItem, AdminMenuSize } from "@/constants/admin";
import { ADMIN_ACCENT_STYLES } from "../adminAccent";

// Resolve string key -> komponen ikon di sini, bukan diterima lewat props —
// lihat catatan AdminMenuIconKey di constants/admin.ts. (Kartu ini sekarang
// Server Component; indirection lewat string key dipertahankan apa adanya
// karena sudah jadi kontrak constants/admin.ts.)
const ICONS: Record<AdminMenuIconKey, typeof Backpack> = {
  backpack: Backpack,
  images: Images,
  store: Store,
  landmark: Landmark,
  bird: Bird,
  sprout: Sprout,
  map: Map,
  compass: Compass,
};

// Span col di sm: (tablet) — fallback SEBELUM lgArea eksplisit item ambil
// alih dari lg: ke atas. Dasar (mobile, tanpa prefix) selalu 1x1 supaya
// grid-cols-1 tidak overflow.
const SIZE_SPAN: Record<AdminMenuSize, string> = {
  wide: "sm:col-span-2",
  compact: "",
};

type MenuCardProps = {
  item: AdminMenuItem;
};

export function MenuCard({ item }: MenuCardProps) {
  const accent = ADMIN_ACCENT_STYLES[item.accent];
  const Icon = ICONS[item.icon];
  const isWide = item.size === "wide";

  return (
    <div className={`${SIZE_SPAN[item.size]} ${item.lgArea}`}>
      <Link prefetch={false}
        href={item.href}
        // hard-shadow-hover + press-effect: utilitas milik proyek sendiri
        // (app/globals.css) — transisinya dideklarasikan di state dasar dan
        // hover-nya di-gate ke perangkat berkursor. Sebelumnya kartu ini
        // menulis ulang efeknya sendiri dengan `transition-all`, yang ikut
        // menganimasikan properti yang tidak diinginkan dan "patah" saat
        // kursor keluar.
        className={`group relative flex h-full min-h-37.5 flex-col overflow-hidden rounded-2xl border-2 border-on-surface px-5 pt-5 pb-6 hard-shadow-md hard-shadow-hover press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${accent.solidBg} ${isWide ? "sm:px-7 sm:pt-7 sm:pb-8" : ""}`}
      >
        <Icon
          className={`pointer-events-none absolute -bottom-4 -right-4 opacity-10 ${accent.text} ${isWide ? "size-32" : "size-20"}`}
          aria-hidden="true"
        />

        <span
          className={`relative inline-flex shrink-0 items-center justify-center rounded-xl border-2 border-on-surface bg-background text-on-surface ${isWide ? "size-14" : "size-11"}`}
        >
          <Icon className={isWide ? "size-6" : "size-5"} aria-hidden="true" />
        </span>

        <h3
          className={`relative mt-4 font-serif font-black ${accent.text} ${isWide ? "text-2xl tracking-tight" : "text-lg"}`}
        >
          {item.title}
        </h3>
        <p
          className={`relative mt-1.5 font-medium leading-relaxed ${accent.subtext} ${isWide ? "text-base" : "text-sm line-clamp-2"}`}
        >
          {item.description}
        </p>

        <span
          className={`relative mt-auto inline-flex w-fit items-center gap-1.5 pt-5 text-label-sm font-black uppercase tracking-wide ${accent.text}`}
        >
          {item.action}
          <ArrowRight
            className="size-3.5 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </Link>
    </div>
  );
}
