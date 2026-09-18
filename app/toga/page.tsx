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

// ══════════════════════════════════════════════════════════════════
// ENSIKLOPEDIA TOGA — INDEKS MATERIA MEDICA
//
// Susunan lama: grid kartu bento bergambar. Tidak cocok dengan datanya:
// hanya 2 dari 9 tanaman punya foto, sementara SEMUANYA punya 4–5 khasiat
// tercatat. Kartu bergambar karena itu menampilkan tujuh pelat kosong sambil
// menyembunyikan satu-satunya isi yang benar-benar dicari orang.
//
// Susunan sekarang: indeks alfabetis dengan khasiat tampil langsung di baris.
// Alfabet dipilih sebagai jalur navigasi karena kolom `category` dan `family`
// di tabel ini kosong seluruhnya — mengelompokkan dengan taksonomi berarti
// mengarang struktur yang datanya tidak punya.
// ══════════════════════════════════════════════════════════════════

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

  // Total khasiat tercatat — isi paling berharga dari ensiklopedia ini, jadi
  // layak jadi angka di hero, bukan cuma jumlah tanamannya.
  const benefitCount = items.reduce((n, plant) => {
    const hb = plant.health_benefits;
    return Array.isArray(hb) ? n + hb.length : n;
  }, 0);

  // Grid bento hanya saat tidak sedang mencari: kalau pengunjung menyaring,
  // ukuran kartu yang berbeda-beda membuat hasil sulit dibandingkan.
  const isBento = !q;

  return (
    <>
      <TogaHeroSection totalCount={totalCount} benefitCount={benefitCount} />

      <section className="relative bg-natural-paper py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
        <TogaPageBackground />

        <div className="relative max-w-7xl mx-auto z-10 space-y-8">
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
