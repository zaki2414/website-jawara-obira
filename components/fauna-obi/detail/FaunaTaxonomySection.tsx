"use client";

import { motion } from "framer-motion";
import { Info, ShieldAlert } from "lucide-react";
import {
  FAUNA_DETAIL_CONTENT,
  getFaunaAccent,
  nextFaunaAccent,
  FAUNA_ACCENT_STYLES,
  type Fauna,
} from "@/constants/fauna";

type FaunaTaxonomySectionProps = {
  fauna: Fauna;
};

export function FaunaTaxonomySection({ fauna }: FaunaTaxonomySectionProps) {
  const { labels } = FAUNA_DETAIL_CONTENT;
  const hasTaxonomy = fauna.class || fauna.order_name || fauna.family;
  const accent = getFaunaAccent(fauna.class);
  const styles = FAUNA_ACCENT_STYLES[accent];
  // Ritme A/B/A pada label 3 kartu taksonomi supaya tidak seragam satu warna,
  // meniru pola label Populasi/Wilayah di kartu acuan InteractiveMap.tsx.
  const altStyles = FAUNA_ACCENT_STYLES[nextFaunaAccent(accent)];

  if (!hasTaxonomy && !fauna.conservation_notes) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`p-6 md:p-8 bg-background border-4 border-primary rounded-2xl hard-shadow-lg space-y-5`}
    >
      <div className="flex items-center justify-between border-b-2 border-dashed border-outline-variant pb-5">
        <h2 className="font-serif text-2xl font-black text-on-surface">
          {FAUNA_DETAIL_CONTENT.taxonomyTitle}
        </h2>
        <Info className={`w-6 h-6 text-primary`} />
      </div>

      {hasTaxonomy && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {fauna.class && (
            <div className="bg-surface-container-low p-3 border-2 border-on-surface rounded-lg">
              <span className={`block text-label-sm font-black uppercase tracking-wider mb-0.5 ${styles.text}`}>
                {labels.class}
              </span>
              <span className="font-bold text-on-surface text-sm">{fauna.class}</span>
            </div>
          )}
          {fauna.order_name && (
            <div className="bg-surface-container-low p-3 border-2 border-on-surface rounded-lg">
              <span className={`block text-label-sm font-black uppercase tracking-wider mb-0.5 ${altStyles.text}`}>
                {labels.order}
              </span>
              <span className="font-bold text-on-surface text-sm">{fauna.order_name}</span>
            </div>
          )}
          {fauna.family && (
            <div className="bg-surface-container-low p-3 border-2 border-on-surface rounded-lg">
              <span className={`block text-label-sm font-black uppercase tracking-wider mb-0.5 ${styles.text}`}>
                {labels.family}
              </span>
              <span className="font-bold text-on-surface text-sm">{fauna.family}</span>
            </div>
          )}
        </div>
      )}

      {fauna.conservation_notes && (
        <div className="bg-error-container/40 p-4 border-2 border-error/40 rounded-lg">
          <span className="inline-flex items-center gap-1.5 text-label-sm font-black uppercase tracking-wider text-on-surface mb-1.5">
            <ShieldAlert className="w-4 h-4 text-error" />
            {FAUNA_DETAIL_CONTENT.conservationTitle}
          </span>
          <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
            {fauna.conservation_notes}
          </p>
        </div>
      )}
    </motion.section>
  );
}
