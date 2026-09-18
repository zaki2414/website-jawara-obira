"use client";

import { EntityCardShell } from "@/components/shared/EntityCardShell";
import {
  togaCardVariants,
  getTogaAccent,
  TOGA_ACCENT_STYLES,
  TOGA_ICONS,
  type TogaPlant,
} from "@/constants/toga";

type TogaCardProps = {
  item: TogaPlant;
  index: number;
  large?: boolean;
};

export function TogaCard({ item, index, large = false }: TogaCardProps) {
  const { Sprout } = TOGA_ICONS;
  const accent = getTogaAccent(index);
  const styles = TOGA_ACCENT_STYLES[accent];
  const benefitCount = item.health_benefits?.length ?? 0;

  return (
    <EntityCardShell
      href={`/toga/${item.slug}`}
      index={index}
      variants={togaCardVariants}
      thumbnailUrl={item.thumbnail_url}
      thumbnailAlt={item.name_id}
      FallbackIcon={Sprout}
      large={large}
      accentBar={styles.topBar}
      topBadges={
        benefitCount > 0 ? (
          <span
            className={`absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full border-2 border-on-surface text-label-sm font-black uppercase tracking-widest hard-shadow-sm ${styles.badge}`}
          >
            {benefitCount} Khasiat
          </span>
        ) : undefined
      }
    >
      <div>
        <h3
          className={`font-serif font-black text-on-surface ${styles.hoverText} transition-colors leading-tight mb-1 line-clamp-2 ${
            large ? "text-2xl md:text-3xl" : "text-2xl min-h-14"
          }`}
        >
          {item.name_id}
        </h3>
        <p className="text-sm italic text-on-surface-variant leading-relaxed line-clamp-1">
          {item.name_latin}
        </p>
      </div>

      {item.description && (
        <div className="pt-3 border-t border-dashed border-outline-variant mt-auto shrink-0">
          <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
            {item.description}
          </p>
        </div>
      )}
    </EntityCardShell>
  );
}
