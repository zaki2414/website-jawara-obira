"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { VILLAGE_ACCENT_STYLES, type VillageAccent } from "@/components/kkn/kknAccent";

type ProkerMetricsSidebarProps = {
  metrics: Record<string, string | number>;
  border: string;
  accent: VillageAccent;
};

export function ProkerMetricsSidebar({ metrics, border, accent }: ProkerMetricsSidebarProps) {
  const entries = Object.entries(metrics).filter(
    ([key, value]) => value && value !== "" && key.includes("_num"),
  );
  if (entries.length === 0) return null;
  const styles = VILLAGE_ACCENT_STYLES[accent];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`bg-background p-6 border-4 ${border} rounded-2xl hard-shadow-lg space-y-4`}
    >
      <h3 className="font-serif text-lg font-black text-on-surface flex items-center gap-2 border-b-2 border-dashed border-outline-variant pb-3">
        <span className={`p-1.5 rounded-lg shrink-0 ${styles.iconChip}`}>
          <BarChart3 className="w-5 h-5" />
        </span>
        Kuantifikasi Dampak
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {entries.map(([key, value], idx) => {
          const labelKey = key.replace("_num", "_label");
          const label = metrics[labelKey] || key.replace("_num", "").replace("_", " ");
          const valueAccent = idx % 2 === 0 ? "text-primary" : "text-on-tertiary";

          return (
            <div key={key} className="p-4 bg-surface-container-low border-2 border-on-surface rounded-lg text-center">
              <div className={`text-2xl font-serif font-black mb-1 ${valueAccent}`}>{value}</div>
              <div className="text-xs uppercase font-black tracking-wide text-on-surface-variant">
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
