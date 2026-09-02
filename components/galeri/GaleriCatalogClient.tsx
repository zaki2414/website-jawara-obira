"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { GaleriGrid } from "./GaleriGrid";
import { GaleriCategoryFilterBar } from "./GaleriCategoryFilterBar";
import { EntityEmptyState } from "@/components/shared/EntityEmptyState";
import { GALERI_CONTENT, GALERI_ICONS, type GalleryItem } from "@/constants/galeri";

type GaleriCatalogClientProps = {
  items: GalleryItem[];
  categoryCounts: Record<string, number>;
};

// Client wrapper untuk interaktivitas (filter kategori + lightbox) — data
// foto sendiri sudah difetch server-side di app/galeri/page.tsx, cuma
// state UI-nya yang perlu "use client", sesuai pola server-fetch +
// client-wrapper (CLAUDE.md §1.1), sama seperti CultureCatalogClient.tsx.
export function GaleriCatalogClient({ items, categoryCounts }: GaleriCatalogClientProps) {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [active, setActive] = useState<GalleryItem | null>(null);
  const { Camera } = GALERI_ICONS;

  const filtered = useMemo(
    () => (activeCategory === "Semua" ? items : items.filter((i) => i.category === activeCategory)),
    [items, activeCategory],
  );

  useEffect(() => {
    if (!active) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active]);

  return (
    <div className="space-y-6">
      <GaleriCategoryFilterBar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        categoryCounts={categoryCounts}
      />

      {filtered.length > 0 ? (
        <GaleriGrid items={filtered} onOpen={setActive} />
      ) : (
        <EntityEmptyState
          icon={Camera}
          title={GALERI_CONTENT.emptyFilteredTitle}
          description={GALERI_CONTENT.emptyFilteredDescription}
          suggestion={GALERI_CONTENT.emptyFilteredSuggestion}
        />
      )}

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-on-surface/90 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setActive(null)}
            role="dialog"
            aria-modal="true"
            aria-label={active.title || "Foto galeri"}
          >
            <motion.div
              className="relative w-full max-w-3xl aspect-4/3 rounded-2xl overflow-hidden border-2 border-background"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={active.image_url} alt={active.title || "Foto galeri"} fill className="object-cover" />
            </motion.div>

            {(active.title || active.description) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="absolute bottom-8 max-w-xl text-center px-6 space-y-1"
              >
                {active.title && <p className="text-background text-base font-black">{active.title}</p>}
                {active.description && (
                  <p className="text-background/80 text-sm font-medium">{active.description}</p>
                )}
              </motion.div>
            )}

            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute top-6 right-6 p-2 rounded-lg text-background/80 hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-background transition-colors"
              aria-label="Tutup"
            >
              <X className="w-7 h-7" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
