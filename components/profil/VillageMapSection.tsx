// components/profil/VillageMapSection.tsx
"use client";

import { MapPin } from "lucide-react";
import VillageCadastralMapLoader from "./VillageCadastralMapLoader";
import { VILLAGE_VISUAL_META, type VillageKey } from "@/constants/profil";
import type { MapFacility, MapBuildingOverride } from "@/constants/peta";
import type { UMKMMapPin } from "@/lib/geo";

type VillageMapSectionProps = {
  facilities: MapFacility[];
  buildingOverrides: MapBuildingOverride[];
  umkmPins: UMKMMapPin[];
  village: VillageKey | null;
  onVillageChange: (village: VillageKey | null) => void;
  showAdminEdit?: boolean;
};

// Dikontrol dari VillageExplorer.tsx (state "desa terpilih" satu-satunya di
// /profil) — supaya pilih Kawasi/Soligi di peta atas otomatis membuka peta
// kadaster di bawah tanpa perlu klik dua kali. Leaflet tetap baru di-mount
// saat village !== null (lihat VillageCadastralMapLoader.tsx), jadi bundle
// peta tidak ke-load kalau bagian ini tidak pernah dibuka. key={village} pada
// pemanggilan VillageCadastralMapLoader MEMAKSA full remount tiap ganti
// desa, supaya fetch GeoJSON & state "fitur terpilih" di dalamnya selalu
// reset bersih — bukan cuma prop yang berubah di komponen yang sama.
export function VillageMapSection({ facilities, buildingOverrides, umkmPins, village, onVillageChange, showAdminEdit }: VillageMapSectionProps) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border-2 border-on-surface bg-aged-paper px-5 py-4 hard-shadow-md sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="size-5 text-primary" aria-hidden="true" />
          <h3 className="font-serif text-lg font-black text-on-surface">Pilih Wilayah Peta</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(VILLAGE_VISUAL_META) as VillageKey[]).map((key) => {
            const active = village === key;
            const Icon = VILLAGE_VISUAL_META[key].icon;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onVillageChange(active ? null : key)}
                aria-pressed={active}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border-2 border-on-surface px-4 py-2 text-label-md font-black uppercase tracking-wide transition-all hard-shadow-sm hard-shadow-hover press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                  active ? "bg-primary text-on-primary" : "bg-background text-on-surface"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {VILLAGE_VISUAL_META[key].name}
              </button>
            );
          })}
        </div>
      </div>

      {village === null ? (
        <div className="flex min-h-72 flex-col items-center justify-center gap-3 rounded-2xl border-4 border-dashed border-on-surface/25 bg-natural-paper/50 p-8 text-center">
          <MapPin className="size-10 text-on-surface-variant/40" aria-hidden="true" />
          <p className="font-bold text-on-surface-variant">
            Pilih salah satu desa di atas untuk menampilkan peta.
          </p>
        </div>
      ) : (
        <VillageCadastralMapLoader
          key={village}
          village={village}
          facilities={facilities}
          buildingOverrides={buildingOverrides}
          umkmPins={umkmPins}
          showAdminEdit={showAdminEdit}
        />
      )}
    </div>
  );
}
