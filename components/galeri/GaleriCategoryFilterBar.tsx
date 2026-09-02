"use client";

import {
  GALERI_CATEGORIES,
  GALERI_CONTENT,
  GALERI_ICONS,
  getGaleriCategoryAccent,
  GALERI_CATEGORY_ACCENT_STYLES,
} from "@/constants/galeri";

type GaleriCategoryFilterBarProps = {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  categoryCounts: Record<string, number>;
};

// Pola sama dengan components/budaya/CategoryFilterBar.tsx.
export function GaleriCategoryFilterBar({
  activeCategory,
  onCategoryChange,
  categoryCounts,
}: GaleriCategoryFilterBarProps) {
  const { Filter } = GALERI_ICONS;

  return (
    <div className="flex items-center gap-3 overflow-x-auto pt-2 pb-3 scrollbar-none">
      <div className="flex items-center gap-1.5 bg-background border-2 border-on-surface p-1.5 rounded-xl shrink-0 hard-shadow-sm mr-1">
        <Filter className="w-3.5 h-3.5 text-primary ml-1" aria-hidden="true" />
        <span className="text-label-sm font-black uppercase tracking-wider text-on-surface-variant pr-1">
          {GALERI_CONTENT.filterLabel}
        </span>
      </div>

      <div className="flex gap-2 py-1 px-0.5">
        {GALERI_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          const accent = getGaleriCategoryAccent(cat === "Semua" ? undefined : cat);
          const styles = GALERI_CATEGORY_ACCENT_STYLES[accent];
          const count = categoryCounts[cat] ?? 0;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              aria-pressed={isActive}
              className={[
                "min-h-11 inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-label-sm font-black uppercase tracking-wider",
                "transition-all duration-200 cursor-pointer select-none shrink-0",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                styles.ring,
                isActive
                  ? `${styles.badge} border-on-surface -translate-y-0.5 hard-shadow-sm`
                  : "bg-background text-on-surface border-on-surface/40 hover:border-on-surface hover:-translate-y-px",
              ].join(" ")}
            >
              {cat !== "Semua" && (
                <span className={`w-2 h-2 rounded-full shrink-0 ${isActive ? "bg-current" : styles.dot}`} aria-hidden="true" />
              )}
              {cat}
              {count > 0 && (
                <span
                  className={[
                    "text-label-sm leading-none px-1.5 py-0.5 rounded-full font-black",
                    isActive ? "bg-background/25 text-current" : "bg-surface-container text-on-surface-variant",
                  ].join(" ")}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
