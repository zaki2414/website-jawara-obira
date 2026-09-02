"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Feather, Sparkles } from "lucide-react";
import {
  FAUNA_CONTENT,
  FAUNA_CLASSES,
  getFaunaAccent,
  FAUNA_ACCENT_STYLES,
} from "@/constants/fauna";

type FaunaHeroSectionProps = {
  totalCount: number;
};

// Section backdrop full-bleed — solid bg-primary-container (BUKAN gradasi
// tipis), beda per halaman (UMKM=primary, Budaya=tertiary, Toga=tertiary-
// container) supaya tiap halaman kerasa beda "kombinasi warna"-nya. Dua
// kotak hard-shadow (rounded-3xl + border-4) tetap dipertahankan bentuk
// aslinya, mengambang di atas latar solid itu.
export function FaunaHeroSection({ totalCount }: FaunaHeroSectionProps) {
  const shouldReduceMotion = useReducedMotion();
  const classes = FAUNA_CLASSES.filter((c) => c.value !== "all");

  return (
    <section className="relative w-full border-b-4 border-on-surface overflow-hidden bg-primary-container py-12 md:py-16 px-4 sm:px-6 md:px-8">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(rgba(29,28,24,0.7)_1.5px,transparent_1.5px)] bg-size-[24px_24px]" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10 grid lg:grid-cols-12 gap-5 md:gap-6 items-stretch">
      {/* ─── KIRI: PANEL JUDUL (tertiary solid, tetap hangat) ─── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 bg-tertiary border-4 border-on-surface rounded-3xl p-6 md:p-10 hard-shadow-lg relative overflow-hidden flex flex-col justify-center gap-4 group"
      >
        {/* Watermark ornamen — pola identik dengan HeaderSection budaya */}
        <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.05] pointer-events-none transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:scale-110 z-10">
          <Image src="/Hiasan 2.svg" alt="" aria-hidden="true" fill className="object-contain" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.15 }}
          className="relative z-10 inline-flex items-center gap-2 bg-background border-2 border-on-surface px-3 py-1 rounded-full hard-shadow-sm w-fit"
        >
          <Feather className="w-3.5 h-3.5 text-primary" />
          <span className="text-label-sm font-black tracking-widest uppercase text-on-surface">
            {FAUNA_CONTENT.eyebrow}
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
          className="relative z-10 font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight"
        >
          {FAUNA_CONTENT.title.main}
          <br />
          <span className="italic text-primary">{FAUNA_CONTENT.title.italic}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
          className="relative z-10 text-on-surface-variant font-medium text-sm md:text-base leading-relaxed max-w-2xl"
        >
          {FAUNA_CONTENT.description}
        </motion.p>
      </motion.div>

      {/* ─── KANAN: BLOK WARNA SOLID (primary) — counter + legenda kelas ─── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" as const, stiffness: 160, damping: 15, delay: shouldReduceMotion ? 0 : 0.25 }}
        className="lg:col-span-5 bg-primary text-on-primary border-4 border-on-surface p-6 md:p-8 rounded-3xl hard-shadow-lg relative overflow-hidden flex flex-col justify-between gap-5"
      >
        {/* Ornamen sudut — berputar kontinu (arah berlawanan & tanpa perlu hover,
            beda dari ornamen panel kiri yang berputar saat di-hover) */}
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 30, repeat: shouldReduceMotion ? 0 : Infinity, ease: "linear" as const }}
          className="absolute -left-10 -top-10 w-40 h-40 opacity-[0.08] pointer-events-none z-0"
        >
          <Image src="/Hiasan 2.svg" alt="" aria-hidden="true" fill className="object-contain" />
        </motion.div>

        <div className="relative z-10 inline-flex items-center gap-2 bg-background border-2 border-on-surface px-3 py-1 rounded-full w-fit">
          <Sparkles className="w-3.5 h-3.5 text-on-surface" />
          <span className="text-label-sm font-black uppercase tracking-widest text-on-surface">
            Ringkasan Arsip
          </span>
        </div>

        <div className="relative z-10">
          <div className="font-serif text-5xl md:text-6xl font-black leading-none mb-1">
            {totalCount}
          </div>
          <div className="text-label-sm font-black uppercase tracking-wider text-on-primary border-t border-on-primary pt-2">
            Spesimen Terdokumentasi
          </div>
        </div>

        <div className="relative z-10 space-y-1.5 border-t-2 border-dashed border-on-primary pt-4">
          <p className="text-label-sm font-black uppercase tracking-wider text-on-primary mb-2">
            Sebaran Kelas Taksa
          </p>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {classes.map((c) => {
              const accent = getFaunaAccent(c.value);
              const styles = FAUNA_ACCENT_STYLES[accent];
              return (
                <li key={c.value} className="flex items-center gap-2 text-sm font-semibold">
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 border border-on-primary ${styles.topBar}`}
                    aria-hidden="true"
                  />
                  <span className="truncate">{c.label.split(" ")[0]}</span>
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
