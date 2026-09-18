"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

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
//
// SATU cahaya per varian, bukan dua. Versi sebelumnya memasang dua bola blur
// besar yang saling tabrak di tengah panel (dashboard bahkan pakai
// primary/85 + tertiary/85), hasilnya bukan "cahaya arsip" tapi lapisan
// gradien keruh biru-ke-emas yang menutupi tekstur kertas — persis pola
// "generic gradient blur" yang dilarang §2.5 CLAUDE.md untuk tema ini.
// Sekarang: satu wash miring dari satu sudut, intensitas rendah, identitas
// warna per seksi tetap terbaca tanpa mengubur kertasnya.
const VARIANTS = {
  dashboard: {
    ornaments: [
      {
        key: "1",
        src: "/Hiasan 1.svg",
        className: "absolute -top-12 -right-12 w-56 h-56 sm:w-64 sm:h-64 opacity-[0.30]",
        duration: 42,
        direction: 1 as const,
      },
      {
        key: "3",
        src: "/Hiasan 3.svg",
        className: "absolute -bottom-16 -left-10 w-52 h-52 sm:w-60 sm:h-60 opacity-[0.26]",
        duration: 48,
        direction: -1 as const,
      },
    ],
    glow: "bg-tertiary/25",
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
    glow: "bg-primary/22",
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
    glow: "bg-tertiary/28",
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
    glow: "bg-cream/45",
  },
} satisfies Record<string, { ornaments: Ornament[]; glow: string }>;

export type AdminOrnamentsVariant = keyof typeof VARIANTS;

// Ornamen dekoratif hero admin — leaf "use client" terpisah dari Server Component
// pemanggilnya supaya Framer Motion tidak menyeret seluruh hero ke client bundle.
// useReducedMotion() menonaktifkan hanyutan rotasi untuk pengguna yang
// mengaktifkan prefers-reduced-motion, konsisten dengan §3.5 CLAUDE.md.
// Rotasi 38-48 detik/putaran sengaja dipertahankan (bukan dihapus seperti
// denyut cahaya): pada laju itu geraknya praktis tak terbaca sebagai animasi,
// cuma bikin garis ornamen tidak pernah persis sama tiap kali halaman dibuka —
// karakter "arsip hidup" yang memang jadi ciri situs ini.
// rounded-2xl + overflow-hidden ada DI SINI (bukan cuma di container pemanggil)
// supaya tetap self-clip meski container luar tidak overflow-hidden.
export function AdminOrnaments({ variant = "dashboard" }: { variant?: AdminOrnamentsVariant }) {
  const shouldReduceMotion = useReducedMotion();
  const { ornaments, glow } = VARIANTS[variant];

  return (
    <div
      className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none select-none"
      aria-hidden="true"
    >
      {/* Cahaya warna tema — satu wash miring dari sudut kanan-atas, DIAM.
          Dulu ini dua bola blur yang berdenyut terus-menerus; denyut tak
          berujung di permukaan kerja (admin mengisi form di sini) cuma jadi
          gangguan tepi mata, dan §3.5 CLAUDE.md memang membatasi animasi
          infinite untuk indikator loading saja. Warna identitas seksi tetap
          ada, cuma tidak lagi bergerak sendiri. */}
      <div
        className={`absolute -top-28 -right-16 size-80 rounded-full blur-3xl ${glow}`}
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
