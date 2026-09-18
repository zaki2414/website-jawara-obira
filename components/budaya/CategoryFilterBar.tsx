"use client";

import { PageFilterBar } from "@/components/shared/PageFilterBar";
import {
  BUDAYA_CONTENT,
  getCategoryAccent,
  CATEGORY_ACCENT_STYLES,
} from "@/constants/budaya";

type CategoryFilterBarProps = {
  /** Daftar kategori yang benar-benar bisa dipilih — gabungan taksonomi resmi
   *  dan kategori yang muncul di database. Dioper dari pemanggil supaya
   *  kategori yang hanya ada di data ("CSR", "Pengetahuan Tradisional") tidak
   *  jadi entri yang mustahil ditemukan. */
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  categoryCounts: Record<string, number>;
};

export function CategoryFilterBar({
  categories,
  activeCategory,
  onCategoryChange,
  categoryCounts,
}: CategoryFilterBarProps) {
  return (
    <PageFilterBar
      accent="budaya"
      chips={{
        label: BUDAYA_CONTENT.filterLabel ?? "Saring kategori",
        active: activeCategory,
        onSelect: onCategoryChange,
        items: categories.map((cat) => ({
          value: cat,
          label: cat,
          count: categoryCounts[cat] ?? 0,
          // Chip aktif memakai warna kategorinya sendiri, jadi warnanya
          // berarti sesuatu — bukan satu warna sorot untuk semua.
          activeClass:
            CATEGORY_ACCENT_STYLES[
              cat === "Semua" ? "primary" : getCategoryAccent(cat)
            ].badge,
        })),
      }}
    />
  );
}
