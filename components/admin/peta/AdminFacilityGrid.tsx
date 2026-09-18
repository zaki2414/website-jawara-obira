"use client";

import { useMemo, useState } from "react";
import { AdminFacilityCard } from "./AdminFacilityCard";
import { getVillageFromFeatureId, type MapFacility } from "@/constants/peta";
import { VILLAGE_VISUAL_META, type VillageKey } from "@/constants/profil";

type AdminFacilityGridProps = {
  facilities: MapFacility[];
};

const VILLAGE_TABS: VillageKey[] = ["kawasi", "soligi"];

// Kartu fasilitas Kawasi & Soligi TIDAK boleh ditampilkan campur dalam satu
// grid — feature_id sama-sama "fasum-N" vs "fasum-soligi-N" jadi gampang
// tertukar/susah dicari admin kalau digabung. Filter tab desa di sini reuse
// tampilan tombol yang sama persis dengan "Pilih Wilayah Peta" di
// VillageMapSection.tsx (VILLAGE_VISUAL_META), supaya polanya konsisten
// dengan bagian peta di atasnya.
export function AdminFacilityGrid({ facilities }: AdminFacilityGridProps) {
  const [village, setVillage] = useState<VillageKey>("kawasi");

  const filtered = useMemo(
    () => facilities.filter((f) => getVillageFromFeatureId(f.feature_id) === village),
    [facilities, village],
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        {VILLAGE_TABS.map((key) => {
          const active = village === key;
          const Icon = VILLAGE_VISUAL_META[key].icon;
          const count = facilities.filter((f) => getVillageFromFeatureId(f.feature_id) === key).length;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setVillage(key)}
              aria-pressed={active}
              className={`cursor-pointer inline-flex items-center gap-2 rounded-xl border-2 border-on-surface px-4 py-2 text-label-md font-black uppercase tracking-wide transition-colors hard-shadow-sm hard-shadow-hover press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                active ? "bg-primary text-on-primary" : "bg-background text-on-surface"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              {VILLAGE_VISUAL_META[key].name}
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${active ? "bg-on-primary/20" : "bg-surface-container-high text-on-surface-variant"}`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
          <p className="font-serif text-lg font-black text-on-surface">
            Belum Ada Fasilitas di {VILLAGE_VISUAL_META[village].name}
          </p>
          <p className="max-w-sm text-sm text-on-surface-variant">
            Pilih desa lain di atas, atau jalankan seed <code>map_facilities</code> untuk desa ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((facility, index) => (
            <AdminFacilityCard key={facility.id} facility={facility} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
