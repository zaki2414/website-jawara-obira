"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Users, BookOpen, Rocket, ArrowRight, Sparkles } from "lucide-react";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";

interface KKNMenuPublic {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  accent: "primary" | "tertiary" | "cream";
}

const ACCENT_CLASSES = {
  primary: {
    iconBox: "bg-primary text-on-primary",
    topBar: "bg-primary",
  },
  tertiary: {
    iconBox: "bg-tertiary text-on-tertiary",
    topBar: "bg-tertiary",
  },
  cream: {
    iconBox: "bg-cream text-on-surface",
    topBar: "bg-cream",
  },
} as const;

const publicMenu: KKNMenuPublic[] = [
  {
    title: "Anggota Tim KKN",
    description:
      "Kenali lebih dekat para mahasiswa yang mengabdi dan pembagian penempatan wilayah tugas mereka.",
    href: "/kkn/tim",
    icon: <Users className="w-6 h-6" />,
    accent: "primary",
  },
  {
    title: "Jurnal Harian",
    description:
      "Ikuti catatan aktivitas, kalender kegiatan, dan cerita harian kami selama pelaksanaan KKN.",
    href: "/kkn/jurnal",
    icon: <BookOpen className="w-6 h-6" />,
    accent: "tertiary",
  },
  {
    title: "Hasil Program Kerja",
    description:
      "Lihat luaran, metrik dampak, serta sistem informasi yang telah diimplementasikan untuk desa.",
    href: "/kkn/proker",
    icon: <Rocket className="w-6 h-6" />,
    accent: "cream",
  },
];

export default function KKNPublicHub() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <main className="relative min-h-screen bg-natural-paper py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <KknPageBackground />

      <div className="relative max-w-6xl mx-auto z-10">
        {/* ─── HERO DUA PANEL — mengikuti pola HeaderSection budaya / HeroSection fauna-toga ─── */}
        <div className="grid lg:grid-cols-12 gap-5 md:gap-6 items-stretch mb-12">
          {/* KIRI: PANEL JUDUL (cream) */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-cream border-4 border-on-surface rounded-3xl p-6 md:p-10 hard-shadow-lg relative overflow-hidden flex flex-col justify-center gap-4 group"
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
              <motion.span
                animate={shouldReduceMotion ? {} : { scale: [1, 1.2, 1] }}
                transition={{ repeat: shouldReduceMotion ? 0 : Infinity, duration: 2, ease: "easeInOut" as const }}
                className="w-2 h-2 bg-primary rounded-full"
              />
              <span className="text-label-sm font-black tracking-widest uppercase text-on-surface">
                KKN-PPM UGM Periode II 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.2 }}
              className="relative z-10 font-serif text-4xl sm:text-5xl lg:text-6xl font-black text-on-surface leading-tight tracking-tight"
            >
              Jawara <span className="italic text-primary">Obira</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: shouldReduceMotion ? 0 : 0.3 }}
              className="relative z-10 text-on-surface-variant font-medium text-sm md:text-base leading-relaxed max-w-2xl"
            >
              Gerbang informasi terintegrasi pelaksanaan Kuliah Kerja Nyata. Eksplorasi
              jurnal, dokumentasi, dan realisasi dampak program kerja kami di Pulau Obi.
            </motion.p>
          </motion.div>

          {/* KANAN: BLOK WARNA SOLID (primary) — teaser 3 kanal informasi */}
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
              <Sparkles className="w-3.5 h-3.5 text-on-surface" />
              <span className="text-label-sm font-black uppercase tracking-widest text-on-surface">
                Jelajahi Kanal
              </span>
            </div>

            <ul className="relative z-10 space-y-3">
              {publicMenu.map((item) => (
                <li key={item.href} className="flex items-center gap-3 text-sm font-bold">
                  <span className="w-8 h-8 rounded-lg bg-background/15 border-2 border-on-primary/30 flex items-center justify-center shrink-0">
                    {item.icon}
                  </span>
                  {item.title}
                </li>
              ))}
            </ul>

            <p className="relative z-10 text-label-sm font-black uppercase tracking-wider text-on-primary/80 border-t-2 border-dashed border-on-primary/25 pt-4">
              3 Kanal Informasi Publik
            </p>
          </motion.div>
        </div>

        {/* ─── NAVIGATION CARDS GRID — tiap kartu punya identitas warna sendiri ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {publicMenu.map((item, index) => {
            const accentClasses = ACCENT_CLASSES[item.accent];
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: shouldReduceMotion ? 0 : 0.1 + index * 0.08, duration: 0.5 }}
              >
                <Link
                  href={item.href}
                  className="group relative bg-background rounded-2xl border-4 border-on-surface overflow-hidden hard-shadow hover:-translate-x-1 hover:-translate-y-1 hover:hard-shadow-lg transition-all duration-150 flex flex-col justify-between h-full"
                >
                  <span className={`h-1.5 w-full shrink-0 ${accentClasses.topBar}`} aria-hidden="true" />

                  <div className="p-6 flex flex-col justify-between grow">
                    <div>
                      <div
                        className={`w-fit p-3 rounded-xl border-2 border-on-surface mb-6 transition-transform duration-200 group-hover:scale-110 ${accentClasses.iconBox}`}
                      >
                        {item.icon}
                      </div>

                      <h3 className="text-2xl font-serif font-black text-on-surface tracking-tight mb-2">
                        {item.title}
                      </h3>
                      <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-8 pt-4 border-t-2 border-dashed border-outline-variant flex items-center justify-between text-sm font-bold text-on-surface group-hover:text-primary transition-colors duration-150">
                      <span>Lihat Selengkapnya</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-150" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
