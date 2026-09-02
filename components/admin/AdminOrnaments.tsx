"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { pulseAnimation } from "@/lib/animations";

type Ornament = {
  key: string;
  src: string;
  className: string;
  duration: number;
  direction: 1 | -1;
};

// Dua kombinasi Hiasan + cahaya warna berbeda supaya hero dashboard admin dan
// hero KKN hub tidak terlihat seperti kartu identik yang dicopy — tetap satu
// mekanisme (reduced-motion aware, self-clipping), beda "resep" saja.
const VARIANTS = {
  dashboard: {
    ornaments: [
      {
        key: "1",
        src: "/Hiasan 1.svg",
        className: "absolute -top-12 -right-12 w-56 h-56 sm:w-64 sm:h-64 opacity-[0.36]",
        duration: 42,
        direction: 1 as const,
      },
      {
        key: "3",
        src: "/Hiasan 3.svg",
        className: "absolute -bottom-16 -left-10 w-52 h-52 sm:w-60 sm:h-60 opacity-[0.34]",
        duration: 48,
        direction: -1 as const,
      },
    ],
    glowA: "bg-primary/85",
    glowB: "bg-tertiary/85",
  },
  // KKN Hub — biru (primary + primary-container) karena kotak menu "KKN Hub"
  // di dashboard utama berwarna primary; setiap sub-halaman di dalamnya
  // (tim/jurnal/proker) memakai gradasi warna yang sama supaya jelas "masih
  // di area KKN" ke mana pun admin berpindah, bukan warna-warni acak per halaman.
  kkn: {
    ornaments: [
      {
        key: "2",
        src: "/Hiasan 2.svg",
        className: "absolute -top-14 -left-10 w-52 h-52 sm:w-60 sm:h-60 opacity-[0.25]",
        duration: 46,
        direction: -1 as const,
      },
      {
        key: "4",
        src: "/Hiasan 4.svg",
        className: "absolute -bottom-16 -right-12 w-56 h-56 sm:w-64 sm:h-64 opacity-[0.5]",
        duration: 40,
        direction: 1 as const,
      },
    ],
    glowA: "bg-primary/25",
    glowB: "bg-primary-container/35",
  },
  // Budaya — kuning/emas (tertiary + tertiary-container) karena kotak menu
  // "Manajemen Budaya" di dashboard utama berwarna tertiary; halaman admin
  // budaya (list + form) memakai gradasi warna yang sama, sama seperti
  // prinsip warna KKN di atas.
  budaya: {
    ornaments: [
      {
        key: "5",
        src: "/Hiasan 5.svg",
        className: "absolute -top-14 -right-10 w-52 h-52 sm:w-60 sm:h-60 opacity-[0.25]",
        duration: 44,
        direction: 1 as const,
      },
      {
        key: "1",
        src: "/Hiasan 1.svg",
        className: "absolute -bottom-16 -left-12 w-56 h-56 sm:w-64 sm:h-64 opacity-[0.3]",
        duration: 38,
        direction: -1 as const,
      },
    ],
    glowA: "bg-tertiary/30",
    glowB: "bg-tertiary-container/40",
  },
  // Fauna Obi — krem (cream + cream-container) karena kotak menu "Manajemen
  // Fauna" di dashboard utama berwarna cream; halaman admin fauna (list +
  // form) memakai gradasi warna yang sama, sama seperti prinsip warna KKN
  // dan Budaya di atas.
  fauna: {
    ornaments: [
      {
        key: "3",
        src: "/Hiasan 3.svg",
        className: "absolute -top-14 -left-10 w-52 h-52 sm:w-60 sm:h-60 opacity-[0.28]",
        duration: 40,
        direction: -1 as const,
      },
      {
        key: "5",
        src: "/Hiasan 5.svg",
        className: "absolute -bottom-16 -right-12 w-56 h-56 sm:w-64 sm:h-64 opacity-[0.3]",
        duration: 46,
        direction: 1 as const,
      },
    ],
    glowA: "bg-cream/40",
    glowB: "bg-cream-container/55",
  },
} satisfies Record<string, { ornaments: Ornament[]; glowA: string; glowB: string }>;

export type AdminOrnamentsVariant = keyof typeof VARIANTS;

// Ornamen dekoratif hero admin — leaf "use client" terpisah dari Server Component
// pemanggilnya supaya Framer Motion tidak menyeret seluruh hero ke client bundle.
// useReducedMotion() menonaktifkan rotasi & pulsa kontinu untuk pengguna yang
// mengaktifkan prefers-reduced-motion, konsisten dengan §3.5 CLAUDE.md.
// rounded-2xl + overflow-hidden ada DI SINI (bukan cuma di container pemanggil)
// supaya tetap self-clip meski container luar tidak overflow-hidden.
export function AdminOrnaments({ variant = "dashboard" }: { variant?: AdminOrnamentsVariant }) {
  const shouldReduceMotion = useReducedMotion();
  const { ornaments, glowA, glowB } = VARIANTS[variant];

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Cahaya warna tema — menambah "wow" tanpa mengganti tekstur kertas arsip
          di bawahnya (bukan generic gradient blur polos). */}
      <motion.div
        className={`absolute -top-24 left-1/7 size-72 rounded-full blur-3xl ${glowA}`}
        animate={shouldReduceMotion ? undefined : pulseAnimation(0.12, 0.28, 9)}
      />
      <motion.div
        className={`absolute -bottom-24 right-1/7 size-72 rounded-full blur-3xl ${glowB}`}
        animate={shouldReduceMotion ? undefined : pulseAnimation(0.1, 0.24, 11)}
      />

      {ornaments.map((ornament) => (
        <motion.div
          key={ornament.key}
          className={ornament.className}
          animate={
            shouldReduceMotion
              ? undefined
              : { rotate: ornament.direction > 0 ? [0, 360] : [0, -360] }
          }
          transition={{
            duration: ornament.duration,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Image src={ornament.src} alt="" fill className="object-contain" />
        </motion.div>
      ))}
    </div>
  );
}
