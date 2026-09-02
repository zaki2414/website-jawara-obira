"use client";

import { motion } from "framer-motion";
import { Tag } from "lucide-react";
import {
  UMKM_DETAIL_CONTENT,
  BUSINESS_ACCENT_STYLES,
  nextAccent,
  type BusinessAccent,
} from "@/constants/umkm";

type FeaturesSidebarProps = {
  features: string[];
  accent: BusinessAccent;
};

export function FeaturesSidebar({ features, accent }: FeaturesSidebarProps) {
  const styles = BUSINESS_ACCENT_STYLES[accent];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6 }}
      className="p-6 bg-background border-4 border-secondary rounded-2xl hard-shadow-lg space-y-4"
    >
      <div className="flex items-center justify-between border-b-2 border-dashed border-on-surface/15 pb-4">
        <h3 className="font-serif font-black text-on-surface flex items-center gap-2 text-lg">
          {UMKM_DETAIL_CONTENT.featuresTitle}
        </h3>
        <Tag className="w-5 h-5 text-secondary/50" />
      </div>

      <ul className="space-y-3">
        {features.map((f, i) => {
          // Rotasi 3-tona primary/tertiary/cream per fitur supaya daftar tidak
          // seragam satu titik warna, mengikuti pola rotasi yang sama dengan
          // topBar kategori produk di ProductsSection.tsx.
          let itemAccent = accent;
          for (let k = 0; k < i; k++) itemAccent = nextAccent(itemAccent);
          const itemStyles = BUSINESS_ACCENT_STYLES[itemAccent];

          return (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              className="flex items-start gap-3 text-sm font-bold text-on-surface"
            >
              <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${itemStyles.chipDot}`} />
              <span>{f}</span>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
}