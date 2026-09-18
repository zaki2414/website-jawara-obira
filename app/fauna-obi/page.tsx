// app/fauna-obi/page.tsx
import type { Metadata } from "next";
import { getAllFauna, getFaunaTotalCount } from "@/lib/supabase/queries";
import { getIucnCode, type Fauna } from "@/constants/fauna";
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

// ══════════════════════════════════════════════════════════════════
// INVENTARISASI FAUNA — DAFTAR PERIKSA TAKSONOMI
//
// Susunan lama: grid kartu bergambar. Dua alasan itu tidak cocok dengan data
// yang sebenarnya ada:
//
// 1. Hanya 2 dari 15 spesies punya foto — tiga belas kartu sisanya menampilkan
//    pelat kosong, sehingga halaman yang datanya justru paling lengkap di situs
//    ini malah terlihat paling rusak.
// 2. Tiap spesies punya KELAS, ORDO, FAMILI, dan STATUS IUCN. Itu data
//    terstruktur — dan data terstruktur dibaca sebagai daftar berkolom, bukan
//    dipecah jadi kartu yang berdiri sendiri-sendiri.
//
// Susunan sekarang meniru daftar periksa buku panduan lapangan: dikelompokkan
// per kelas takson, satu spesies per baris, dan kolom status konservasi rata
// kanan supaya bisa dipindai menurun. Legenda IUCN ada di rail — sebelumnya
// kode "VU"/"LC" muncul tanpa kunci baca di mana pun.
// ══════════════════════════════════════════════════════════════════

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

  // Spesies berstatus Rentan ke atas — angka paling bermakna dari sebuah
  // inventarisasi konservasi, dipakai di strip hero.
  const atRiskCount = items.filter((i) =>
    ["VU", "EN", "CR"].includes(getIucnCode(i.iucn_status)),
  ).length;

  const isBento = !q && (!faunaClass || faunaClass === "all");

  return (
    <>
      <FaunaHeroSection totalCount={totalCount} protectedCount={atRiskCount} />

      <section className="relative bg-natural-paper py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
        <FaunaPageBackground />

        <div className="relative max-w-7xl mx-auto z-10 space-y-8">
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
