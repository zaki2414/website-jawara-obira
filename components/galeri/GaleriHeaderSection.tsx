"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  GALERI_CONTENT,
  GALERI_CATEGORIES,
  GALERI_ICONS,
  getGaleriCategoryAccent,
  GALERI_CATEGORY_ACCENT_STYLES,
} from "@/constants/galeri";

type GaleriHeaderSectionProps = {
  totalCount: number;
  categoryCounts: Record<string, number>;
};

// Hero dua-panel — pola sama dengan components/budaya/HeaderSection.tsx
// (panel judul kertas arsip + panel sorotan berisi jumlah & legenda
// kategori), menggantikan GaleriHeroSection.tsx yang sebelumnya cuma satu
// panel solid tanpa hitungan sama sekali.
export function GaleriHeaderSection({ totalCount, categoryCounts }: GaleriHeaderSectionProps) {
  const { Camera, Aperture } = GALERI_ICONS;
  const categories = GALERI_CATEGORIES.filter((c) => c !== "Semua");

  return (
    <section className="relative w-full border-b-4 border-on-surface overflow-hidden bg-tertiary py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(rgba(29,28,24,0.7)_1.5px,transparent_1.5px)] bg-size-[24px_24px]" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10 grid lg:grid-cols-12 gap-5 md:gap-6 items-stretch select-none">
        {/* KIRI: TITLE PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 140, damping: 18, mass: 0.8 }}
          className="lg:col-span-7 border-4 bg-cream border-on-surface rounded-3xl p-6 md:p-10 hard-shadow relative overflow-hidden flex flex-col justify-center gap-4 group cursor-default"
        >
          <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.05] pointer-events-none transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:scale-110 z-10">
            <Image src="/Hiasan 5.svg" alt="" aria-hidden="true" fill className="object-contain" />
          </div>

          <div className="space-y-4 max-w-3xl relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-background border-2 border-on-surface px-3 py-1 rounded-full hard-shadow-sm w-fit"
            >
              <Camera className="w-4 h-4 text-on-surface" aria-hidden="true" />
              <span className="text-label-sm font-black tracking-widest uppercase text-on-surface">
                {GALERI_CONTENT.heroEyebrow}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight"
            >
              {GALERI_CONTENT.heroTitle.main} <br />
              <span className="italic text-primary underline decoration-wavy decoration-tertiary decoration-2 underline-offset-8">
                {GALERI_CONTENT.heroTitle.italic}
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-on-surface-variant font-medium text-sm md:text-base leading-relaxed max-w-2xl"
            >
              {GALERI_CONTENT.heroDescription}
            </motion.p>
          </div>
        </motion.div>

        {/* KANAN: SPOTLIGHT PANEL */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" as const, stiffness: 160, damping: 15, delay: 0.3 }}
          className="lg:col-span-5 bg-primary text-on-primary border-4 border-on-surface p-6 md:p-8 rounded-3xl hard-shadow-lg relative overflow-hidden flex flex-col justify-between gap-6"
        >
          <div className="absolute -left-10 -top-10 w-40 h-40 opacity-[0.08] pointer-events-none z-0">
            <Image src="/Hiasan 4.svg" alt="" aria-hidden="true" fill className="object-contain" />
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 bg-on-primary/10 border-2 border-on-primary/30 px-3 py-1 rounded-full">
              <Aperture className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-label-sm font-black uppercase tracking-widest">
                {GALERI_CONTENT.spotlightLabel}
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="font-serif text-5xl md:text-6xl font-black leading-none mb-1">{totalCount}</div>
            <div className="text-label-sm font-black uppercase tracking-wider text-on-primary/80 border-t border-on-primary/25 pt-2">
              {GALERI_CONTENT.counterLabel}
            </div>
          </div>

          <div className="relative z-10 space-y-1.5 border-t-2 border-dashed border-on-primary/25 pt-4">
            <p className="text-label-sm font-black uppercase tracking-wider text-on-primary/70 mb-2">
              {GALERI_CONTENT.spotlightCaption}
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {categories.map((cat) => {
                const accent = getGaleriCategoryAccent(cat);
                const styles = GALERI_CATEGORY_ACCENT_STYLES[accent];
                return (
                  <li key={cat} className="flex items-center gap-2 text-sm font-semibold">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 border border-on-primary/40 ${styles.dot}`} aria-hidden="true" />
                    <span className="truncate">{cat}</span>
                    <span className="ml-auto text-on-primary/70 tabular-nums">{categoryCounts[cat] ?? 0}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
