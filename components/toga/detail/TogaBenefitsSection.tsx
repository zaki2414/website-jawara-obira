"use client";

import { motion } from "framer-motion";
import { HeartPulse, CheckCircle2 } from "lucide-react";
import {
  TOGA_DETAIL_CONTENT,
  getTogaAccentFromSlug,
  nextTogaAccent,
  TOGA_ACCENT_STYLES,
  type TogaPlant,
} from "@/constants/toga";

type TogaBenefitsSectionProps = {
  plant: TogaPlant;
};

export function TogaBenefitsSection({ plant }: TogaBenefitsSectionProps) {
  const benefits = plant.health_benefits ?? [];
  if (benefits.length === 0) return null;

  const baseAccent = getTogaAccentFromSlug(plant.slug);
  const accent = nextTogaAccent(baseAccent);
  const styles = TOGA_ACCENT_STYLES[accent];
  // Selang-seling per item supaya daftar manfaat tidak seragam satu warna checklist.
  const altStyles = TOGA_ACCENT_STYLES[baseAccent];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay: 0.05 }}
      className={`p-6 bg-background border-4 ${styles.border} rounded-2xl hard-shadow-lg space-y-4`}
    >
      <h3 className="font-serif text-lg font-black text-on-surface flex items-center gap-2 border-b-2 border-dashed border-outline-variant pb-3">
        <HeartPulse className={`w-5 h-5 ${styles.text}`} />
        {TOGA_DETAIL_CONTENT.benefitsTitle}
      </h3>
      <ul className="space-y-2.5">
        {benefits.map((benefit, i) => {
          const itemStyles = i % 2 === 0 ? styles : altStyles;
          return (
            <li
              key={i}
              className="flex items-start gap-2.5 text-on-surface-variant font-medium text-sm bg-surface-container-low p-3 rounded-lg border-2 border-on-surface"
            >
              <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${itemStyles.text}`} />
              <span>{benefit}</span>
            </li>
          );
        })}
      </ul>
    </motion.section>
  );
}
