"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Images } from "lucide-react";
import { VILLAGE_ACCENT_STYLES, type VillageAccent } from "@/components/kkn/kknAccent";

type JournalInfoSidebarProps = {
  activityDate?: string | null;
  villageName?: string | null;
  attachmentCount: number;
  border: string;
  accent: VillageAccent;
};

export function JournalInfoSidebar({
  activityDate,
  villageName,
  attachmentCount,
  border,
  accent,
}: JournalInfoSidebarProps) {
  const styles = VILLAGE_ACCENT_STYLES[accent];

  return (
    <motion.aside
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className={`bg-background p-6 border-4 ${border} rounded-2xl hard-shadow-lg space-y-4`}
    >
      <h3 className="font-serif text-lg font-black text-on-surface border-b-2 border-dashed border-outline-variant pb-3">
        Info Jurnal
      </h3>

      <div className="space-y-3">
        {activityDate && (
          <div className="flex items-center gap-3 p-3 bg-surface-container-low border-2 border-on-surface rounded-lg">
            <span className={`p-1.5 rounded-lg shrink-0 ${styles.iconChip}`}>
              <Calendar className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs uppercase font-black tracking-wide text-on-surface-variant">Tanggal</p>
              <p className="text-sm font-bold text-on-surface">{activityDate}</p>
            </div>
          </div>
        )}

        {villageName && (
          <div className="flex items-center gap-3 p-3 bg-surface-container-low border-2 border-on-surface rounded-lg">
            <span className={`p-1.5 rounded-lg shrink-0 ${styles.iconChip}`}>
              <MapPin className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs uppercase font-black tracking-wide text-on-surface-variant">Lokasi</p>
              <p className="text-sm font-bold text-on-surface">{villageName}</p>
            </div>
          </div>
        )}

        {attachmentCount > 0 && (
          <div className="flex items-center gap-3 p-3 bg-surface-container-low border-2 border-on-surface rounded-lg">
            <span className={`p-1.5 rounded-lg shrink-0 ${styles.iconChip}`}>
              <Images className="w-4 h-4" />
            </span>
            <div>
              <p className="text-xs uppercase font-black tracking-wide text-on-surface-variant">Lampiran Foto</p>
              <p className="text-sm font-bold text-on-surface">{attachmentCount} dokumentasi</p>
            </div>
          </div>
        )}
      </div>
    </motion.aside>
  );
}
