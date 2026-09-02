// app/toga/page.tsx
import type { Metadata } from "next";
import { getAllTogaPlants, getTogaTotalCount } from "@/lib/supabase/queries";
import { type TogaPlant } from "@/constants/toga";
import {
  TogaPageBackground,
  TogaHeroSection,
  TogaFilterBar,
  TogaGrid,
  TogaEmptyState,
} from "@/components/toga";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Ensiklopedia Tanaman Obat Keluarga | Jawara Obira",
  description:
    "Kearsipan digital Tanaman Obat Keluarga (TOGA) khas Pulau Obi, Maluku Utara — khasiat kesehatan dan resep racikan tradisional turun-temurun.",
};

export default async function TogaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const [{ data: plants }, { count: totalCount }] = await Promise.all([
    getAllTogaPlants(q),
    getTogaTotalCount(),
  ]);

  const items = (plants ?? []) as TogaPlant[];
  const isBento = !q;

  return (
    <>
      {/* Hero full-bleed dipisah dari section kertas di bawah supaya ada
          irama gantian warna/kertas seperti home & profil. */}
      <TogaHeroSection totalCount={totalCount} />

      <section className="relative bg-linear-to-b from-primary/10 via-background to-background py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
        <TogaPageBackground />

        <div className="relative max-w-7xl mx-auto z-10 space-y-6">
          <TogaFilterBar initialQ={q} />

          {items.length > 0 ? (
            <TogaGrid items={items} isBento={isBento} />
          ) : (
            <TogaEmptyState />
          )}
        </div>
      </section>
    </>
  );
}
