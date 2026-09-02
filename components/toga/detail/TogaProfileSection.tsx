"use client";

import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import {
  TOGA_DETAIL_CONTENT,
  getTogaAccentFromSlug,
  TOGA_ACCENT_STYLES,
  type TogaPlant,
} from "@/constants/toga";

type TogaProfileSectionProps = {
  plant: TogaPlant;
};

export function TogaProfileSection({ plant }: TogaProfileSectionProps) {
  if (!plant.description) return null;

  const accent = getTogaAccentFromSlug(plant.slug);
  const styles = TOGA_ACCENT_STYLES[accent];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`bg-background p-6 md:p-8 border-4 ${styles.border} rounded-2xl hard-shadow-lg space-y-3`}
    >
      <h2 className="font-serif text-xl font-black text-on-surface flex items-center gap-2 border-b-2 border-dashed border-outline-variant pb-4">
        <BookOpen className={`w-5 h-5 ${styles.text}`} />
        {TOGA_DETAIL_CONTENT.descriptionTitle}
      </h2>
      <p className="text-on-surface-variant leading-relaxed font-medium whitespace-pre-line">
        {plant.description}
      </p>
    </motion.section>
  );
}
