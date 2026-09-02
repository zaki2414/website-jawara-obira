"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, X } from "lucide-react";

export type GalleryImage = {
  url: string;
  caption?: string | null;
};

type EntityGallerySectionProps = {
  images: GalleryImage[];
  /** Judul section (default "Dokumentasi"). */
  title?: string;
  /** Dipakai di alt text fallback ("Foto {entityName} N") kalau caption kosong. */
  entityName?: string;
  /** Kelas warna border kartu foto (default border-cream) — satu-satunya hal
   *  yang boleh beda per domain (UMKM/Fauna/Budaya = cream, KKN Jurnal =
   *  tertiary, KKN Proker = cream), sisanya (layout, shadow, lightbox) SAMA. */
  borderColorClass?: string;
};

// Satu-satunya implementasi gallery/dokumentasi dipakai UMKM, Budaya, Fauna,
// KKN Jurnal, dan KKN Proker — sebelumnya ada 4+ implementasi nyaris identik
// (GallerySection.tsx UMKM, FaunaGallerySection.tsx, SideImage+MobileGallery
// budaya, JournalGallerySection/ProkerGallerySection KKN) dengan border-width,
// shadow, caption, dan bahkan JUMLAH foto yang ditampilkan beda-beda (budaya
// lama cuma nampilin 2 foto pertama di desktop). Toga BELUM punya field
// dokumentasi di skema datanya, jadi belum dipakai di sana.
export function EntityGallerySection({
  images,
  title = "Dokumentasi",
  entityName,
  borderColorClass = "border-cream",
}: EntityGallerySectionProps) {
  const [active, setActive] = useState<GalleryImage | null>(null);

  useEffect(() => {
    if (!active) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [active]);

  if (images.length === 0) return null;

  const fallbackAlt = entityName ? `Foto ${entityName}` : "Foto dokumentasi";

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between border-b-2 border-dashed border-outline-variant pb-5">
        <h2 className="font-serif text-2xl font-black text-on-surface">{title}</h2>
        <Camera className="w-5 h-5 text-on-surface-variant/50" aria-hidden="true" />
      </div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
        className="columns-1 sm:columns-2 gap-6 space-y-6 [column-fill:balance]"
      >
        {images.map((img, i) => (
          <motion.button
            key={i}
            type="button"
            onClick={() => setActive(img)}
            variants={{
              hidden: { opacity: 0, y: 18 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            aria-label={img.caption ? `Perbesar foto: ${img.caption}` : "Perbesar foto"}
            className={`block w-full break-inside-avoid text-left bg-background border-2 ${borderColorClass} rounded-2xl overflow-hidden hard-shadow-lg group cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`}
          >
            <motion.div
              layoutId={`entity-gallery-image-${i}`}
              className="relative w-full aspect-4/3 bg-surface-container-high overflow-hidden"
            >
              <Image
                src={img.url}
                alt={img.caption || `${fallbackAlt} ${i + 1}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </motion.div>
            {img.caption && (
              <p className="p-4 text-label-sm font-bold text-on-surface-variant italic normal-case tracking-normal">
                {img.caption}
              </p>
            )}
          </motion.button>
        ))}
      </motion.div>

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
            aria-label={active.caption || fallbackAlt}
          >
            <motion.div
              className="relative w-full max-w-3xl aspect-4/3 rounded-2xl overflow-hidden border-2 border-background"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={active.url} alt={active.caption || fallbackAlt} fill className="object-cover" />
            </motion.div>

            {active.caption && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="absolute bottom-8 text-background text-sm font-bold italic text-center px-6"
              >
                {active.caption}
              </motion.p>
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
    </section>
  );
}
