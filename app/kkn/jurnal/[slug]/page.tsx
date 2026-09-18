// app/kkn/jurnal/[slug]/page.tsx
import type { Metadata } from "next";
import { getKKNJournalBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";
import { getVillageAccent, nextVillageAccent, VILLAGE_ACCENT_STYLES } from "@/components/kkn/kknAccent";
import { JournalDetailHero } from "@/components/kkn/detail/JournalDetailHero";
import { JournalContentSection } from "@/components/kkn/detail/JournalContentSection";
import { JournalGallerySection } from "@/components/kkn/detail/JournalGallerySection";
import { JournalInfoSidebar } from "@/components/kkn/detail/JournalInfoSidebar";
import { sanitizeRichText } from "@/lib/sanitizeHtml";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: journal } = await getKKNJournalBySlug(slug);

  if (!journal) {
    return { title: "Jurnal Tidak Ditemukan | Jawara Obira" };
  }

  return {
    title: `${journal.title} | Jurnal Harian KKN Jawara Obira`,
    description:
      journal.content?.replace(/<[^>]*>/g, "").slice(0, 160) ||
      `Catatan aktivitas KKN tanggal ${journal.activity_date}.`,
    openGraph: journal.cover_image ? { images: [{ url: journal.cover_image }] } : undefined,
  };
}

export default async function KKNJournalDetail({ params }: Props) {
  const { slug } = await params;
  const { data: journal, error } = await getKKNJournalBySlug(slug);

  if (error || !journal) return notFound();

  const images: { image_url: string; caption: string | null }[] = journal.images || [];
  // Rotasi primary/tertiary/cream berbasis desa dipakai lagi untuk SEMUA
  // section di halaman ini (hero, konten, sidebar) — cuma bagian
  // dokumentasi/galeri (JournalGallerySection) yang di-hardcode tertiary,
  // itu diatur SENDIRI di dalam komponennya (bukan lewat prop di sini).
  const accent = getVillageAccent(journal.villages?.name);
  const secondAccent = nextVillageAccent(accent);
  const styles = VILLAGE_ACCENT_STYLES[accent];
  const secondStyles = VILLAGE_ACCENT_STYLES[secondAccent];

  return (
    <article className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <KknPageBackground />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <JournalDetailHero
          title={journal.title}
          coverImage={journal.cover_image}
          activityDate={journal.activity_date}
          villageName={journal.villages?.name}
          accent={accent}
        />

        <div className="grid md:grid-cols-12 md:gap-10 items-start">
          <div className="md:col-span-8 space-y-6">
            <JournalContentSection html={sanitizeRichText(journal.content)} border={styles.border} />
            <JournalGallerySection images={images} />
          </div>

          <div className="md:col-span-4 md:sticky md:top-24 mt-6 md:mt-0">
            <JournalInfoSidebar
              activityDate={journal.activity_date}
              villageName={journal.villages?.name}
              attachmentCount={images.length}
              border={secondStyles.border}
              accent={secondAccent}
            />
          </div>
        </div>
      </div>
    </article>
  );
}
