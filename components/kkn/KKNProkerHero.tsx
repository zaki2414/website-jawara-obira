"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Target, TrendingUp } from "lucide-react";

type KKNProkerHeroProps = {
  totalCount: number;
};

export function KKNProkerHero({ totalCount }: KKNProkerHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="grid lg:grid-cols-12 gap-5 md:gap-6 items-stretch mb-8">
      {/* KIRI: PANEL JUDUL (tertiary solid) */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="lg:col-span-7 bg-tertiary border-4 border-on-surface rounded-3xl p-6 md:p-10 hard-shadow-lg relative overflow-hidden flex flex-col justify-center gap-4 group"
      >
        <div className="absolute -right-8 -bottom-8 w-48 h-48 opacity-[0.08] pointer-events-none transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:rotate-45 group-hover:scale-110 z-10">
          <Image src="/Hiasan 4.svg" alt="" aria-hidden="true" fill className="object-contain" />
        </div>

        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.15 }}
          className="relative z-10 inline-flex items-center gap-2 bg-background border-2 border-on-surface px-3 py-1 rounded-full hard-shadow-sm w-fit"
        >
          <Target className="w-3.5 h-3.5 text-primary" />
          <span className="text-label-sm font-black tracking-widest uppercase text-on-surface">
            Dampak Lapangan
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
          className="relative z-10 font-serif text-3xl sm:text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight"
        >
          Realisasi <span className="italic text-primary">Program Kerja</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
          className="relative z-10 text-on-surface-variant font-medium text-sm md:text-base leading-relaxed max-w-2xl"
        >
          Capaian program kerja kami untuk masyarakat Desa Kawasi & Soligi.
        </motion.p>
      </motion.div>

      {/* KANAN: BLOK WARNA SOLID (primary) — counter total program */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring" as const, stiffness: 160, damping: 15, delay: shouldReduceMotion ? 0 : 0.25 }}
        className="lg:col-span-5 bg-primary text-on-primary border-4 border-on-surface p-6 md:p-8 rounded-3xl hard-shadow-lg relative overflow-hidden flex flex-col justify-between gap-5"
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: -360 }}
          transition={{ duration: 30, repeat: shouldReduceMotion ? 0 : Infinity, ease: "linear" as const }}
          className="absolute -left-10 -top-10 w-40 h-40 opacity-[0.1] pointer-events-none z-0"
        >
          <Image src="/Hiasan 4.svg" alt="" aria-hidden="true" fill className="object-contain" />
        </motion.div>

        <div className="relative z-10 inline-flex items-center gap-2 bg-background border-2 border-on-surface px-3 py-1 rounded-full w-fit">
          <TrendingUp className="w-3.5 h-3.5 text-on-surface" />
          <span className="text-label-sm font-black uppercase tracking-widest text-on-surface">
            Ringkasan Dampak
          </span>
        </div>

        <div className="relative z-10">
          <div className="font-serif text-5xl md:text-6xl font-black leading-none mb-1">
            {totalCount}
          </div>
          <div className="text-label-sm font-black uppercase tracking-wider text-on-primary border-t border-on-primary pt-2">
            Program Kerja Terealisasi
          </div>
        </div>

        <p className="relative z-10 text-sm font-semibold leading-relaxed border-t-2 border-dashed border-on-primary pt-4">
          Setiap program mencatat luaran, metrik dampak, dan dokumentasi implementasi untuk desa.
        </p>
      </motion.div>
    </div>
  );
}
