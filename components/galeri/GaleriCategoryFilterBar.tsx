"use client";

import { PageFilterBar } from "@/components/shared/PageFilterBar";
import {
  GALERI_CATEGORIES,
  GALERI_CONTENT,
  getGaleriCategoryAccent,
  GALERI_CATEGORY_ACCENT_STYLES,
} from "@/constants/galeri";

type GaleriCategoryFilterBarProps = {
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  categoryCounts: Record<string, number>;
};

export function GaleriCategoryFilterBar({
  activeCategory,
  onCategoryChange,
  categoryCounts,
}: GaleriCategoryFilterBarProps) {
  return (
    <PageFilterBar
      accent="galeri"
      chips={{
        label: GALERI_CONTENT.filterLabel,
        active: activeCategory,
        onSelect: onCategoryChange,
        items: GALERI_CATEGORIES.map((cat) => ({
          value: cat,
          label: cat,
          count: categoryCounts[cat] ?? 0,
          activeClass:
            GALERI_CATEGORY_ACCENT_STYLES[
              getGaleriCategoryAccent(cat === "Semua" ? undefined : cat)
            ].badge,
        })),
      }}
    />
  );
}
