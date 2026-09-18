"use client";

import { EntityCardShell } from "@/components/shared/EntityCardShell";
import { MapPin } from "lucide-react";
import {
  faunaCardVariants,
  getIucnBrutalistClass, getIucnLabel,
  getFaunaAccent,
  FAUNA_ACCENT_STYLES,
  FAUNA_ICONS,
  type Fauna,
} from "@/constants/fauna";

type FaunaCardProps = {
  item: Fauna;
  index: number;
  large?: boolean;
};

export function FaunaCard({ item, index, large = false }: FaunaCardProps) {
  const { Bird } = FAUNA_ICONS;
  const accent = getFaunaAccent(item.class);
  const styles = FAUNA_ACCENT_STYLES[accent];

  return (
    <EntityCardShell
      href={`/fauna-obi/${item.slug}`}
      index={index}
      variants={faunaCardVariants}
      thumbnailUrl={item.thumbnail_url}
      thumbnailAlt={item.name_local}
      FallbackIcon={Bird}
      large={large}
      accentBar={styles.topBar}
      topBadges={
        item.iucn_status ? (
          <span
            className={`absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full border-2 border-on-surface text-label-sm font-black uppercase tracking-widest hard-shadow-sm ${getIucnBrutalistClass(item.iucn_status)}`}
          >
            {/* Label ringkas (kode + arti), bukan teks mentah database
                "Least Concern (LC)" yang meluber dari badge kecil. */}
            {getIucnLabel(item.iucn_status)}
          </span>
        ) : undefined
      }
    >
      <div>
        {item.class && (
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md border-2 border-on-surface text-label-sm font-black uppercase tracking-wider mb-2 hard-shadow-sm ${styles.badge}`}
          >
            {item.class}
          </span>
        )}
        <h3
          className={`font-serif font-black text-on-surface ${styles.hoverText} transition-colors leading-tight mb-1 line-clamp-2 ${
            large ? "text-2xl md:text-3xl" : "text-2xl min-h-14"
          }`}
        >
          {item.name_local}
        </h3>
        <p className="text-sm italic text-on-surface-variant leading-relaxed line-clamp-1">
          {item.name_scientific}
        </p>
      </div>

      {(item.family || item.distribution) && (
        <div className="space-y-2 pt-3 border-t border-dashed border-outline-variant mt-auto shrink-0">
          {item.family && (
            <p className="text-label-sm normal-case tracking-normal font-semibold text-on-surface-variant">
              Famili: {item.family}
            </p>
          )}
          {item.distribution && (
            <p className="text-label-sm normal-case tracking-normal font-semibold text-on-surface-variant flex items-center gap-2">
              <MapPin className={`w-4 h-4 shrink-0 ${styles.text}`} />
              <span className="line-clamp-1">{item.distribution}</span>
            </p>
          )}
        </div>
      )}
    </EntityCardShell>
  );
}
