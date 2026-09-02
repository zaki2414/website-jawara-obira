"use client";

import { EntityCardShell } from "@/components/shared/EntityCardShell";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, ArrowUpRight } from "lucide-react";
import {
  cultureCardVariants,
  getCategoryAccent,
  CATEGORY_ACCENT_STYLES,
  type CultureItem,
} from "@/constants/budaya";

const BADGE_VARIANT = {
  primary: "solid",
  tertiary: "solid-tertiary",
  cream: "solid-cream",
} as const;

type CultureCardProps = {
  item: CultureItem;
  index: number;
  large?: boolean;
};

export function CultureCard({ item, index, large = false }: CultureCardProps) {
  const accent = getCategoryAccent(item.category);
  const styles = CATEGORY_ACCENT_STYLES[accent];

  return (
    <EntityCardShell
      href={`/budaya/${item.slug}`}
      index={index}
      variants={cultureCardVariants}
      thumbnailUrl={item.thumbnail_url}
      thumbnailAlt={item.title}
      FallbackIcon={Sparkles}
      large={large}
      accentBar={styles.topBar}
      topBadges={
        <Badge variant={BADGE_VARIANT[accent]} className="absolute top-4 right-4 z-10">
          {item.category}
        </Badge>
      }
    >
      <div>
        {item.villages && (
          <div className="inline-flex items-center gap-1 bg-primary/10 border-2 border-primary/30 px-2 py-0.5 rounded-md text-label-sm font-black text-primary uppercase tracking-wider mb-2">
            <MapPin className="w-2.5 h-2.5 shrink-0" aria-hidden="true" />
            {item.villages.name}
          </div>
        )}
        <h2
          className={`font-serif font-black text-on-surface group-hover:text-primary transition-colors leading-tight mb-1 line-clamp-2 ${
            large ? "text-2xl md:text-3xl" : "text-2xl min-h-14"
          }`}
        >
          {item.title}
        </h2>
      </div>

      <div className="flex items-center justify-between border-t border-dashed border-outline-variant pt-3 mt-auto shrink-0">
        <span className="text-label-sm font-black uppercase tracking-widest text-on-surface-variant group-hover:text-primary transition-colors duration-200">
          Baca Selengkapnya
        </span>
        <div className="w-7 h-7 rounded-lg bg-background border-2 border-on-surface flex items-center justify-center group-hover:bg-primary group-hover:text-on-primary group-hover:hard-shadow-sm transition-all duration-300">
          <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:rotate-45 transition-transform duration-300" aria-hidden="true" />
        </div>
      </div>
    </EntityCardShell>
  );
}
