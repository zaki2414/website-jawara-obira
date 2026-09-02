// components/admin/peta/FacilityLocationMapLoader.tsx
"use client";

import dynamic from "next/dynamic";
import { Map } from "lucide-react";

// Sama seperti components/profil/VillageCadastralMapLoader.tsx — Leaflet
// menyentuh `window` saat modul di-import, jadi dynamic import ssr:false
// wajib dari leaf "use client" terpisah ini, bukan langsung di
// PetaFacilityForm.tsx.
const FacilityLocationMap = dynamic(() => import("./FacilityLocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-56 w-full animate-pulse items-center justify-center rounded-xl border-2 border-on-surface bg-surface-container">
      <Map className="size-8 text-on-surface-variant/40" aria-hidden="true" />
    </div>
  ),
});

type FacilityLocationMapLoaderProps = {
  featureId: string;
};

export default function FacilityLocationMapLoader({ featureId }: FacilityLocationMapLoaderProps) {
  return <FacilityLocationMap featureId={featureId} />;
}
