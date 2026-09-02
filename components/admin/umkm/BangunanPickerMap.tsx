// components/admin/umkm/BangunanPickerMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, GeoJSON, AttributionControl } from "react-leaflet";
import type { Layer, Map as LeafletMap, Path } from "leaflet";
import type { Feature, FeatureCollection, Polygon } from "geojson";
import { AlertTriangle } from "lucide-react";
import { PETA_STYLE, CADASTRAL_MAP_CONFIG } from "@/constants/peta";
import type { VillageKey } from "@/constants/profil";
import { findBangunanContaining, getPolygonCentroid, type LatLng } from "@/lib/geo";
import { MapZoomControl } from "@/components/shared/MapZoomControl";
import "leaflet/dist/leaflet.css";

type BangunanPickerMapProps = {
  village: VillageKey;
  value: LatLng | null;
  onSelect: (point: LatLng & { blok: string | null }) => void;
};

// Warna "terpilih" pakai --color-error (bukan primary/tertiary) SENGAJA —
// supaya jelas beda dari kategori fitur biasa di peta, murni penanda status
// pilihan admin saat ini, sama seperti FacilityLocationMap.tsx (admin/peta).
const SELECTED_FILL = "#ba1a1a";

export default function BangunanPickerMap({ village, value, onSelect }: BangunanPickerMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [bangunan, setBangunan] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState(false);

  const config = CADASTRAL_MAP_CONFIG[village];

  useEffect(() => {
    fetch(config.bangunanUrl)
      .then((res) => res.json())
      .then(setBangunan)
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- village dikontrol dari key={village} di UMKMForm.tsx (remount penuh tiap ganti desa), jadi effect ini cukup jalan sekali per mount.
  }, []);

  const selectedFeatureId =
    bangunan && value
      ? ((findBangunanContaining(value, bangunan)?.properties as { feature_id?: string } | undefined)
          ?.feature_id ?? null)
      : null;

  const onEachBangunan = (feature: Feature, layer: Layer) => {
    layer.on("click", () => {
      const geometry = feature.geometry as Polygon;
      const centroid = getPolygonCentroid(geometry);
      const blok = (feature.properties as { BLOK?: string } | undefined)?.BLOK?.trim() || null;
      onSelect({ ...centroid, blok });
    });
    layer.on("mouseover", () => {
      if (feature.properties?.feature_id === selectedFeatureId) return;
      (layer as Path).setStyle({
        fillOpacity: PETA_STYLE.bangunanFillOpacityHover,
        fillColor: PETA_STYLE.bangunanHover,
      });
    });
    layer.on("mouseout", () => {
      if (feature.properties?.feature_id === selectedFeatureId) return;
      (layer as Path).setStyle({
        fillOpacity: PETA_STYLE.bangunanFillOpacity,
        fillColor: PETA_STYLE.bangunanDefault,
      });
    });
  };

  if (error) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border-2 border-error bg-error/10 p-4 text-center">
        <div>
          <AlertTriangle className="mx-auto mb-2 size-6 text-error" aria-hidden="true" />
          <p className="text-sm font-bold text-error">Gagal memuat peta bangunan.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-on-surface">
      <MapContainer
        ref={mapRef}
        center={config.center}
        zoom={17}
        maxZoom={20}
        scrollWheelZoom={false}
        zoomControl={false}
        attributionControl={false}
        className="h-80 w-full [&_.leaflet-interactive]:cursor-pointer"
      >
        <AttributionControl position="bottomright" prefix={false} />
        <MapZoomControl />

        <TileLayer
          attribution="Tiles &copy; Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={20}
        />

        {bangunan && (
          <GeoJSON
            key={village}
            data={bangunan}
            style={(feature) => {
              const isSelected = feature?.properties?.feature_id === selectedFeatureId;
              return {
                color: PETA_STYLE.stroke,
                weight: isSelected ? 3 : 1.5,
                fillColor: isSelected ? SELECTED_FILL : PETA_STYLE.bangunanDefault,
                fillOpacity: isSelected ? 0.85 : PETA_STYLE.bangunanFillOpacity,
              };
            }}
            onEachFeature={onEachBangunan}
          />
        )}
      </MapContainer>
    </div>
  );
}
