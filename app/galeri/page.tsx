import type { Metadata } from "next";
import { getAllGalleries } from "@/lib/supabase/queries";
import { type GalleryItem } from "@/constants/galeri";
import { GaleriHeaderSection, GaleriCatalogClient, GaleriEmptyState } from "@/components/galeri";
import { RotatingHiasanBackground } from "@/components/shared/RotatingHiasanBackground";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Galeri Foto Obi | Jawara Obira",
  description:
    "Rekam jejak keindahan alam, dokumentasi kebudayaan, dan denyut nadi keseharian masyarakat di Desa Kawasi dan Desa Soligi, Pulau Obi.",
};

export default async function GaleriPage() {
  const { data: galleries } = await getAllGalleries();
  const items = (galleries ?? []) as GalleryItem[];

  const categoryCounts: Record<string, number> = {};
  for (const item of items) {
    categoryCounts[item.category] = (categoryCounts[item.category] ?? 0) + 1;
  }

  return (
    <div className="relative min-h-screen bg-natural-paper overflow-hidden">
      <RotatingHiasanBackground hiasan={5} density="elegant" />

      <div className="relative z-10">
        <GaleriHeaderSection totalCount={items.length} categoryCounts={categoryCounts} />

        <section className="relative bg-linear-to-b from-cream-container/35 via-background to-background py-16 md:py-24 px-6 border-b-4 border-on-surface">
          <div className="relative max-w-7xl mx-auto z-10">
            {items.length > 0 ? (
              <GaleriCatalogClient items={items} categoryCounts={categoryCounts} />
            ) : (
              <GaleriEmptyState />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
