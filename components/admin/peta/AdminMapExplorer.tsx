// components/admin/peta/AdminMapExplorer.tsx
"use client";

import { useState } from "react";
import { VillageMapSection } from "@/components/profil/VillageMapSection";
import type { MapFacility, MapBuildingOverride } from "@/constants/peta";
import type { VillageKey } from "@/constants/profil";
import type { UMKMMapPin } from "@/lib/geo";

type AdminMapExplorerProps = {
  facilities: MapFacility[];
  buildingOverrides: MapBuildingOverride[];
  umkmPins: UMKMMapPin[];
};

// Reuse VillageMapSection.tsx (peta publik /profil) apa adanya — tombol
// pilih desa, zoom, klik fitur, semuanya SAMA PERSIS dengan yang publik,
// cuma showAdminEdit={true} yang menambahkan tombol "Edit Fasilitas" di
// panel detail fasum (lihat FasumDetail di VillageCadastralMap.tsx). Admin
// jadi bisa klik langsung ikon fasilitas di peta lalu masuk ke form edit,
// tanpa perlu scroll cari kartunya di grid di bawah.
export function AdminMapExplorer({ facilities, buildingOverrides, umkmPins }: AdminMapExplorerProps) {
  const [village, setVillage] = useState<VillageKey | null>("kawasi");

  return (
    <VillageMapSection
      facilities={facilities}
      buildingOverrides={buildingOverrides}
      umkmPins={umkmPins}
      village={village}
      onVillageChange={setVillage}
      showAdminEdit
    />
  );
}
