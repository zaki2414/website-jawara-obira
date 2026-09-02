"use client";

import { motion } from "framer-motion";
import { Store } from "lucide-react";
import {
  UMKM_DETAIL_CONTENT,
  BUSINESS_ACCENT_STYLES,
  type BusinessAccent,
} from "@/constants/umkm";

type ProfileSectionProps = {
  description: string;
  accent: BusinessAccent;
};

export function ProfileSection({ description, accent }: ProfileSectionProps) {
  const styles = BUSINESS_ACCENT_STYLES[accent];
  const paragraphs = description
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="bg-background p-8 border-4 border-primary rounded-2xl hard-shadow-lg space-y-6"
    >
      <div className="flex items-center justify-between border-b-2 border-dashed border-outline-variant pb-5">
        <h2 className="font-serif text-2xl font-black text-on-surface">
          {UMKM_DETAIL_CONTENT.profileTitle}
        </h2>
        <Store className="w-6 h-6 text-primary/50" />
      </div>

      <div className="relative pl-5 space-y-4 text-sm font-medium text-on-surface-variant leading-relaxed">
        {/* Accent bar vertikal di sisi kiri paragraf, serupa dengan style kategori produk */}
        <span
          className={`absolute left-0 top-1 bottom-1 w-1 rounded-full ${styles.topBar}`}
          aria-hidden="true"
        />

        {paragraphs.map((paragraph, i) => (
          <p key={i}>
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  );
}