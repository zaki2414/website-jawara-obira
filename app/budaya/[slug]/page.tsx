// app/budaya/[slug]/page.tsx
import type { Metadata } from "next";
import { getCultureDetail } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import CultureDetailClient from "./CultureDetailClient";
import type { CultureItem, ExtraImage } from "@/constants/budaya";

export const revalidate = 3600;

function parseExtraImages(raw: unknown): ExtraImage[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as ExtraImage[];
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: culture } = await getCultureDetail(slug);

  if (!culture) {
    return { title: "Artikel Tidak Ditemukan | Jawara Obira" };
  }

  const description = culture.content
    ? culture.content.replace(/<[^>]*>/g, "").slice(0, 160)
    : `Dokumentasi budaya ${culture.category} dari Pulau Obi.`;

  return {
    title: `${culture.title} | Arsip Kebudayaan Obira`,
    description,
    openGraph: culture.thumbnail_url
      ? { images: [{ url: culture.thumbnail_url }] }
      : undefined,
  };
}

export default async function CultureDetail({ params }: Props) {
  const { slug } = await params;
  const { data: culture, error } = await getCultureDetail(slug);

  if (error || !culture) return notFound();

  const extraImages = parseExtraImages(culture.extra_images);

  return (
    <CultureDetailClient
      culture={culture as unknown as CultureItem}
      extraImages={extraImages}
    />
  );
}