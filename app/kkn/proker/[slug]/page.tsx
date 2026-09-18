// app/kkn/proker/[slug]/page.tsx
import type { Metadata } from "next";
import { getKKNProkerBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";
import { getVillageAccent, nextVillageAccent, VILLAGE_ACCENT_STYLES } from "@/components/kkn/kknAccent";
import { ProkerDetailHero } from "@/components/kkn/detail/ProkerDetailHero";
import { ProkerRichTextSection } from "@/components/kkn/detail/ProkerRichTextSection";
import { ProkerGallerySection } from "@/components/kkn/detail/ProkerGallerySection";
import { ProkerMetricsSidebar, type ProkerMetric } from "@/components/kkn/detail/ProkerMetricsSidebar";
import { sanitizeRichText } from "@/lib/sanitizeHtml";

type ProkerDoc = { url?: string; image_url?: string; caption?: string };

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: proker } = await getKKNProkerBySlug(slug);

  if (!proker) {
    return { title: "Program Tidak Ditemukan | Jawara Obira" };
  }

  return {
    title: `${proker.title} | Program Kerja KKN Jawara Obira`,
    description:
      proker.short_description ||
      `Realisasi program kerja KKN untuk ${proker.villages?.name || "Pulau Obi"}.`,
    openGraph: proker.image_url ? { images: [{ url: proker.image_url }] } : undefined,
  };
}

export default async function KKNProkerDetail({ params }: Props) {
  const { slug } = await params;
  const { data: proker, error } = await getKKNProkerBySlug(slug);

  if (error || !proker) return notFound();

  const metrics = (Array.isArray(proker.impact_metrics) ? proker.impact_metrics : []) as ProkerMetric[];
  const docs = (Array.isArray(proker.documentation) ? proker.documentation : []) as ProkerDoc[];

  const accent = getVillageAccent(proker.villages?.name);
  const secondAccent = nextVillageAccent(accent);
  const styles = VILLAGE_ACCENT_STYLES[accent];
  const secondStyles = VILLAGE_ACCENT_STYLES[secondAccent];

  return (
    <article className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <KknPageBackground />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <ProkerDetailHero
          title={proker.title}
          coverImage={proker.image_url}
          villageName={proker.villages?.name}
          pemilik={proker.pemilik}
          waktu={proker.waktu}
          accent={accent}
        />

        {/* Paragraf pembuka. Batang aksen tebal di sisi kiri diganti garis
            putus-putus di bawahnya — pemisah yang memang sudah jadi bahasa
            situs ini (kartu bento, hero, entri budaya), bukan pola callout
            generik yang cuma muncul di satu halaman. Penekanannya tetap ada,
            dibawa ukuran teks dan jarak, bukan oleh batang warna. */}
        {proker.short_description && (
          <div className="mb-8">
            <p className="text-lg md:text-xl font-sans font-medium text-on-surface-variant leading-relaxed max-w-[62ch]">
              {proker.short_description}
            </p>
            <div
              className="mt-5 border-t-2 border-dashed border-outline-variant"
              aria-hidden="true"
            />
          </div>
        )}

        <div className="grid md:grid-cols-12 md:gap-10 items-start">
          <div className="md:col-span-8 space-y-6">
            {proker.narrative && (
              <ProkerRichTextSection
                icon="target"
                iconChip={styles.iconChip}
                border={styles.border}
                title="Deskripsi Program Kerja"
                html={sanitizeRichText(proker.narrative)}
              />
            )}

            {proker.results && (
              <ProkerRichTextSection
                icon="check-square"
                iconChip={secondStyles.iconChip}
                border={secondStyles.border}
                title="Hasil Realisasi Lapangan"
                html={sanitizeRichText(proker.results)}
                delay={0.05}
              />
            )}

            <ProkerGallerySection docs={docs} />
          </div>

          <div className="md:col-span-4 md:sticky md:top-24 mt-6 md:mt-0">
            <ProkerMetricsSidebar metrics={metrics} border={secondStyles.border} accent={secondAccent} />
          </div>
        </div>
      </div>
    </article>
  );
}
