// app/fauna-obi/page.tsx
import type { Metadata } from "next";
import { getAllFauna, getFaunaTotalCount } from "@/lib/supabase/queries";
import { type Fauna } from "@/constants/fauna";
import {
  FaunaPageBackground,
  FaunaHeroSection,
  FaunaFilterBar,
  FaunaGrid,
  FaunaEmptyState,
} from "@/components/fauna-obi";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Inventarisasi Fauna Pulau Obi | Jawara Obira",
  description:
    "Koleksi dokumentasi satwa liar endemik Pulau Obi, Maluku Utara — dari aves eksotis hingga reptil purba, mencatat kekayaan biodiversitas yang perlu dijaga.",
};

export default async function FaunaObiPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; class?: string }>;
}) {
  const { q, class: faunaClass } = await searchParams;
  const [{ data: faunas }, { count: totalCount }] = await Promise.all([
    getAllFauna(q, faunaClass),
    getFaunaTotalCount(),
  ]);

  const items = (faunas ?? []) as Fauna[];
  const isBento = !q && (!faunaClass || faunaClass === "all");

  return (
    <>
      {/* Hero full-bleed dipisah dari section kertas di bawah supaya ada
          irama gantian warna/kertas seperti home & profil. */}
      <FaunaHeroSection totalCount={totalCount} />

      <section className="relative bg-linear-to-b from-cream/25 via-background to-background py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
        <FaunaPageBackground />

        <div className="relative max-w-7xl mx-auto z-10 space-y-6">
          <FaunaFilterBar initialQ={q} initialClass={faunaClass} />

          {items.length > 0 ? (
            <FaunaGrid items={items} isBento={isBento} />
          ) : (
            <FaunaEmptyState />
          )}
        </div>
      </section>
    </>
  );
}
