// app/fauna-obi/[slug]/page.tsx
import type { Metadata } from "next";
import { getFaunaBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { parseFaunaImages, type Fauna } from "@/constants/fauna";
import { FaunaPageBackground } from "@/components/fauna-obi";
import {
  FaunaDetailHero,
  FaunaTaxonomySection,
  FaunaProfileSection,
  FaunaEcologyPanel,
  FaunaGallerySection,
} from "@/components/fauna-obi/detail";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: fauna } = await getFaunaBySlug(slug);

  if (!fauna) {
    return { title: "Spesimen Tidak Ditemukan | Jawara Obira" };
  }

  return {
    title: `${fauna.name_local} (${fauna.name_scientific}) | Inventarisasi Fauna Obira`,
    description:
      fauna.description ||
      `Dokumentasi spesimen ${fauna.class ?? "satwa"} endemik Pulau Obi.`,
    openGraph: fauna.thumbnail_url
      ? { images: [{ url: fauna.thumbnail_url }] }
      : undefined,
  };
}

export default async function FaunaDetail({ params }: Props) {
  const { slug } = await params;
  const { data, error } = await getFaunaBySlug(slug);

  if (error || !data) return notFound();

  const fauna = data as Fauna;
  const gallery = parseFaunaImages(fauna.documentations);

  return (
    <article className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <FaunaPageBackground />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <FaunaDetailHero fauna={fauna} />

        <div className="grid md:grid-cols-12 md:gap-10 items-start">
          <div className="md:col-span-8 space-y-6">
            <FaunaTaxonomySection fauna={fauna} />
            <FaunaProfileSection fauna={fauna} />
          </div>

          <div className="md:col-span-4 md:sticky md:top-24 mt-6 md:mt-0">
            <FaunaEcologyPanel fauna={fauna} />
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-10">
            <FaunaGallerySection gallery={gallery} faunaName={fauna.name_local} />
          </div>
        )}
      </div>
    </article>
  );
}
