// components/home/HeroSection.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { HERO_WORDS, HERO_CTA_BUTTONS, type Village } from "@/constants/home";

type HeroSectionProps = {
  villages: Village[];
};

// ══════════════════════════════════════════════════════════════════
// HERO — "PANEL ARSIP"
//
// Foto dermaga diperlakukan sebagai PELAT FOTO arsip, dan teks tidak lagi
// mengambang di atasnya: teks masuk ke dalam satu panel kertas bertepi tebal
// (border-4 + hard-shadow-xl) yang diletakkan di atas foto, seperti kartu
// katalog yang ditempel pada cetakan foto.
//
// Kenapa diubah dari versi lama:
// 1. KONTRAS. Versi lama menaruh body text langsung di atas foto dengan
//    andalan gradient wash; di layar terang rasio kontrasnya jatuh di bawah
//    4.5:1. Sekarang teks berdiri di atas kertas opak #fef9f2 → kontras aman
//    tanpa perlu memucatkan fotonya.
// 2. IDENTITAS. Versi lama tidak punya satu pun tepi keras / hard-shadow,
//    jadi viewport pertama situs justru satu-satunya bagian yang TIDAK
//    terlihat brutalist. Panel ini memperkenalkan bahasa visual yang sama
//    dengan kartu-kartu di bawahnya sejak layar pertama.
// 3. FOTONYA JADI TERLIHAT. Karena teks sudah punya alas sendiri, wash di
//    atas foto bisa dikurangi drastis — dermaga & perahu akhirnya terbaca
//    sebagai foto tempat, bukan tekstur biru pucat.
//
// GERAK: satu momen yang diotori, bukan efek terserak. Panel "mendarat"
// (y + blur + opacity) sebagai satu kesatuan, dengan stagger pendek di
// dalamnya sebagai ritme internal — bukan tiap kata/paragraf/tombol
// menganimasi dirinya sendiri seperti versi lama.
// ══════════════════════════════════════════════════════════════════

