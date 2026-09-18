"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { EntityCardShell } from "@/components/shared/EntityCardShell";
import { Badge } from "@/components/ui/badge";
import {
  umkmCardVariants,
  UMKM_ICONS,
  formatBusinessType,
  getBusinessAccentByIndex,
  BUSINESS_ACCENT_STYLES,
  type UMKMItem,
} from "@/constants/umkm";

type UMKMCardProps = {
  item: UMKMItem;
  index: number;
  large?: boolean;
};

export function UMKMCard({ item, index, large = false }: UMKMCardProps) {
  const { Store, MapPin, Sparkles } = UMKM_ICONS;
  const shouldReduceMotion = useReducedMotion();
  // Aksen dirotasi dari POSISI kartu (bukan business_type) supaya
  // primary/tertiary/cream selalu kelihatan variatif di grid — lihat
  // catatan di getBusinessAccentByIndex, constants/umkm.ts.
  const accent = getBusinessAccentByIndex(index);
  const styles = BUSINESS_ACCENT_STYLES[accent];

  return (
    <EntityCardShell
      href={`/umkm/${item.slug}`}
      index={index}
      variants={umkmCardVariants}
      thumbnailUrl={item.thumbnail_url}
      thumbnailAlt={item.name}
      FallbackIcon={Store}
      large={large}
      accentBar={styles.topBar}
      topBadges={
        <Badge variant={styles.badge} className="absolute top-4 right-4 z-10">
          {formatBusinessType(item.business_type)}
        </Badge>
      }
    >
      <div>
        <h3
          className={`font-serif font-black text-on-surface ${styles.hoverText} transition-colors leading-tight mb-2 line-clamp-2 ${
            large ? "text-2xl md:text-3xl" : "text-2xl min-h-14"
          }`}
        >
          {item.name}
        </h3>
        <p className="text-sm text-on-surface-variant leading-relaxed min-h-10 line-clamp-2">
          {item.short_description}
        </p>
      </div>

      <div className="space-y-3 pt-3 border-t border-dashed border-outline-variant mt-auto shrink-0">
        {item.location_text && (
          <p className={`text-label-sm normal-case tracking-normal font-semibold text-on-surface-variant flex items-center gap-2 ${styles.hoverText} transition-colors`}>
            <MapPin className="w-4 h-4 text-primary shrink-0" />
            {item.location_text}
          </p>
        )}

        {item.umkm_features && item.umkm_features.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <AnimatePresence>
              {item.umkm_features.slice(0, 2).map((f, i) => (
                <motion.span
                  key={i}
                  className={`inline-flex items-center gap-1 px-2.5 py-1 border-2 text-label-sm rounded-full font-bold ${styles.chip}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <motion.div
                    animate={shouldReduceMotion ? {} : { rotate: 360 }}
                    transition={{ duration: 3, repeat: shouldReduceMotion ? 0 : Infinity, ease: "linear" as const }}
                  >
                    <Sparkles className="w-3 h-3" />
                  </motion.div>
                  {f.feature}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </EntityCardShell>
  );
}
