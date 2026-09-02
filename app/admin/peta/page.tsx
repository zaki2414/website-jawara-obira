// app/admin/peta/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getMapFacilities, getMapBuildingOverrides, getUMKMMapPins } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { AlertTriangle, Map } from "lucide-react";
import { PetaSectionBanner } from "@/components/admin/peta/PetaSectionBanner";
import { AdminFacilityGrid } from "@/components/admin/peta/AdminFacilityGrid";
import { AdminMapExplorer } from "@/components/admin/peta/AdminMapExplorer";
import type { MapFacility, MapBuildingOverride } from "@/constants/peta";

export const dynamic = "force-dynamic";

export default async function AdminPetaList() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const [{ data, error }, { data: buildingOverridesData }, { data: umkmPinsData }] = await Promise.all([
    getMapFacilities(),
    getMapBuildingOverrides(),
    getUMKMMapPins(),
  ]);
  const facilities = (data ?? []) as MapFacility[];
  const buildingOverrides = (buildingOverridesData ?? []) as MapBuildingOverride[];
  const umkmPins = umkmPinsData ?? [];

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <PetaSectionBanner
          crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Peta" }]}
          title="Peta Fasilitas Umum"
          subtitle="Lengkapi deskripsi & foto tiap fasilitas umum yang tampil di peta Desa Kawasi & Desa Soligi."
          badgeLabel="Peta"
          badgeIcon={Map}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-10 pb-6 sm:px-6 lg:px-8">
        {/* Peta interaktif — klik ikon fasilitas untuk lihat detail + tombol
            "Edit Fasilitas" langsung ke form edit, tanpa perlu scroll cari
            kartunya di grid di bawah. */}
        <AdminMapExplorer
          facilities={facilities}
          buildingOverrides={buildingOverrides}
          umkmPins={umkmPins}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data fasilitas. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : facilities.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
            <span className="inline-flex rounded-xl border-2 border-on-surface bg-tertiary-container text-on-tertiary p-3">
              <Map className="size-6" aria-hidden="true" />
            </span>
            <p className="font-serif text-lg font-black text-on-surface">
              Data Fasilitas Belum Tersedia
            </p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Jalankan seed tabel <code>map_facilities</code> di Supabase terlebih dahulu (lihat
              catatan di <code>scripts/convert-shp.mjs</code>).
            </p>
          </div>
        ) : (
          <AdminFacilityGrid facilities={facilities} />
        )}
      </div>
    </main>
  );
}