export function HeroSection({ villages }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  // Parallax dimatikan total saat prefers-reduced-motion — bukan sekadar
  // diperpendek. Parallax adalah pemicu motion sickness paling umum.
  const panelY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 90]);
  const panelOpacity = useTransform(scrollY, [0, 420], [1, reduceMotion ? 1 : 0.15]);
  const photoY = useTransform(scrollY, [0, 600], [0, reduceMotion ? 0 : 40]);

  const panelVariants: Variants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 28, scale: 0.985, filter: "blur(8px)" },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: reduceMotion ? 0.3 : 0.85,
        ease: [0.23, 1, 0.32, 1], // --ease-out
        staggerChildren: reduceMotion ? 0 : 0.07,
        delayChildren: reduceMotion ? 0 : 0.18,
      },
    },
  };

  const lineVariants: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.3 : 0.6, ease: [0.23, 1, 0.32, 1] },
    },
  };

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center overflow-hidden bg-natural-paper"
      aria-label="Selamat datang di Pulau Obi"
    >
      {/* ── PELAT FOTO ────────────────────────────────────────────────
          Wash-nya jauh lebih tipis dari versi lama (from-transparent, bukan
          menutup seluruh bidang) karena teks sudah punya alas kertas sendiri.
          Gelapnya hanya di tepi bawah, untuk mengunci petunjuk gulir. */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <motion.div
          style={{ y: photoY }}
          className="relative w-full h-[112%] top-[-6%] transform-gpu will-change-transform"
        >
          <Image
            src="/Background Hero Home.jpg"
            alt=""
            fill
            priority
            quality={90}
            className="object-cover object-[62%_center]"
            aria-hidden="true"
          />
        </motion.div>

        {/* Scrim vertikal tipis: menjaga tepi bawah & atas, membiarkan
            bagian tengah foto tetap jernih. */}
        <div className="absolute inset-0 bg-linear-to-b from-natural-paper/70 via-transparent to-natural-paper" />
        {/* Di desktop panel ada di kiri — beri kedalaman ekstra hanya di sisi
            itu supaya tepi panel tetap terbaca di atas area foto yang terang. */}
        <div className="absolute inset-0 hidden lg:block bg-linear-to-r from-natural-paper/85 via-natural-paper/25 to-transparent" />
      </div>

      {/* ── PANEL ARSIP ──────────────────────────────────────────────── */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8 pt-28 pb-24 md:pt-32 md:pb-28">
        <motion.article
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          style={{ y: panelY, opacity: panelOpacity }}
          className="w-full max-w-xl lg:max-w-2xl border-4 border-on-surface bg-background rounded-2xl hard-shadow-xl overflow-hidden transform-gpu will-change-transform"
        >
          {/* Pelat metadata — ini BUKAN eyebrow dekoratif: ia membawa
              informasi lokasi + nomor katalog, peran yang sama dengan label
              tercetak pada kartu katalog arsip. */}
          <motion.div
            variants={lineVariants}
            className="flex items-center justify-between gap-3 bg-primary px-5 sm:px-7 py-2.5 border-b-4 border-on-surface"
          >
            <span className="text-label-sm font-black uppercase tracking-[0.18em] text-on-primary">
              Pulau Obi · Maluku Utara
            </span>
            <span className="text-label-sm font-black uppercase tracking-[0.18em] text-tertiary tabular">
              Arsip 01
            </span>
          </motion.div>

          <div className="px-5 sm:px-7 py-7 sm:py-9 space-y-6">
            <motion.h1
              variants={lineVariants}
              className="font-serif text-5xl sm:text-6xl lg:text-7xl font-black text-on-surface leading-[0.95] tracking-[-0.03em] text-balance"
            >
              {HERO_WORDS[0]}
              <span className="block text-primary">{HERO_WORDS[1]}</span>
            </motion.h1>

            {/* Garis putus arsip — pemisah yang sudah jadi bahasa situs ini
                (dipakai di kartu bento & KKN), bukan ornamen baru. */}
            <motion.div
              variants={lineVariants}
              className="border-t-2 border-dashed border-outline-variant"
              aria-hidden="true"
            />

            <motion.p
              variants={lineVariants}
              className="text-body-lg text-on-surface-variant leading-relaxed max-w-[58ch]"
            >
              Jelajahi kekayaan budaya, biodiversitas, dan kearifan lokal dari{" "}
              <strong className="font-bold text-on-surface">
                {villages[0]?.name || "Desa Kawasi"}
              </strong>{" "}
              dan{" "}
              <strong className="font-bold text-on-surface">
                {villages[1]?.name || "Desa Soligi"}
              </strong>
              .
            </motion.p>

            <motion.div variants={lineVariants} className="flex flex-wrap gap-3 pt-1">
              {HERO_CTA_BUTTONS.map((btn) => (
                <Button
                  key={btn.href}
                  asChild
                  variant={btn.variant}
                  size="lg"
                  className="text-label-md"
                >
                  <Link href={btn.href}>
                    <btn.icon
                      className="size-5 transition-transform duration-200 group-hover/button:-rotate-6"
                      aria-hidden="true"
                    />
                    {btn.label}
                  </Link>
                </Button>
              ))}
            </motion.div>
          </div>

          {/* Kaki panel: dua desa sebagai entri katalog. Memberi panel
              "dasar" yang tegas dan menyebut isi arsipnya secara konkret. */}
          <motion.div
            variants={lineVariants}
            className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t-4 border-on-surface bg-cream-container px-5 sm:px-7 py-3"
          >
            <span className="text-label-sm font-black uppercase tracking-[0.14em] text-on-cream">
              Terdokumentasi
            </span>
            <span className="text-label-sm text-on-cream/60" aria-hidden="true">
              /
            </span>
            <span className="text-label-sm font-bold uppercase tracking-[0.1em] text-on-surface">
              {villages[0]?.name || "Desa Kawasi"} · {villages[1]?.name || "Desa Soligi"}
            </span>
          </motion.div>
        </motion.article>
      </div>

      {/* ── SEGEL ORNAMEN ────────────────────────────────────────────
          Ornamen kompas dipakai SEKALI dan besar sebagai "segel" arsip di
          sudut, bukan ditebar sebagai partikel. Desktop-only: di mobile ia
          hanya akan bertabrakan dengan panel. */}
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 hidden lg:block w-[26rem] h-[26rem] opacity-[0.13] animate-[spin_90s_linear_infinite] motion-reduce:animate-none"
        aria-hidden="true"
      >
        <Image src="/Hiasan 2.svg" alt="" fill className="object-contain" aria-hidden="true" />
      </div>

      {/* ── PETUNJUK GULIR ───────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        aria-hidden="true"
      >
        <span className="text-label-sm uppercase tracking-[0.2em] font-black text-on-surface/70">
          Gulir
        </span>
        <motion.svg
          className="w-5 h-5 text-on-surface/70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          animate={reduceMotion ? undefined : { y: [0, 7, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </motion.svg>
      </motion.div>
    </section>
  );
}
