"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { VILLAGE_ACCENT_STYLES, type VillageAccent } from "@/components/kkn/kknAccent";

type ProkerAchievementsSectionProps = {
  achievements: string[];
  border: string;
  accent: VillageAccent;
};

export function ProkerAchievementsSection({ achievements, border, accent }: ProkerAchievementsSectionProps) {
  if (achievements.length === 0) return null;
  const styles = VILLAGE_ACCENT_STYLES[accent];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6 }}
      className={`space-y-4 bg-background p-6 border-4 ${border} rounded-2xl hard-shadow-lg`}
    >
      <h3 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
        <span className={`p-1.5 rounded-lg shrink-0 ${styles.iconChip}`}>
          <Trophy className="w-5 h-5" />
        </span>
        Indikator Pencapaian Utama
      </h3>
      <ul className="space-y-2.5 font-sans font-medium text-on-surface-variant text-sm md:text-base">
        {achievements.map((item, i) => (
          <li key={i} className="flex items-start gap-3 bg-surface-container-low p-3 rounded-lg border-2 border-on-surface">
            <span className={`font-black text-sm bg-background border-2 border-on-surface px-1.5 py-0.5 rounded shrink-0 ${styles.text}`}>
              #{i + 1}
            </span>
            <span className="pt-0.5 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </motion.section>
  );
}
