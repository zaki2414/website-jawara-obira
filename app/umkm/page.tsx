// app/umkm/page.tsx
import type { Metadata } from "next";
import { getAllUMKM, getUMKMBusinessTypeCounts } from "@/lib/supabase/queries";
import UMKMContent from "@/components/umkm/UMKMContent";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Direktori UMKM Lokal | Jawara Obira",
  description:
    "Dokumentasi kolektif usaha mandiri, warung kelontong, dan penyedia jasa warga Desa Kawasi & Soligi, Pulau Obi.",
};

/**
 * Server Component - hanya fetch data & pass ke Client Component
 */
export default async function UMKMList({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  const [{ data: umkms }, { data: businessTypeCounts }] = await Promise.all([
    getAllUMKM(q, type),
    getUMKMBusinessTypeCounts(),
  ]);

  return (
    <UMKMContent
      items={umkms || []}
      initialQ={q}
      initialType={type}
      businessTypeCounts={businessTypeCounts ?? {}}
    />
  );
}
