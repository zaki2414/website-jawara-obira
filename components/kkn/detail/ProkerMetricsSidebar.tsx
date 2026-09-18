"use client";

import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { VILLAGE_ACCENT_STYLES, type VillageAccent } from "@/components/kkn/kknAccent";

export type ProkerMetric = { label: string; value: string };

type ProkerMetricsSidebarProps = {
  metrics: ProkerMetric[];
  border: string;
  accent: VillageAccent;
};

// Satu-satunya tempat angka pencapaian proker tampil ke publik — dulu ada
// juga key_achievements (daftar kalimat), dihapus karena isinya cuma
// menulis ulang angka yang sama persis sebagai kalimat dan tidak pernah
// benar-benar tampil di publik (achievements-nya sendiri yang tampil,
// impact_metrics-nya yang mati). Sekarang KPI ini satu-satunya sumber,
// jadi field-nya bebas sepanjang apapun (bukan 3 kotak tetap lagi).
export function ProkerMetricsSidebar({ metrics, border, accent }: ProkerMetricsSidebarProps) {
  const entries = metrics.filter((m) => m.label && m.value);
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
          <BarChart3 className="w-5 h-5" aria-hidden="true" />
        </span>
        Kuantifikasi Dampak
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {entries.map(({ label, value }, idx) => {
          const valueAccent = idx % 2 === 0 ? "text-primary" : "text-on-tertiary";
          return (
            <div key={label} className="p-4 bg-surface-container-low border-2 border-on-surface rounded-lg text-center">
              <div className={`text-2xl font-serif font-black mb-1 wrap-break-word ${valueAccent}`}>
                {value}
              </div>
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
