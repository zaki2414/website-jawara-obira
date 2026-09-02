// components/profil/VillageCadastralMapLoader.tsx
"use client";

import dynamic from "next/dynamic";
import { Map } from "lucide-react";
import type { MapFacility, MapBuildingOverride } from "@/constants/peta";
import type { VillageKey } from "@/constants/profil";
import type { UMKMMapPin } from "@/lib/geo";

// Leaflet menyentuh `window` saat modul di-import — dynamic import dengan
// ssr:false WAJIB dipanggil dari dalam Client Component (tidak boleh
// langsung di Server Component, lihat catatan Next.js soal lazy-loading).
// File ini adalah leaf "use client" khusus untuk itu; VillageMapSection.tsx
// cukup import file INI seperti komponen biasa.
const VillageCadastralMap = dynamic(() => import("./VillageCadastralMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[70vh] min-h-100 w-full animate-pulse items-center justify-center rounded-2xl border-4 border-on-surface bg-surface-container hard-shadow-lg">
      <Map className="size-10 text-on-surface-variant/40" aria-hidden="true" />
    </div>
  ),
});

type VillageCadastralMapLoaderProps = {
  village: VillageKey;
  facilities: MapFacility[];
  buildingOverrides: MapBuildingOverride[];
  umkmPins: UMKMMapPin[];
  showAdminEdit?: boolean;
};

export default function VillageCadastralMapLoader({
  village,
  facilities,
  buildingOverrides,
  umkmPins,
  showAdminEdit,
}: VillageCadastralMapLoaderProps) {
  return (
    <VillageCadastralMap
      village={village}
      facilities={facilities}
      buildingOverrides={buildingOverrides}
      umkmPins={umkmPins}
      showAdminEdit={showAdminEdit}
    />
  );
}
