// components/admin/peta/FacilityLocationMap.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, AttributionControl } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import { AlertTriangle } from "lucide-react";
import {
  PETA_STYLE,
  CADASTRAL_MAP_CONFIG,
  getVillageFromFeatureId,
} from "@/constants/peta";
import "leaflet/dist/leaflet.css";

type FacilityLocationMapProps = {
  featureId: string;
};

// Read-only — TIDAK ada klik/pilih fitur di sini sama sekali, beda dari
// VillageCadastralMap.tsx (peta publik /profil yang interaktif). Baris
// map_facilities sudah tetap 1:1 dengan feature_id (lihat catatan di
// PetaFacilityForm.tsx), jadi satu-satunya tugas peta ini cuma menunjukkan
// SECARA VISUAL di mana posisi fitur yang sedang diedit — supaya admin tidak
// perlu menebak-nebak posisi poligon (permintaan eksplisit: "biar ketika aku
// ngedit itu aku juga tau posisi polygon yang aku edit").
function pointToCircleMarker(feature: Feature, latlng: L.LatLng, isTarget: boolean) {
  return L.circleMarker(latlng, {
    radius: isTarget ? 12 : 9,
    color: isTarget ? PETA_STYLE.stroke : PETA_STYLE.stroke,
    weight: isTarget ? 3 : 1.5,
    fillColor: isTarget ? "#ba1a1a" : PETA_STYLE.fasumDefault,
    fillOpacity: isTarget ? 0.85 : PETA_STYLE.fasumFillOpacity,
  });
}

export default function FacilityLocationMap({ featureId }: FacilityLocationMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [bangunan, setBangunan] = useState<FeatureCollection | null>(null);
  const [fasum, setFasum] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState(false);

  const village = getVillageFromFeatureId(featureId);
  const config = CADASTRAL_MAP_CONFIG[village];

  useEffect(() => {
    Promise.all([
      fetch(config.bangunanUrl).then((res) => res.json()),
      fetch(config.fasumUrl).then((res) => res.json()),
    ])
      .then(([bangunanData, fasumData]) => {
        setBangunan(bangunanData);
        setFasum(fasumData);
      })
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- featureId satu ini tetap sepanjang hidup form edit (halaman edit di-key per id), config ikut featureId, jadi cukup jalan sekali per mount.
  }, []);

  useEffect(() => {
    if (!fasum || !mapRef.current) return;
    const target = fasum.features.find((f) => f.properties?.feature_id === featureId);
    if (!target) return;
    const bounds = L.geoJSON(target).getBounds();
    if (bounds.isValid()) {
      mapRef.current.fitBounds(bounds, { padding: [60, 60], maxZoom: 19 });
    }
  }, [fasum, featureId]);

  if (error) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border-2 border-error bg-error/10 p-4 text-center">
        <div>
          <AlertTriangle className="mx-auto mb-2 size-6 text-error" aria-hidden="true" />
          <p className="text-sm font-bold text-error">Gagal memuat peta lokasi.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-on-surface">
      <MapContainer
        ref={mapRef}
        center={config.center}
        zoom={18}
        maxZoom={20}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        attributionControl={false}
        className="h-56 w-full"
      >
        <AttributionControl position="bottomright" prefix={false} />
        <TileLayer
          attribution="Tiles &copy; Esri"
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={20}
        />

        {bangunan && (
          <GeoJSON
            data={bangunan}
            style={{
              color: PETA_STYLE.stroke,
              weight: 1,
              fillColor: PETA_STYLE.bangunanDefault,
              fillOpacity: 0.3,
            }}
          />
        )}

        {fasum && (
          <GeoJSON
            key={featureId}
            data={fasum}
            style={(feature) => {
              const isTarget = feature?.properties?.feature_id === featureId;
              return {
                color: PETA_STYLE.stroke,
                weight: isTarget ? 3 : 1.5,
                fillColor: isTarget ? "#ba1a1a" : PETA_STYLE.fasumDefault,
                fillOpacity: isTarget ? 0.85 : PETA_STYLE.fasumFillOpacity,
              };
            }}
            pointToLayer={(feature, latlng) =>
              pointToCircleMarker(feature, latlng, feature.properties?.feature_id === featureId)
            }
          />
        )}
      </MapContainer>
    </div>
  );
}
