// components/shared/MapZoomControl.tsx
"use client";

import { useMap } from "react-leaflet";
import { Plus, Minus } from "lucide-react";

// Ganti kontrol zoom bawaan Leaflet (.leaflet-control-zoom — kotak putih
// polos, tidak ikut sistem hard-shadow situs ini) dengan tombol sendiri yang
// pakai pola identik tombol "Tutup detail" di panel peta (border-2 +
// hard-shadow-sm + press-effect). Ditaruh di leaflet-top/leaflet-left supaya
// masuk ke pane kontrol Leaflet yang benar (z-index & layout sinkron dengan
// AttributionControl di bottomright, bukan absolute positioning manual).
// Dipakai di VillageCadastralMap.tsx (publik/admin) dan BangunanPickerMap.tsx
// (admin) — SATU komponen, bukan diduplikasi di tiap peta Leaflet baru.
export function MapZoomControl() {
  const map = useMap();
  return (
    <div className="leaflet-top leaflet-left">
      <div className="leaflet-control m-2 flex flex-col gap-1.5">
        <button
          type="button"
          onClick={() => map.zoomIn()}
          aria-label="Perbesar peta"
          className="cursor-pointer inline-flex size-11 items-center justify-center rounded-lg border-2 border-on-surface bg-background text-on-surface hard-shadow-sm hard-shadow-hover press-effect"
        >
          <Plus className="size-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={() => map.zoomOut()}
          aria-label="Perkecil peta"
          className="cursor-pointer inline-flex size-11 items-center justify-center rounded-lg border-2 border-on-surface bg-background text-on-surface hard-shadow-sm hard-shadow-hover press-effect"
        >
          <Minus className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
