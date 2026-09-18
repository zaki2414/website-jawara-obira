"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BUDAYA_CATEGORIES, type CultureItem } from "@/constants/budaya";
import {
  BrandIdentityBackground,
  HeaderSection,
  CategoryFilterBar,
  CultureCard,
  EmptyState,
} from "@/components/budaya";

type CultureCatalogClientProps = {
  initialCulture: CultureItem[];
};

export default function CultureCatalogClient({
  initialCulture,
}: CultureCatalogClientProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  // Daftar kategori diturunkan dari GABUNGAN konstanta + kategori yang benar-
  // benar ada di data. Tanpa langkah kedua, kategori yang hanya hidup di
  // database ("CSR", "Pengetahuan Tradisional") jadi entri yang MUSTAHIL
  // ditemukan lewat filter, dan jumlah per kategori tidak pernah menjumlah
  // ke total.
  const categories = useMemo(() => {
    const fromData = initialCulture
      .map((item) => item.category)
      .filter((c): c is string => Boolean(c));
    const known = BUDAYA_CATEGORIES.filter((c) => c !== "Semua") as readonly string[];
    const extras = [...new Set(fromData)].filter(
      (c) => !known.some((k) => k.toLowerCase() === c.toLowerCase()),
    );
    return ["Semua", ...known, ...extras.sort()];
  }, [initialCulture]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: initialCulture.length };
    for (const cat of categories) {
      if (cat === "Semua") continue;
      counts[cat] = initialCulture.filter(
        (item) => item.category?.toLowerCase() === cat.toLowerCase(),
      ).length;
    }
    return counts;
  }, [initialCulture, categories]);

  const filteredCulture = useMemo(() => {
    if (activeCategory === "Semua") return initialCulture;
    return initialCulture.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [activeCategory, initialCulture]);

  const isBento = activeCategory === "Semua";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      <HeaderSection cultureCount={initialCulture.length} categoryCounts={categoryCounts} />

      <section className="relative bg-natural-paper py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
        <BrandIdentityBackground />

        <div className="relative max-w-7xl mx-auto z-10 space-y-8">
          {initialCulture.length > 0 && (
            <CategoryFilterBar
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryCounts={categoryCounts}
            />
          )}

          {filteredCulture.length > 0 ? (
            <motion.div
              layout
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 lg:grid-flow-dense"
            >
              <AnimatePresence mode="popLayout">
                {filteredCulture.map((item, index) => {
                  // Pola bento berulang tiap 4 kartu supaya ukurannya bervariasi
                  // teratur; nonaktif saat filter aktif agar hasil seragam.
                  const large = isBento && index % 4 === 0;
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      className={`w-full ${large ? "md:col-span-2" : ""}`}
                    >
                      <CultureCard item={item} index={index} large={large} />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          ) : (
            <EmptyState />
          )}
        </div>
      </section>
    </motion.div>
  );
}
