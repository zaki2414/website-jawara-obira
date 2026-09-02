// components/profil/VillageExplorer.tsx
"use client";

import { useState } from "react";
import { Compass } from "lucide-react";
import { VillagePickerMap } from "./VillagePickerMap";
import { VillageDetailPanel } from "./VillageDetailPanel";
import { VillageMapSection } from "./VillageMapSection";
import { RotatingHiasanBackground } from "@/components/shared/RotatingHiasanBackground";
import type { MapFacility, MapBuildingOverride } from "@/constants/peta";
import { PROFIL_CONTENT, type VillageContent, type VillageKey } from "@/constants/profil";
import type { UMKMMapPin } from "@/lib/geo";

type VillageExplorerProps = {
  facilities: MapFacility[];
  buildingOverrides: MapBuildingOverride[];
  umkmPins: UMKMMapPin[];
  villages: Record<VillageKey, VillageContent>;
};

// SATU-SATUNYA sumber state "desa terpilih" di /profil — dipakai bersama oleh
// peta pemilihan desa (VillagePickerMap + VillageDetailPanel) DAN peta
// kadaster Desa Kawasi (VillageMapSection) di bawahnya, supaya pilih Kawasi
// di peta atas otomatis membuka peta kadaster di bawah tanpa perlu pilih ulang.
export function VillageExplorer({ facilities, buildingOverrides, umkmPins, villages }: VillageExplorerProps) {
  const [village, setVillage] = useState<VillageKey | null>(null);

  return (
    // SATU section, bukan dua — dulu dua <section> terpisah dengan
    // border-b-4 di antaranya kelihatan seperti garis horizontal melintang
    // yang motong halaman jadi dua blok. Sekarang satu background menerus
    // (gradasi tertiary yang sama + satu RotatingHiasanBackground) supaya
    // peta pemilihan desa dan peta kadaster terasa satu section yang sama.
    <section className="relative overflow-hidden bg-linear-to-b from-tertiary-container/20 via-background to-background py-16 md:py-24 px-6 border-b-4 border-on-surface">
      <RotatingHiasanBackground hiasan={5} />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-16 md:gap-24">
        {/* Peta pemilihan desa — bentuk pulau + tombol, dibungkus panel
            bertekstur kertas arsip (border-4 + hard-shadow-lg) tapi TANPA
            judul "Arsip Spasial Obi"/hint-text yang dibuang per permintaan.
            Detail desa terpilih "terbuka" di bawahnya, full-width, tanpa
            tombol ke rute yang tidak ada. */}
        <div className="flex flex-col gap-10">
          {/* Cuma badge eyebrow, bukan judul+deskripsi lengkap — HeroSection.tsx
              tepat di atas section ini sudah pakai judul+deskripsi "Peta
              Administrasi Desa Kawasi", jadi diulang lagi di sini cuma
              jadi duplikat. Badge "Peta Kadaster" (di bawah, sebelum
              VillageMapSection) juga sudah dihapus dengan alasan sama. */}
          <div className="mx-auto inline-flex items-center gap-2 self-center rounded-full border-2 border-on-surface bg-background px-4 py-1.5 hard-shadow-sm">
            <Compass className="size-4 text-primary" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-widest text-on-surface">
              {PROFIL_CONTENT.eyebrow}
            </span>
          </div>

          <VillagePickerMap village={village} onSelect={setVillage} />
          <VillageDetailPanel villages={villages} village={village} onClose={() => setVillage(null)} />
        </div>

        {/* Peta Kadaster Desa Kawasi (data QGIS) */}
        <VillageMapSection
          facilities={facilities}
          buildingOverrides={buildingOverrides}
          umkmPins={umkmPins}
          village={village}
          onVillageChange={setVillage}
        />
      </div>
    </section>
  );
}
