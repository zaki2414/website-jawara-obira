"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import {
  BUDAYA_CONTENT,
  BUDAYA_CATEGORIES,
  CATEGORY_ACCENT_STYLES,
  getCategoryAccent,
} from "@/constants/budaya";

type HeaderSectionProps = {
  cultureCount: number;
  categoryCounts: Record<string, number>;
};

export function HeaderSection({ cultureCount, categoryCounts }: HeaderSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const categories = BUDAYA_CATEGORIES.filter((c) => c !== "Semua");

  // Section backdrop full-bleed — solid bg-tertiary (BUKAN gradasi tipis),
  // beda per halaman (UMKM=primary, Fauna=primary-container, Toga=tertiary-
  // container) supaya tiap halaman kerasa beda "kombinasi warna"-nya. Dua
  // kotak hard-shadow (rounded-3xl + border-4) TETAP dipertahankan bentuk
  // aslinya dan mengambang di atas latar solid itu.
  return (
    <section className="relative w-full border-b-4 border-on-surface overflow-hidden bg-tertiary py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(rgba(29,28,24,0.7)_1.5px,transparent_1.5px)] bg-size-[24px_24px]" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10 grid lg:grid-cols-12 gap-5 md:gap-6 items-stretch select-none">
        {/* ─── KIRI: TITLE PANEL (kertas arsip) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring" as const, stiffness: 140, damping: 18, mass: 0.8 }}
          className="lg:col-span-7 border-4 bg-cream border-on-surface rounded-3xl p-6 md:p-10 hard-shadow relative overflow-hidden flex flex-col justify-center gap-4 group cursor-default"
        >
          {/* Watermark */}
          <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.05] pointer-events-none transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:scale-110 z-10">
            <Image src="/Hiasan 5.svg" alt="" aria-hidden="true" fill className="object-contain" />
          </div>

          <div className="space-y-4 max-w-3xl relative z-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 bg-background border-2 border-on-surface px-3 py-1 rounded-full hard-shadow-sm"
            >
              <motion.span
                animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                transition={{
                  repeat: shouldReduceMotion ? 0 : Infinity,
                  duration: 2,
                  ease: "easeInOut" as const,
                }}
                className="w-2 h-2 bg-tertiary rounded-full"
              />
              <span className="text-label-sm font-black tracking-widest uppercase text-on-surface">
                {BUDAYA_CONTENT.heroEyebrow}
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight"
            >
              {BUDAYA_CONTENT.heroTitle.main} <br />
              <span className="italic text-primary underline decoration-wavy decoration-tertiary decoration-2 underline-offset-8">
                {BUDAYA_CONTENT.heroTitle.italic}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="text-on-surface-variant font-medium text-sm md:text-base leading-relaxed max-w-2xl"
            >
              {BUDAYA_CONTENT.heroDescription}
            </motion.p>
          </div>
        </motion.div>

        {/* ─── RIGHT: SPOTLIGHT PANEL (blok warna primary solid) ─── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring" as const, stiffness: 160, damping: 15, delay: 0.3 }}
          className="lg:col-span-5 bg-primary text-on-primary border-4 border-on-surface p-6 md:p-8 rounded-3xl hard-shadow-lg relative overflow-hidden flex flex-col justify-between gap-6"
        >
          {/* Ornamen sudut */}
          <div className="absolute -left-10 -top-10 w-40 h-40 opacity-[0.08] pointer-events-none z-0">
            <Image src="/Hiasan 4.svg" alt="" aria-hidden="true" fill className="object-contain" />
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="inline-flex items-center gap-2 bg-on-primary/10 border-2 border-on-primary/30 px-3 py-1 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-label-sm font-black uppercase tracking-widest">
                {BUDAYA_CONTENT.spotlightLabel}
              </span>
            </div>
          </div>

          <div className="relative z-10">
            <div className="font-serif text-5xl md:text-6xl font-black leading-none mb-1">
              {cultureCount}
            </div>
            <div className="text-label-sm font-black uppercase tracking-wider text-on-primary/80 border-t border-on-primary/25 pt-2">
              {BUDAYA_CONTENT.counterLabel}
            </div>
          </div>

          {/* Legenda Kategori — rotasi warna primary/tertiary/cream */}
          <div className="relative z-10 space-y-1.5 border-t-2 border-dashed border-on-primary/25 pt-4">
            <p className="text-label-sm font-black uppercase tracking-wider text-on-primary/70 mb-2">
              {BUDAYA_CONTENT.spotlightCaption}
            </p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              {categories.map((cat) => {
                const accent = getCategoryAccent(cat);
                const styles = CATEGORY_ACCENT_STYLES[accent];
                return (
                  <li key={cat} className="flex items-center gap-2 text-sm font-semibold">
                    <span
                      className={`w-2.5 h-2.5 rounded-full shrink-0 border border-on-primary/40 ${styles.dot}`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{cat}</span>
                    <span className="ml-auto text-on-primary/70 tabular-nums">
                      {categoryCounts[cat] ?? 0}
                    </span>
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
