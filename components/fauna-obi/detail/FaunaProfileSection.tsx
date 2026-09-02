"use client";

import { motion } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import {
  FAUNA_DETAIL_CONTENT,
  getFaunaAccent,
  nextFaunaAccent,
  FAUNA_ACCENT_STYLES,
  type Fauna,
} from "@/constants/fauna";

type FaunaProfileSectionProps = {
  fauna: Fauna;
};

export function FaunaProfileSection({ fauna }: FaunaProfileSectionProps) {
  if (!fauna.description && !fauna.physical_characteristics) return null;

  const accent = getFaunaAccent(fauna.class);
  const secondAccent = nextFaunaAccent(accent);
  const styles = FAUNA_ACCENT_STYLES[accent];
  const secondStyles = FAUNA_ACCENT_STYLES[secondAccent];

  return (
    <div className="space-y-6">
      {fauna.description && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className={`bg-background p-6 md:p-8 border-4 border-secondary/40 rounded-2xl hard-shadow-lg space-y-3`}
        >
          <div className="flex items-center justify-between border-b-2 border-dashed border-outline-variant pb-5">
            <h2 className="font-serif text-2xl font-black text-on-surface">
              {FAUNA_DETAIL_CONTENT.descriptionTitle}
            </h2>
            <BookOpen className={`w-6 h-6 text-secondary/70`} />
          </div>
          <p className="text-on-surface-variant leading-relaxed font-medium whitespace-pre-line">
            {fauna.description}
          </p>
        </motion.section>
      )}

      {fauna.physical_characteristics && (
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
          className={`bg-background p-6 md:p-8 border-4 border-tertiary rounded-2xl hard-shadow-lg space-y-3`}
        >
          <div className="flex items-center justify-between border-b-2 border-dashed border-outline-variant pb-5">
            <h2 className="font-serif text-2xl font-black text-on-surface">
              {FAUNA_DETAIL_CONTENT.physicalTitle}
            </h2>
            <Sparkles className={`w-6 h-6 text-tertiary/60`} />
          </div>
          <p className="text-on-surface-variant leading-relaxed font-medium whitespace-pre-line">
            {fauna.physical_characteristics}
          </p>
        </motion.section>
      )}
    </div>
  );
}
