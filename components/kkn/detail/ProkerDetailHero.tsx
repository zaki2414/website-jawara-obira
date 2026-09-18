"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Award, MapPin } from "lucide-react";
import { VILLAGE_ACCENT_STYLES, type VillageAccent } from "@/components/kkn/kknAccent";

type ProkerDetailHeroProps = {
  title: string;
  coverImage?: string | null;
  villageName?: string | null;
  pemilik?: string | null;
  waktu?: string | null;
  accent: VillageAccent;
};

export function ProkerDetailHero({ title, coverImage, villageName, pemilik, waktu, accent }: ProkerDetailHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const styles = VILLAGE_ACCENT_STYLES[accent];

  return (
    <div className="space-y-6 mb-10">
      <Link
        href="/kkn/proker"
        className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <motion.span
          animate={shouldReduceMotion ? {} : { x: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: shouldReduceMotion ? 0 : Infinity }}
          className="inline-flex"
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.span>
        Kembali ke Daftar Program
      </Link>

      {/* Kicker bar warna — konsisten dengan pola TogaDetailHero / HeroBanner budaya */}
      <div className={`h-2 w-28 rounded-t-full ${styles.topBar} ml-4`} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-72 md:h-115 border-4 border-on-surface rounded-2xl overflow-hidden hard-shadow-lg bg-surface-container-high"
      >
        {coverImage ? (
          <Image
            src={coverImage}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${styles.badge}`}>
            <Award className="w-24 h-24" />
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/40 to-transparent" />

        <div className="absolute inset-0 flex items-end p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-3 w-full"
          >
            {villageName && (
              <span
                className={`inline-flex items-center gap-1.5 text-label-sm font-black uppercase tracking-widest px-3 py-1 rounded-md border-2 border-on-surface ${styles.badge}`}
              >
                <MapPin className="w-3.5 h-3.5" /> Wilayah Tugas: {villageName}
              </span>
            )}
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] drop-shadow-lg">
              {title}
            </h1>

            {(pemilik || waktu) && (
              <p className="text-white/80 text-sm md:text-base font-medium flex flex-wrap items-center gap-x-2 gap-y-1">
                {pemilik && <span>Digagas oleh {pemilik}</span>}
                {pemilik && waktu && <span aria-hidden="true">·</span>}
                {waktu && <span>{waktu}</span>}
              </p>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
