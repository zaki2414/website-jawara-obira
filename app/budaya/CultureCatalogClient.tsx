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
import { BackgroundOrnaments } from "@/components/shared/BackgroundOrnaments";

type CultureCatalogClientProps = {
  initialCulture: CultureItem[];
};

export default function CultureCatalogClient({
  initialCulture,
}: CultureCatalogClientProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Semua: initialCulture.length };
    for (const cat of BUDAYA_CATEGORIES) {
      if (cat === "Semua") continue;
      counts[cat] = initialCulture.filter(
        (item) => item.category?.toLowerCase() === cat.toLowerCase(),
      ).length;
    }
    return counts;
  }, [initialCulture]);

  const filteredCulture = useMemo(() => {
    if (activeCategory === "Semua") return initialCulture;
    return initialCulture.filter(
      (item) => item.category?.toLowerCase() === activeCategory.toLowerCase(),
    );
  }, [activeCategory, initialCulture]);

  const isBento = activeCategory === "Semua";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero full-bleed (band warna edge-to-edge) — dipisah dari section
          kertas di bawah supaya ada irama gantian warna/kertas seperti
          home & profil, bukan satu bg-natural-paper datar dari atas ke bawah. */}
      <HeaderSection cultureCount={initialCulture.length} categoryCounts={categoryCounts} />

      <section className="relative bg-linear-to-b from-primary-container/20 via-background to-background py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
        <BackgroundOrnaments variant="minimal" />
        <BrandIdentityBackground />

        <div className="relative max-w-7xl mx-auto z-10 space-y-6">
          {initialCulture.length > 0 && (
            <CategoryFilterBar
              activeCategory={activeCategory}
              onCategoryChange={setActiveCategory}
              categoryCounts={categoryCounts}
            />
          )}

          <div className="w-full">
            {filteredCulture.length > 0 ? (
              <motion.div
                layout
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 lg:grid-flow-dense"
              >
                <AnimatePresence mode="popLayout">
                  {filteredCulture.map((item, index) => {
                    // Pola bento berulang setiap 4 kartu (bukan cuma kartu pertama)
                    // supaya ukuran kartu bervariasi teratur — nonaktif saat filter
                    // kategori aktif (isBento false) supaya hasil tetap seragam.
                    // col-span di-set di WRAPPER (bukan di dalam CultureCard),
                    // sama seperti FaunaGrid.tsx — EntityCardShell yang dipakai
                    // CultureCard cuma tahu soal card chrome, bukan layout grid.
                    const large = isBento && index % 4 === 0;
                    return (
                      <motion.div key={item.id} layout className={`w-full ${large ? "md:col-span-2" : ""}`}>
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
        </div>
      </section>
    </motion.div>
  );
}
