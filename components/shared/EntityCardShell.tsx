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
          whileHover={{ y: -8, scale: 1.01 }}
          transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
        >
          {/* Cover Image */}
          <div
            className={`relative bg-linear-to-br from-primary/10 to-tertiary/10 ${borderColorClass} overflow-hidden shrink-0 ${
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
              <motion.div
                className="flex items-center justify-center h-full"
                animate={shouldReduceMotion ? {} : { rotate: [0, 360] }}
                transition={{ duration: 20, repeat: shouldReduceMotion ? 0 : Infinity, ease: "linear" as const }}
              >
                <FallbackIcon className="w-16 h-16 text-on-surface/20" />
              </motion.div>
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

          {/* Hover accent line */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-linear-to-r from-primary via-tertiary to-transparent z-10"
            initial={{ width: 0 }}
            whileHover={{ width: "100%" }}
            transition={{ duration: 0.4 }}
          />
        </motion.div>
      </Link>
    </motion.div>
  );
}
