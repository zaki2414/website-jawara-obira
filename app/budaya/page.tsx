// app/budaya/page.tsx
import type { Metadata } from "next";
import { getAllCulture } from "@/lib/supabase/queries";
import { type CultureItem } from "@/constants/budaya";
import CultureCatalogClient from "./CultureCatalogClient";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Arsip Kebudayaan Pulau Obi | Jawara Obira",
  description:
    "Penjelajahan interaktif melintasi dimensi tradisi, ritus sakral, kesenian, hingga cita rasa khas nusantara yang diwariskan luhur di Desa Kawasi & Soligi, Pulau Obi.",
};

export default async function CultureCatalogPage() {
  const { data } = await getAllCulture();

  // Query tidak pakai generated Supabase types; relasi villages(name) disimpulkan
  // sebagai array meski secara runtime selalu objek tunggal (lihat CultureItem).
  return (
    <CultureCatalogClient
      initialCulture={(data ?? []) as unknown as CultureItem[]}
    />
  );
}
