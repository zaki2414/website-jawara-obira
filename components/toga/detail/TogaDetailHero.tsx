"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Sprout } from "lucide-react";
import {
  TOGA_DETAIL_CONTENT,
  getTogaAccentFromSlug,
  TOGA_ACCENT_STYLES,
  type TogaPlant,
} from "@/constants/toga";

type TogaDetailHeroProps = {
  plant: TogaPlant;
};

export function TogaDetailHero({ plant }: TogaDetailHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const accent = getTogaAccentFromSlug(plant.slug);
  const styles = TOGA_ACCENT_STYLES[accent];

  return (
    <div className="space-y-6 mb-10">
      <Link
        href="/toga"
        className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <motion.span
          animate={shouldReduceMotion ? {} : { x: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: shouldReduceMotion ? 0 : Infinity }}
          className="inline-flex"
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.span>
        {TOGA_DETAIL_CONTENT.backLabel}
      </Link>

      {/* Kicker bar warna — konsisten dengan strip aksen di kartu listing */}
      <div className={`h-2 w-28 rounded-t-full ${styles.topBar} ml-4`} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-72 md:h-115 border-4 border-on-surface rounded-2xl overflow-hidden hard-shadow-lg bg-surface-container-high"
      >
        {plant.thumbnail_url ? (
          <Image
            src={plant.thumbnail_url}
            alt={plant.name_id}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${styles.badge}`}>
            <Sprout className="w-24 h-24" />
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
            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] drop-shadow-lg">
              {plant.name_id}
            </h1>
            <p className="text-white/90 italic text-base md:text-lg font-medium">
              {plant.name_latin}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
