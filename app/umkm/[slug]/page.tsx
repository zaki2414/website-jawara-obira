// app/umkm/[slug]/page.tsx
import type { Metadata } from "next";
import { getUMKMBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { groupProductsByCategory, formatBusinessType } from "@/constants/umkm";
import UMKMDetailClient from "./UMKMDetailClient";

export const revalidate = 3600;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: umkm } = await getUMKMBySlug(slug);

  if (!umkm) {
    return { title: "Usaha Tidak Ditemukan | Jawara Obira" };
  }

  return {
    title: `${umkm.name} | Direktori UMKM Obira`,
    description:
      umkm.short_description ||
      `${formatBusinessType(umkm.business_type)} — mitra usaha lokal Pulau Obi.`,
    openGraph: umkm.thumbnail_url
      ? { images: [{ url: umkm.thumbnail_url }] }
      : undefined,
  };
}

export default async function UMKMDetail({ params }: Props) {
  const { slug } = await params;
  const { data: umkm, error } = await getUMKMBySlug(slug);

  if (error || !umkm) return notFound();

  // features sudah dinormalisasi jadi string[] di getUMKMBySlug (lib/supabase/queries.ts);
  // guard ini hanya jaga-jaga terhadap bentuk data lama/tidak terduga.
  const features = Array.isArray(umkm.features)
    ? umkm.features.map((f: string | { feature: string }) =>
        typeof f === "string" ? f : f.feature,
      )
    : [];

  const productsByCategory = groupProductsByCategory(umkm.products);

  return (
    <UMKMDetailClient
      umkm={{ ...umkm, features }}
      productsByCategory={productsByCategory}
    />
  );
}