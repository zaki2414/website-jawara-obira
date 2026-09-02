import type { Feature, FeatureCollection, Polygon } from "geojson";

export type LatLng = { lat: number; lng: number };

// Ray-casting standar atas outer ring saja — seluruh data
// public/data/bangunan*.geojson adalah Polygon tanpa interior ring (dicek
// langsung di kedua file saat fitur ini dibuat), jadi tidak perlu menangani
// hole/MultiPolygon yang tidak pernah muncul di data sumbernya.
export function isPointInPolygon(point: LatLng, geometry: Polygon): boolean {
  const ring = geometry.coordinates[0];
  if (!ring) return false;

  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
    if (intersects) inside = !inside;
  }
  return inside;
}

// Dipakai dua arah: server (queries.ts, baca file geojson via fs) untuk
// halaman detail UMKM, dan client (VillageCadastralMap.tsx, geojson yang
// sudah di-fetch) untuk popup peta kadaster — makanya tidak boleh bergantung
// pada `fs`/Node API apa pun di file ini.
export function findBangunanContaining(
  point: LatLng,
  bangunan: FeatureCollection,
): Feature<Polygon> | null {
  for (const feature of bangunan.features) {
    if (feature.geometry?.type !== "Polygon") continue;
    if (isPointInPolygon(point, feature.geometry)) {
      return feature as Feature<Polygon>;
    }
  }
  return null;
}

// Rata-rata sederhana titik outer ring — cukup akurat untuk bangunan kecil
// (rumah warga), dipakai BangunanPickerMap.tsx (admin) supaya klik satu
// poligon rumah langsung menghasilkan satu titik lat/lng yang representatif
// buat disimpan sebagai lokasi UMKM.
export function getPolygonCentroid(geometry: Polygon): LatLng {
  const ring = geometry.coordinates[0];
  let latSum = 0;
  let lngSum = 0;
  for (const [lng, lat] of ring) {
    latSum += lat;
    lngSum += lng;
  }
  return { lat: latSum / ring.length, lng: lngSum / ring.length };
}

export type UMKMMapPin = {
  id: string;
  slug: string;
  name: string;
  thumbnail_url: string | null;
  latitude: number;
  longitude: number;
  village_slug: string | null;
  extra_photo_url: string | null;
};
