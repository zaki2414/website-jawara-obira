// components/admin/umkm/BangunanPickerMapLoader.tsx
"use client";

import dynamic from "next/dynamic";
import { Map } from "lucide-react";
import type { VillageKey } from "@/constants/profil";
import type { LatLng } from "@/lib/geo";

// Sama seperti components/profil/VillageCadastralMapLoader.tsx — Leaflet
// menyentuh `window` saat modul di-import, jadi dynamic import ssr:false
// wajib dari leaf "use client" terpisah ini, bukan langsung di UMKMForm.tsx.
const BangunanPickerMap = dynamic(() => import("./BangunanPickerMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-80 w-full animate-pulse items-center justify-center rounded-xl border-2 border-on-surface bg-surface-container">
      <Map className="size-8 text-on-surface-variant/40" aria-hidden="true" />
    </div>
  ),
});

type BangunanPickerMapLoaderProps = {
  village: VillageKey;
  value: LatLng | null;
  onSelect: (point: LatLng & { blok: string | null }) => void;
};

export default function BangunanPickerMapLoader({ village, value, onSelect }: BangunanPickerMapLoaderProps) {
  return <BangunanPickerMap village={village} value={value} onSelect={onSelect} />;
}
