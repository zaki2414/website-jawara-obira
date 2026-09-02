"use client";

import { motion } from "framer-motion";
import { MapPin, ExternalLink, Compass } from "lucide-react";
import {
  UMKM_DETAIL_CONTENT,
  BUSINESS_ACCENT_STYLES,
  type BusinessAccent,
} from "@/constants/umkm";

type MapInfoPanelProps = {
  locationText?: string;
  blok?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  accent: BusinessAccent;
};

export function MapInfoPanel({ locationText, blok, latitude, longitude, accent }: MapInfoPanelProps) {
  const styles = BUSINESS_ACCENT_STYLES[accent];
  const hasPin = latitude != null && longitude != null;
  const gmapsUrl = hasPin ? `https://www.google.com/maps?q=${latitude},${longitude}` : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-background p-6 border-4 border-secondary rounded-2xl hard-shadow-lg space-y-4"
    >
      <h3 className="font-serif text-lg font-black text-on-surface">
        {UMKM_DETAIL_CONTENT.mapTitle}
      </h3>

      {hasPin ? (
        <div className="relative h-36 w-full overflow-hidden rounded-xl border-2 border-on-surface">
          <iframe
            title="Lokasi di Google Maps"
            src={`https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`}
            className="h-full w-full border-0"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="relative w-full h-36 rounded-xl border-2 border-dashed border-on-surface/25 overflow-hidden bg-[radial-gradient(rgba(29,28,24,0.07)_1.5px,transparent_1.5px)] bg-size-[16px_16px] flex flex-col items-center justify-center gap-1.5 text-on-surface-variant">
          <MapPin className="w-7 h-7 text-on-surface-variant/50" />
          <span className="text-label-sm font-black uppercase tracking-wide">
            {UMKM_DETAIL_CONTENT.mapSubtitle}
          </span>
          <span className="text-label-sm text-on-surface-variant/60 italic">
            {UMKM_DETAIL_CONTENT.mapEmptyText}
          </span>
        </div>
      )}

      {blok && (
        <p className="flex items-center gap-1.5 text-label-sm font-bold text-on-surface-variant">
          <Compass className="size-3.5 shrink-0" aria-hidden="true" />
          {UMKM_DETAIL_CONTENT.blokLabel}: {blok}
        </p>
      )}

      {locationText && (
        <p className={`text-label-sm font-bold text-on-surface-variant border-l-2 pl-3 ${styles.border}`}>
          {locationText}
        </p>
      )}

      {gmapsUrl && (
        <a
          href={gmapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-on-surface px-4 py-2.5 text-label-sm font-black uppercase tracking-wide hard-shadow-sm hard-shadow-hover press-effect transition-colors ${styles.solidClass}`}
        >
          <ExternalLink className="size-4 shrink-0" aria-hidden="true" />
          {UMKM_DETAIL_CONTENT.gmapsButtonLabel}
        </a>
      )}
    </motion.div>
  );
}