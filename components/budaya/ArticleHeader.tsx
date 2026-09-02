"use client";

import { motion, type Variants, useReducedMotion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Calendar, MapPin, Sparkles } from "lucide-react";
import {
  detailContainerVariants,
  detailItemVariants,
  DETAIL_CONTENT,
  getCategoryAccent,
  CATEGORY_ACCENT_STYLES,
  type CultureItem,
} from "@/constants/budaya";

type ArticleHeaderProps = {
  culture: Pick<
    CultureItem,
    "category" | "title" | "published_at" | "villages"
  >;
};

export function ArticleHeader({ culture }: ArticleHeaderProps) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const shouldReduceMotion = useReducedMotion();
  const accent = getCategoryAccent(culture.category);
  const styles = CATEGORY_ACCENT_STYLES[accent];

  const containerVariants: Variants = detailContainerVariants;
  const itemVariants: Variants = detailItemVariants;

  return (
    <motion.header
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="space-y-6"
    >
      {/* Category Badge — warna mengikuti taksonomi kategori */}
      <motion.div
        variants={itemVariants}
        className={`inline-flex items-center gap-2 text-label-sm font-black ${styles.badge} border-2 border-on-surface px-4 py-2 rounded-full uppercase tracking-wider w-fit hard-shadow-sm`}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          animate={shouldReduceMotion ? {} : { rotate: 360 }}
          transition={{
            duration: 20,
            repeat: shouldReduceMotion ? 0 : Infinity,
            ease: "linear" as const,
          }}
        >
          <Sparkles className="w-4 h-4" />
        </motion.div>
        {culture.category}
      </motion.div>

      {/* Title */}
      <motion.h1
        variants={itemVariants}
        className="font-serif text-4xl lg:text-5xl font-black text-on-surface leading-tight tracking-tight"
      >
        {culture.title}
      </motion.h1>

      {/* Animated underline */}
      <motion.div
        className="h-1 bg-linear-to-r from-primary via-tertiary to-transparent"
        initial={{ width: 0 }}
        animate={inView ? { width: "100%" } : { width: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        style={{ maxWidth: "300px" }}
      />

      {/* Meta Information (Tanggal + Desa) — panel bertinta warna kategori */}
      <motion.div
        variants={itemVariants}
        className="inline-flex flex-wrap items-center gap-x-6 gap-y-3 text-label-sm font-black uppercase tracking-widest text-on-surface-variant p-4 bg-surface-container-low border-2 border-on-surface rounded-lg"
      >
        {culture.published_at && (
          <div className="flex items-center gap-2 group hover:text-primary transition-colors">
            <Calendar className="w-4 h-4 text-tertiary group-hover:scale-110 transition-transform" />
            <span>
              {new Date(culture.published_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {culture.villages && culture.published_at && (
          <div className="w-px h-4 bg-on-surface/20" aria-hidden="true" />
        )}

        {culture.villages && (
          <div className="flex items-center gap-2 group hover:text-primary transition-colors">
            <MapPin className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            <span>
              {DETAIL_CONTENT.metaLabels.origin}: {culture.villages.name}
            </span>
          </div>
        )}
      </motion.div>
    </motion.header>
  );
}
