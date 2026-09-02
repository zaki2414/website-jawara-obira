// app/toga/[slug]/page.tsx
import type { Metadata } from "next";
import { getTogaPlantBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { type TogaPlant } from "@/constants/toga";
import { TogaPageBackground } from "@/components/toga";
import {
  TogaDetailHero,
  TogaProfileSection,
  TogaBenefitsSection,
  TogaRecipesSection,
} from "@/components/toga/detail";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: plant } = await getTogaPlantBySlug(slug);

  if (!plant) {
    return { title: "Tanaman Tidak Ditemukan | Jawara Obira" };
  }

  return {
    title: `${plant.name_id} (${plant.name_latin}) | Ensiklopedia Toga Obira`,
    description:
      plant.description ||
      `Khasiat kesehatan dan resep tradisional ${plant.name_id}, tanaman obat keluarga khas Pulau Obi.`,
    openGraph: plant.thumbnail_url
      ? { images: [{ url: plant.thumbnail_url }] }
      : undefined,
  };
}

export default async function TogaDetail({ params }: Props) {
  const { slug } = await params;
  const { data, error } = await getTogaPlantBySlug(slug);

  if (error || !data) return notFound();

  const plant = data as TogaPlant;

  return (
    <article className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <TogaPageBackground />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <TogaDetailHero plant={plant} />

        <div className="grid md:grid-cols-12 md:gap-10 items-start">
          <div className="md:col-span-8 space-y-6">
            <TogaProfileSection plant={plant} />
            <TogaRecipesSection plant={plant} />
          </div>

          <div className="md:col-span-4 md:sticky md:top-24 mt-6 md:mt-0">
            <TogaBenefitsSection plant={plant} />
          </div>
        </div>
      </div>
    </article>
  );
}
