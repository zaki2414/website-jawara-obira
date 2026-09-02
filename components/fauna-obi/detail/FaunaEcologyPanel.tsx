"use client";

import { motion } from "framer-motion";
import { Leaf } from "lucide-react";
import {
  FAUNA_DETAIL_CONTENT,
  getFaunaAccent,
  nextFaunaAccent,
  FAUNA_ACCENT_STYLES,
  type Fauna,
} from "@/constants/fauna";

type FaunaEcologyPanelProps = {
  fauna: Fauna;
};

export function FaunaEcologyPanel({ fauna }: FaunaEcologyPanelProps) {
  const { labels } = FAUNA_DETAIL_CONTENT;
  const hasEcology =
    fauna.habitat || fauna.diet || fauna.behavior || fauna.distribution;

  if (!hasEcology) return null;

  // Sengaja pakai aksen kebalikan dari kelas taksa (dipakai taxonomy/profile di
  // atas) supaya panel ekologi ini beda warna — ritme dua-nada primary/tertiary
  // saat menyusuri halaman dari atas ke bawah.
  const baseAccent = getFaunaAccent(fauna.class);
  const accent = nextFaunaAccent(baseAccent);
  const styles = FAUNA_ACCENT_STYLES[accent];
  // Ritme A/B/A/B pada label 4 kartu ekologi — baseAccent dipakai sebagai nada
  // kedua supaya tidak seragam satu warna, meniru label Populasi/Wilayah
  // di kartu acuan InteractiveMap.tsx.
  const altStyles = FAUNA_ACCENT_STYLES[baseAccent];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className={`p-6 bg-background border-4 border-secondary/40 rounded-2xl hard-shadow-lg space-y-4`}
    >
      <div className="flex items-center justify-between border-b-2 border-dashed border-outline-variant pb-5">
        <h3 className="font-serif text-lg font-black text-on-surface">
          {FAUNA_DETAIL_CONTENT.ecologyTitle}
        </h3>
        <Leaf className={`w-6 h-6 text-secondary/70`} />
      </div>

      <div className="space-y-3 text-sm text-on-surface-variant">
        {fauna.habitat && (
          <div className="p-3 rounded-lg border-2 border-on-surface bg-surface-container-low">
            <strong className={`block text-label-sm uppercase font-black tracking-wide mb-1 ${styles.text}`}>
              {labels.habitat}
            </strong>
            {fauna.habitat}
          </div>
        )}
        {fauna.diet && (
          <div className="p-3 rounded-lg border-2 border-on-surface bg-surface-container-low">
            <strong className={`block text-label-sm uppercase font-black tracking-wide mb-1 ${altStyles.text}`}>
              {labels.diet}
            </strong>
            {fauna.diet}
          </div>
        )}
        {fauna.behavior && (
          <div className="p-3 rounded-lg border-2 border-on-surface bg-surface-container-low">
            <strong className={`block text-label-sm uppercase font-black tracking-wide mb-1 ${styles.text}`}>
              {labels.behavior}
            </strong>
            {fauna.behavior}
          </div>
        )}
        {fauna.distribution && (
          <div className="p-3 rounded-lg border-2 border-on-surface bg-surface-container-low font-bold">
            <strong className={`block text-label-sm uppercase font-black tracking-wide mb-1 ${altStyles.text}`}>
              {labels.distribution}
            </strong>
            {fauna.distribution}
          </div>
        )}
      </div>
    </motion.section>
  );
}
