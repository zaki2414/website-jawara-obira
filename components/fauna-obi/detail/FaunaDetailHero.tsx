"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Bird } from "lucide-react";
import {
  FAUNA_DETAIL_CONTENT,
  getIucnBrutalistClass,
  getFaunaAccent,
  FAUNA_ACCENT_STYLES,
  type Fauna,
} from "@/constants/fauna";

type FaunaDetailHeroProps = {
  fauna: Fauna;
};

export function FaunaDetailHero({ fauna }: FaunaDetailHeroProps) {
  const shouldReduceMotion = useReducedMotion();
  const accent = getFaunaAccent(fauna.class);
  const styles = FAUNA_ACCENT_STYLES[accent];

  return (
    <div className="space-y-6 mb-10">
      <Link
        href="/fauna-obi"
        className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
      >
        <motion.span
          animate={shouldReduceMotion ? {} : { x: [0, -4, 0] }}
          transition={{ duration: 1.5, repeat: shouldReduceMotion ? 0 : Infinity }}
          className="inline-flex"
        >
          <ArrowLeft className="w-4 h-4" />
        </motion.span>
        {FAUNA_DETAIL_CONTENT.backLabel}
      </Link>

      {/* Kicker bar warna kelas taksa — konsisten dengan strip aksen di kartu listing */}
      <div className={`h-2 w-28 rounded-t-full ${styles.topBar} ml-4`} aria-hidden="true" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full h-72 md:h-115 border-4 border-on-surface rounded-2xl overflow-hidden hard-shadow-lg bg-surface-container-high"
      >
        {fauna.thumbnail_url ? (
          <Image
            src={fauna.thumbnail_url}
            alt={fauna.name_local}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${styles.badge}`}>
            <Bird className="w-24 h-24" />
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
            <div className="flex flex-wrap items-center gap-2">
              {fauna.class && (
                <span
                  className={`inline-block px-3.5 py-1.5 text-label-sm font-black rounded-full border-2 border-on-surface uppercase tracking-widest hard-shadow-sm ${styles.badge}`}
                >
                  {fauna.class}
                </span>
              )}
              {fauna.iucn_status && (
                <span
                  className={`inline-block px-3.5 py-1.5 text-label-sm font-black rounded-full border-2 border-on-surface uppercase tracking-widest hard-shadow-sm ${getIucnBrutalistClass(fauna.iucn_status)}`}
                >
                  IUCN: {fauna.iucn_status}
                </span>
              )}
            </div>

            <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.05] drop-shadow-lg">
              {fauna.name_local}
            </h1>
            <p className="text-white/90 italic text-base md:text-lg font-medium">
              {fauna.name_scientific}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
