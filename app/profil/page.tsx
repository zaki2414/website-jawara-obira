import { HeroSection, ProfilFadeIn, VillageExplorer } from "@/components/profil";
import { BackgroundOrnaments } from "@/components/shared/BackgroundOrnaments";
import { getMapFacilities, getMapBuildingOverrides, getUMKMMapPins, getAllVillages } from "@/lib/supabase/queries";
import { mergeVillageContent } from "@/constants/profil";
import type { MapFacility, MapBuildingOverride } from "@/constants/peta";

export const revalidate = 3600;

export default async function ProfilPage() {
  const [{ data: facilitiesData }, { data: buildingOverridesData }, { data: umkmPinsData }, { data: villagesData }] =
    await Promise.all([
      getMapFacilities(),
      getMapBuildingOverrides(),
      getUMKMMapPins(),
      getAllVillages(),
    ]);
  const facilities = (facilitiesData ?? []) as MapFacility[];
  const buildingOverrides = (buildingOverridesData ?? []) as MapBuildingOverride[];
  const umkmPins = umkmPinsData ?? [];
  const villages = mergeVillageContent(villagesData ?? []);

  return (
    <ProfilFadeIn>
      <BackgroundOrnaments />
      {/* Hero Section dengan Atlas Background */}
      <HeroSection />

      <VillageExplorer
        facilities={facilities}
        buildingOverrides={buildingOverrides}
        umkmPins={umkmPins}
        villages={villages}
      />
    </ProfilFadeIn>
  );
}
