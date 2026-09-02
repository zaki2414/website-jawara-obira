"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import type { MouseEvent } from "react";
import { MapPin, Store } from "lucide-react";
import {
  formatBusinessType,
  getBusinessAccent,
  BUSINESS_ACCENT_STYLES,
  type UMKM,
} from "@/constants/umkm";

type HeroBannerProps = {
  umkm: UMKM;
};

/**
 * Hero selalu berada di atas fold (elemen pertama yang dilihat pengguna), jadi
 * animasi masuknya memakai `animate` (jalan begitu ter-mount) — BUKAN
 * `whileInView`/`viewport`. Versi sebelumnya menggantungkan reveal judul toko
 * pada IntersectionObserver (`whileInView` bersarang + text-mask translateY),
 * yang membuat judul tersangkut di posisi "hidden" (translateY 110%, tak
 * kelihatan) kalau observer tidak sempat trigger sebelum render selesai.
 */
export function HeroBanner({ umkm }: HeroBannerProps) {
  const prefersReducedMotion = useReducedMotion();
  const accent = getBusinessAccent(umkm.business_type);
  const styles = BUSINESS_ACCENT_STYLES[accent];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [4, -4]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-4, 4]), {
    stiffness: 150,
    damping: 20,
  });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const bounds = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - bounds.left) / bounds.width - 0.5);
    mouseY.set((e.clientY - bounds.top) / bounds.height - 0.5);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <div className="space-y-0">
      {/* Kicker bar warna kategori — konsisten dengan badge kartu di listing */}
      <div className={`h-2 w-28 rounded-t-full ${styles.topBar} ml-4`} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ perspective: 1200 }}
        className="relative w-full h-80 md:h-115 border-4 border-on-surface rounded-2xl overflow-hidden hard-shadow-lg bg-surface-container-high"
      >
        <motion.div
          style={{ rotateX, rotateY, scale: 1.04 }}
          className="relative w-full h-full will-change-transform"
        >
          {umkm.thumbnail_url ? (
            <Image
              src={umkm.thumbnail_url}
              alt={umkm.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1200px"
              className="object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${styles.panel}`}>
              <Store className="w-24 h-24 text-on-surface/20" />
            </div>
          )}
        </motion.div>

        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-end p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-4 w-full"
          >
            <span
              className={`inline-block px-3.5 py-1.5 ${styles.solidClass} text-label-sm font-black rounded-full border-2 border-on-surface uppercase tracking-widest hard-shadow-sm`}
            >
              {formatBusinessType(umkm.business_type)}
            </span>

            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] drop-shadow-lg">
              {umkm.name}
            </h1>

            {umkm.location_text && (
              <div className="text-white/90 flex items-center gap-2 text-sm font-bold">
                {/* Selalu tertiary (bukan accent dinamis) — icon ini di atas overlay gelap,
                    accent cream (dark text) akan hilang kontras di sini. */}
                <MapPin className="w-4 h-4 text-tertiary shrink-0" />
                <span>{umkm.location_text}</span>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
