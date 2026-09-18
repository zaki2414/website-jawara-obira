"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import type { LucideIcon } from "lucide-react";

type EntityCardShellProps = {
  href: string;
  index: number;
  variants: Variants;
  thumbnailUrl?: string | null;
  thumbnailAlt: string;
  FallbackIcon: LucideIcon;
  /** Badge yang diposisikan absolute di atas gambar (kategori, status, dst). */
  topBadges?: React.ReactNode;
  /** Konten di bawah gambar (judul, deskripsi, meta). */
  children: React.ReactNode;
  /** Varian kartu besar (bento) — gambar horizontal & lebih besar di layar md+.
   *  Murni pengaturan ukuran, tanpa badge "Unggulan" (dihapus dari desain). */
  large?: boolean;
  /** Kelas warna solid (mis. "bg-primary") untuk strip aksen tipis di atas konten. */
  accentBar?: string;
  /** Kelas warna border kartu (default border-on-surface) — dipakai kartu
   *  yang butuh variasi warna per index/kelompok (mis. KKN Tim/Proker). */
  borderColorClass?: string;
};

/**
 * Kerangka kartu brutalist yang dipakai FaunaCard & UMKMCard — dua kartu itu sebelumnya
 * mengimplementasikan ulang chrome yang persis sama (motion wrapper, hard-shadow, gambar
 * fallback-icon berputar, garis aksen hover) secara independen.
 */
export function EntityCardShell({
  href,
  index,
  variants,
  thumbnailUrl,
  thumbnailAlt,
  FallbackIcon,
  topBadges,
  children,
  large = false,
  accentBar,
  borderColorClass = "border-on-surface",
}: EntityCardShellProps) {
  const { ref, inView } = useInView({ threshold: 0.1, triggerOnce: true });
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      custom={index}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="h-full"
    >
      <Link href={href} className="block h-full group">
        <motion.div
          className={`bg-background border-2 ${borderColorClass} rounded-2xl overflow-hidden hard-shadow hard-shadow-hover transition-all h-full relative flex flex-col ${large ? "md:flex-row" : ""}`}
          whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.01 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
        >
          {/* Cover Image */}
          <div
            className={`relative bg-surface-container-low ${borderColorClass} overflow-hidden shrink-0 ${
              large
                ? "h-64 md:h-auto md:w-1/2 border-b-2 md:border-b-0 md:border-r-2"
                : "h-56 border-b-2"
            }`}
          >
            {thumbnailUrl ? (
              <motion.div
                className="relative w-full h-full"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <Image
                  src={thumbnailUrl}
                  alt={thumbnailAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </motion.div>
            ) : (
              /* PLAT ARSIP BELUM BERFOTO.
                 Versi lama menaruh satu ikon abu 20% yang BERPUTAR TANPA HENTI
                 di tengah kotak. Dua masalah: rotasi tak berujung dipakai untuk
                 sesuatu yang bukan indikator loading (CLAUDE.md §3.5 melarangnya),
                 dan ikon melayang tanpa konteks membaca seperti gambar gagal
                 dimuat, bukan keputusan desain. Sekarang kotaknya jadi "plat"
                 bernomor: raster titik cetak + cap ornamen + ikon domain di
                 dalam bingkai putus-putus, sehingga entri tanpa foto tetap
                 terbaca sebagai bagian dari katalog. */
              <div className="relative flex items-center justify-center h-full" aria-hidden="true">
                <div className="absolute inset-0 bg-[radial-gradient(rgba(29,28,24,0.85)_1.5px,transparent_1.5px)] bg-size-[18px_18px] opacity-[0.07]" />
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.09]">
                  <div className="relative w-40 h-40">
                    <Image src="/Hiasan 4.svg" alt="" fill className="object-contain" />
                  </div>
                </div>
                <div className="relative flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-on-surface/25 px-5 py-4">
                  <FallbackIcon className="w-8 h-8 text-on-surface/35" />
                  <span className="text-label-sm font-black uppercase tracking-[0.14em] text-on-surface/35">
                    Belum berfoto
                  </span>
                </div>
              </div>
            )}

            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {topBadges}
          </div>

          {/* Strip Aksen — pemisah warna antara gambar & konten (non-large saja,
              varian large pakai flex-row sehingga strip horizontal tidak pas) */}
          {accentBar && !large && (
            <div className={`h-1.5 w-full shrink-0 ${accentBar}`} aria-hidden="true" />
          )}

          {/* Content Section */}
          <div
            className={`p-6 flex-1 flex flex-col justify-between space-y-4 ${large ? "md:p-8 md:justify-center" : ""}`}
          >
            {children}
          </div>

          {/* Garis aksen hover — memakai warna aksen kartunya sendiri, bukan
              gradien primary→tertiary tetap. Kartu di halaman TOGA (hijau)
              atau Budaya (emas) sebelumnya selalu menumbuhkan garis biru-emas
              yang tidak ada hubungannya dengan halamannya. */}
          <motion.div
            className={`absolute bottom-0 left-0 h-1 z-10 ${accentBar ?? "bg-on-surface"}`}
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
