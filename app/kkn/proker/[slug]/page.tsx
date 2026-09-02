// app/kkn/proker/[slug]/page.tsx
import type { Metadata } from "next";
import { getKKNProkerBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";
import { getVillageAccent, nextVillageAccent, VILLAGE_ACCENT_STYLES } from "@/components/kkn/kknAccent";
import { ProkerDetailHero } from "@/components/kkn/detail/ProkerDetailHero";
import { ProkerRichTextSection } from "@/components/kkn/detail/ProkerRichTextSection";
import { ProkerAchievementsSection } from "@/components/kkn/detail/ProkerAchievementsSection";
import { ProkerGallerySection } from "@/components/kkn/detail/ProkerGallerySection";
import { ProkerMetricsSidebar } from "@/components/kkn/detail/ProkerMetricsSidebar";

type ProkerDoc = { url?: string; image_url?: string; caption?: string };

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

  const metrics = (proker.impact_metrics || {}) as Record<string, string | number>;
  const achievements = proker.key_achievements || [];
  const docs = (Array.isArray(proker.documentation) ? proker.documentation : []) as ProkerDoc[];

  const accent = getVillageAccent(proker.villages?.name);
  const secondAccent = nextVillageAccent(accent);
  const thirdAccent = nextVillageAccent(secondAccent);
  const styles = VILLAGE_ACCENT_STYLES[accent];
  const secondStyles = VILLAGE_ACCENT_STYLES[secondAccent];
  const thirdStyles = VILLAGE_ACCENT_STYLES[thirdAccent];

  return (
    <article className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <KknPageBackground />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <ProkerDetailHero
          title={proker.title}
          coverImage={proker.image_url}
          villageName={proker.villages?.name}
          accent={accent}
        />

        {proker.short_description && (
          <p className={`text-lg md:text-xl font-sans font-medium text-on-surface-variant leading-relaxed border-l-4 ${styles.border} pl-4 py-1 italic mb-8`}>
            {proker.short_description}
          </p>
        )}

        <div className="grid md:grid-cols-12 md:gap-10 items-start">
          <div className="md:col-span-8 space-y-6">
            {proker.goals && (
              <ProkerRichTextSection
                icon="target"
                iconChip={styles.iconChip}
                border={styles.border}
                title="Maksud & Tujuan Program"
                html={proker.goals}
              />
            )}

            {proker.results && (
              <ProkerRichTextSection
                icon="check-square"
                iconChip={secondStyles.iconChip}
                border={secondStyles.border}
                title="Hasil Realisasi Lapangan"
                html={proker.results}
                delay={0.05}
              />
            )}

            <ProkerAchievementsSection achievements={achievements} border={thirdStyles.border} accent={thirdAccent} />
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
