// components/profil/VillageCadastralMap.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, GeoJSON, AttributionControl } from "react-leaflet";
import type { Layer, Map as LeafletMap, Path, LatLng } from "leaflet";
import type { Feature, FeatureCollection } from "geojson";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, MousePointerClick, Home, X, Store, ArrowRight, PenSquare } from "lucide-react";
import {
  FACILITY_ICON_BY_NAME,
  DEFAULT_FACILITY_ICON,
  PETA_STYLE,
  CADASTRAL_MAP_CONFIG,
  type MapFacility,
  type MapBuildingOverride,
  type FasumProperties,
  type BangunanProperties,
} from "@/constants/peta";
import type { VillageKey } from "@/constants/profil";
import { findBangunanContaining, type UMKMMapPin } from "@/lib/geo";
import { MapZoomControl } from "@/components/shared/MapZoomControl";
import { createClient } from "@/lib/supabase/client";
import "leaflet/dist/leaflet.css";

type VillageCadastralMapProps = {
  village: VillageKey;
  facilities: MapFacility[];
  buildingOverrides: MapBuildingOverride[];
  umkmPins: UMKMMapPin[];
  // Dipakai admin/peta (lihat AdminMapExplorer.tsx) untuk menampilkan tombol
  // "Edit" di panel detail fasum, langsung ke /admin/peta/[id] — komponen
  // yang SAMA PERSIS dipakai publik (/profil) dan admin, cuma beda satu
  // prop ini, supaya perilaku peta (zoom, klik, dst.) selalu identik di
  // kedua tempat tanpa duplikasi logic Leaflet+GeoJSON.
  showAdminEdit?: boolean;
};

type SelectedFeature =
  | { kind: "fasum"; props: FasumProperties; facility?: MapFacility }
  | { kind: "bangunan"; props: BangunanProperties };

function isSameFeature(a: SelectedFeature, b: SelectedFeature) {
  return a.kind === b.kind && a.props.feature_id === b.props.feature_id;
}

// Sebagian fitur fasum Soligi geometrinya Point (menara suar), bukan Polygon
// seperti fasum lain — pakai circleMarker (bukan L.marker default) supaya
// TIDAK butuh asset ikon pin bawaan Leaflet (yang path-nya sering 404 di
// bundler kalau tidak dikonfigurasi manual) dan supaya tetap sebuah Path,
// jadi hover/klik pakai handler yang SAMA PERSIS dengan poligon lain
// (layer.setStyle() bekerja di keduanya).
function pointToCircleMarker(_feature: Feature, latlng: LatLng) {
  return L.circleMarker(latlng, {
    radius: 9,
    color: PETA_STYLE.stroke,
    weight: 1.5,
    fillColor: PETA_STYLE.fasumDefault,
    fillOpacity: PETA_STYLE.fasumFillOpacity,
  });
}

export default function VillageCadastralMap({ village, facilities, buildingOverrides, umkmPins, showAdminEdit }: VillageCadastralMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);
  const [bangunan, setBangunan] = useState<FeatureCollection | null>(null);
  const [fasum, setFasum] = useState<FeatureCollection | null>(null);
  const [error, setError] = useState(false);
  const [selected, setSelected] = useState<SelectedFeature | null>(null);

  // Salinan LOKAL dari prop buildingOverrides — di-update langsung saat admin
  // simpan edit rumah (handleSaveBuilding), supaya klik-ulang polygon yang
  // sama dalam sesi ini langsung lihat data baru tanpa perlu reload halaman
  // (prop dari server tidak refetch sendiri). Dibaca lewat ref di dalam click
  // handler Leaflet karena onEachFeature cuma jalan sekali saat layer dibuat
  // — closure di dalamnya butuh ref supaya selalu baca state TERBARU, bukan
  // state saat layer pertama kali di-mount.
  const [overrides, setOverrides] = useState<Map<string, MapBuildingOverride>>(() => {
    const map = new Map<string, MapBuildingOverride>();
    for (const o of buildingOverrides) map.set(o.feature_id, o);
    return map;
  });
  const overridesRef = useRef(overrides);
  useEffect(() => {
    overridesRef.current = overrides;
  }, [overrides]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- config.bangunanUrl/fasumUrl SELALU berubah bareng `village`; VillageMapSection.tsx sudah remount komponen ini via key={village} tiap ganti desa, jadi effect ini memang cuma perlu jalan sekali per mount, tidak perlu di-re-run manual di sini.
  }, []);

  const facilityByFeatureId = new Map(facilities.map((f) => [f.feature_id, f]));

  // UMKM dicocokkan ke poligon rumah lewat point-in-polygon (lib/geo.ts),
  // BUKAN lewat kolom relasi manual — jadi otomatis sinkron kalau admin
  // update titik lokasi UMKM tanpa perlu edit apa pun di sisi peta. Hanya
  // dihitung ulang saat `bangunan`/`umkmPins` berubah (bukan tiap render).
  const umkmByFeatureId = useMemo(() => {
    const map = new Map<string, UMKMMapPin[]>();
    if (!bangunan) return map;
    for (const pin of umkmPins) {
      if (pin.village_slug !== village) continue;
      const match = findBangunanContaining({ lat: pin.latitude, lng: pin.longitude }, bangunan);
      const featureId = (match?.properties as { feature_id?: string } | undefined)?.feature_id;
      if (!featureId) continue;
      const existing = map.get(featureId);
      if (existing) existing.push(pin);
      else map.set(featureId, [pin]);
    }
    return map;
  }, [bangunan, umkmPins, village]);

  const onEachBangunan = (feature: Feature, layer: Layer) => {
    const rawProps = feature.properties as BangunanProperties;
    layer.on("click", () => {
      // Baca dari ref (bukan `overrides` langsung) — onEachFeature cuma
      // dipanggil sekali saat GeoJSON layer dibuat, jadi closure ini kalau
      // baca state biasa akan selalu lihat versi SAAT MOUNT, tidak pernah
      // ter-update walau admin baru saja simpan edit rumah lain.
      const override = overridesRef.current.get(rawProps.feature_id);
      const props: BangunanProperties = {
        ...rawProps,
        BLOK: override?.blok ?? rawProps.BLOK,
        "No Rumah": override?.no_rumah ?? rawProps["No Rumah"],
      };
      const next: SelectedFeature = { kind: "bangunan", props };
      setSelected((prev) => (prev && isSameFeature(prev, next) ? null : next));
    });
    layer.on("mouseover", () =>
      (layer as Path).setStyle({
        fillOpacity: PETA_STYLE.bangunanFillOpacityHover,
        fillColor: PETA_STYLE.bangunanHover,
      }),
    );
    layer.on("mouseout", () =>
      (layer as Path).setStyle({
        fillOpacity: PETA_STYLE.bangunanFillOpacity,
        fillColor: PETA_STYLE.bangunanDefault,
      }),
    );
  };

  const onEachFasum = (feature: Feature, layer: Layer) => {
    const props = feature.properties as FasumProperties;
    const facility = facilityByFeatureId.get(props.feature_id);
    layer.on("click", () => {
      const next: SelectedFeature = { kind: "fasum", props, facility };
      setSelected((prev) => (prev && isSameFeature(prev, next) ? null : next));
    });
    layer.on("mouseover", () =>
      (layer as Path).setStyle({
        fillOpacity: PETA_STYLE.fasumFillOpacityHover,
        fillColor: PETA_STYLE.fasumHover,
      }),
    );
    layer.on("mouseout", () =>
      (layer as Path).setStyle({
        fillOpacity: PETA_STYLE.fasumFillOpacity,
        fillColor: PETA_STYLE.fasumDefault,
      }),
    );
  };

  // Ditaruh di komponen yang sama (bukan dilempar ke queries.ts server-side)
  // karena upsert-nya dipicu langsung dari klik di panel detail, sama
  // seperti pola UploadForm.tsx (Client Component langsung pakai
  // createClient() dari lib/supabase/client.ts untuk mutation satu-off).
  const handleSaveBuilding = async (
    featureId: string,
    payload: { blok: string | null; no_rumah: number | null },
  ) => {
    const supabase = createClient();
    const { data, error: saveError } = await supabase
      .from("map_buildings")
      .upsert({ feature_id: featureId, ...payload }, { onConflict: "feature_id" })
      .select()
      .single();
    if (saveError) throw saveError;

    const saved = data as MapBuildingOverride;
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(featureId, saved);
      return next;
    });
    setSelected((prev) =>
      prev && prev.kind === "bangunan" && prev.props.feature_id === featureId
        ? { kind: "bangunan", props: { ...prev.props, BLOK: saved.blok ?? "", "No Rumah": saved.no_rumah } }
        : prev,
    );
  };

  if (error) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-2xl border-4 border-error bg-background p-8 text-center hard-shadow-lg">
        <div>
          <AlertTriangle className="mx-auto mb-3 size-8 text-error" aria-hidden="true" />
          <p className="font-bold text-error">Gagal memuat data peta. Muat ulang halaman.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
      {/* KIRI: PETA */}
      {/* isolate WAJIB ada — panel/kontrol internal Leaflet pakai z-index
          sampai 1000, lebih tinggi dari Navbar.tsx (z-50). Tanpa stacking
          context sendiri di sini, z-index itu "bocor" ke luar dan peta akan
          menembus/menimpa navbar saat halaman di-scroll. */}
      <div className="relative isolate overflow-hidden rounded-2xl border-4 border-on-surface hard-shadow-lg lg:col-span-8">
        <MapContainer
          ref={mapRef}
          center={config.center}
          zoom={17}
          maxZoom={20}
          scrollWheelZoom={false}
          zoomControl={false}
          attributionControl={false}
          className="h-[70vh] min-h-100 w-full"
        >
          {/* prefix={false} membuang teks/logo "Leaflet" bawaan, tapi atribusi
              citra Esri TETAP ditampilkan — wajib dipertahankan sesuai syarat
              pemakaian gratis tile World_Imagery mereka. */}
          <AttributionControl position="bottomright" prefix={false} />
          <MapZoomControl />

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
                weight: 1.5,
                fillColor: PETA_STYLE.bangunanDefault,
                fillOpacity: PETA_STYLE.bangunanFillOpacity,
              }}
              onEachFeature={onEachBangunan}
            />
          )}

          {fasum && (
            <GeoJSON
              data={fasum}
              style={{
                color: PETA_STYLE.stroke,
                weight: 1.5,
                fillColor: PETA_STYLE.fasumDefault,
                fillOpacity: PETA_STYLE.fasumFillOpacity,
              }}
              pointToLayer={pointToCircleMarker}
              onEachFeature={onEachFasum}
            />
          )}
        </MapContainer>
      </div>

      {/* KANAN: DETAIL — di luar map, bukan popup Leaflet, supaya bisa dikustom
          bebas pakai JSX/Tailwind biasa (foto, tombol tutup, dst.) tanpa harus
          lewat trik renderToStaticMarkup ke HTML string. */}
      <div className="lg:col-span-4">
        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={`${selected.kind}-${selected.props.feature_id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden rounded-2xl border-4 border-on-surface bg-background hard-shadow-lg lg:sticky lg:top-6"
            >
              {selected.kind === "fasum" ? (
                <FasumDetail
                  props={selected.props}
                  facility={selected.facility}
                  showAdminEdit={showAdminEdit}
                  onClose={() => setSelected(null)}
                />
              ) : (
                <BangunanDetail
                  props={selected.props}
                  linkedUMKM={umkmByFeatureId.get(selected.props.feature_id)}
                  showAdminEdit={showAdminEdit}
                  onSave={handleSaveBuilding}
                  onClose={() => setSelected(null)}
                />
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex min-h-72 flex-col bg-aged-paper items-center justify-center gap-3 rounded-2xl border-4 border-dashed border-on-surface/25 bg-natural-paper/50 p-8 text-center lg:sticky lg:top-6 lg:min-h-[70vh]"
            >
              <MousePointerClick
                className="size-10 text-on-surface-variant/40"
                aria-hidden="true"
              />
              <p className="font-bold text-on-surface-variant">
                Klik salah satu bangunan atau fasilitas pada peta untuk melihat detailnya.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FasumDetail({
  props,
  facility,
  showAdminEdit,
  onClose,
}: {
  props: FasumProperties;
  facility?: MapFacility;
  showAdminEdit?: boolean;
  onClose: () => void;
}) {
  const name = facility?.name || props["Nama Fasum"] || "Fasilitas Umum";
  const Icon = FACILITY_ICON_BY_NAME[props["Nama Fasum"]] ?? DEFAULT_FACILITY_ICON;

  return (
    <div>
      <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
        {facility?.photo_url ? (
          <Image
            src={facility.photo_url}
            alt={name}
            fill
            sizes="(min-width: 1024px) 33vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
            <Icon className="size-14 stroke-[1.25]" aria-hidden="true" />
          </div>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail"
          className="absolute right-2 top-2 inline-flex rounded-full border-2 border-on-surface bg-background p-1.5 text-on-surface hard-shadow-sm hard-shadow-hover press-effect"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
      <div className="p-5">
        <h4 className="mb-1.5 flex items-center gap-2 font-serif text-xl font-black leading-snug text-on-surface">
          <Icon className="size-5 shrink-0 text-primary" aria-hidden="true" />
          {name}
        </h4>
        <p className="text-sm text-on-surface-variant">
          {facility?.description || "Belum ada deskripsi untuk fasilitas ini."}
        </p>

        {showAdminEdit && facility && (
          <Link
            href={`/admin/peta/${facility.id}`}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-on-surface bg-tertiary px-3 py-1.5 text-label-sm font-black uppercase tracking-wide text-on-tertiary hard-shadow-sm hard-shadow-hover press-effect"
          >
            <PenSquare className="size-3.5 shrink-0" aria-hidden="true" />
            Edit Fasilitas
          </Link>
        )}
      </div>
    </div>
  );
}

function BangunanDetail({
  props,
  linkedUMKM,
  showAdminEdit,
  onSave,
  onClose,
}: {
  props: BangunanProperties;
  linkedUMKM?: UMKMMapPin[];
  showAdminEdit?: boolean;
  onSave?: (featureId: string, payload: { blok: string | null; no_rumah: number | null }) => Promise<void>;
  onClose: () => void;
}) {
  const blok = props.BLOK?.trim();
  const noRumah = props["No Rumah"];
  const hasData = blok || (noRumah !== null && noRumah !== undefined);

  const [isEditing, setIsEditing] = useState(false);
  const [blokInput, setBlokInput] = useState(blok ?? "");
  const [noRumahInput, setNoRumahInput] = useState(noRumah != null ? String(noRumah) : "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // TIDAK butuh effect untuk reset form saat ganti fitur — motion.div
  // pembungkus di VillageCadastralMap sudah key={`${kind}-${feature_id}`},
  // jadi React remount BangunanDetail dari nol tiap kali admin klik rumah
  // lain (useState di atas otomatis re-inisialisasi dari props terbaru).
  // Saat onSave() sukses, feature_id TIDAK berubah (fitur yang sama, cuma
  // datanya ter-update) jadi tidak remount — itu memang perilaku yang
  // diinginkan, input tidak perlu direset karena sudah sama dengan yang baru disimpan.

  const handleSave = async () => {
    if (!onSave) return;
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(props.feature_id, {
        blok: blokInput.trim() || null,
        no_rumah: noRumahInput.trim() ? Number(noRumahInput) : null,
      });
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="relative p-5">
      <button
        type="button"
        onClick={onClose}
        aria-label="Tutup detail"
        className="absolute right-3 top-3 inline-flex rounded-full border-2 border-on-surface bg-background p-1.5 text-on-surface hard-shadow-sm hard-shadow-hover press-effect"
      >
        <X className="size-4" aria-hidden="true" />
      </button>
      <h4 className="mb-3 flex items-center gap-2 font-serif text-xl font-black leading-snug text-on-surface">
        <Home className="size-5 shrink-0 text-primary" aria-hidden="true" />
        Rumah Warga
      </h4>

      {isEditing ? (
        <div className="space-y-3">
          {saveError && (
            <div
              role="alert"
              className="rounded-lg border-2 border-error/30 bg-error-container p-2 text-xs font-bold text-error"
            >
              {saveError}
            </div>
          )}
          <div>
            <label className="mb-1 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Blok
            </label>
            <input
              type="text"
              value={blokInput}
              onChange={(e) => setBlokInput(e.target.value)}
              className="w-full rounded-lg border-2 border-on-surface bg-background p-2 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Contoh: RT 02/RW 01"
            />
          </div>
          <div>
            <label className="mb-1 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              No Rumah
            </label>
            <input
              type="number"
              value={noRumahInput}
              onChange={(e) => setNoRumahInput(e.target.value)}
              className="w-full rounded-lg border-2 border-on-surface bg-background p-2 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="Contoh: 12"
            />
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-on-surface bg-tertiary px-3 py-1.5 text-label-sm font-black uppercase tracking-wide text-on-tertiary hard-shadow-sm hard-shadow-hover press-effect disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Menyimpan..." : "Simpan"}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              disabled={saving}
              className="inline-flex items-center gap-1.5 rounded-lg border-2 border-on-surface bg-background px-3 py-1.5 text-label-sm font-black uppercase tracking-wide text-on-surface hard-shadow-sm hard-shadow-hover press-effect disabled:cursor-not-allowed disabled:opacity-60"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <>
          {hasData ? (
            <dl className="space-y-2 text-sm text-on-surface-variant">
              {blok && (
                <div className="flex gap-2">
                  <dt className="font-black text-on-surface">Blok:</dt>
                  <dd>{blok}</dd>
                </div>
              )}
              {noRumah !== null && noRumah !== undefined && (
                <div className="flex gap-2">
                  <dt className="font-black text-on-surface">No Rumah:</dt>
                  <dd>{noRumah}</dd>
                </div>
              )}
            </dl>
          ) : (
            <p className="text-sm text-on-surface-variant">Data belum lengkap.</p>
          )}

          {showAdminEdit && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg border-2 border-on-surface bg-tertiary px-3 py-1.5 text-label-sm font-black uppercase tracking-wide text-on-tertiary hard-shadow-sm hard-shadow-hover press-effect"
            >
              <PenSquare className="size-3.5 shrink-0" aria-hidden="true" />
              {hasData ? "Edit Data Rumah" : "Lengkapi Data Rumah"}
            </button>
          )}
        </>
      )}

      {linkedUMKM && linkedUMKM.length > 0 && (
        <div className="mt-4 space-y-3 border-t-2 border-dashed border-outline-variant pt-4">
          {linkedUMKM.map((umkm) => {
            const photos = [umkm.thumbnail_url, umkm.extra_photo_url].filter(
              (url): url is string => Boolean(url),
            );
            return (
              <div
                key={umkm.id}
                className="overflow-hidden rounded-xl border-2 border-on-surface bg-surface-container-low"
              >
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 gap-px bg-on-surface">
                    {photos.slice(0, 2).map((url, i) => (
                      <div key={i} className="relative aspect-4/3 bg-surface-container-high">
                        <Image
                          src={url}
                          alt={umkm.name}
                          fill
                          sizes="(min-width: 1024px) 16vw, 50vw"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="p-3">
                  <p className="mb-2 flex items-center gap-1.5 text-sm font-black text-on-surface">
                    <Store className="size-3.5 shrink-0 text-primary" aria-hidden="true" />
                    {umkm.name}
                  </p>
                  <Link
                    href={`/umkm/${umkm.slug}`}
                    className="inline-flex items-center gap-1.5 text-label-sm font-black uppercase tracking-wide text-primary hover:underline"
                  >
                    Lihat UMKM
                    <ArrowRight className="size-3.5 shrink-0" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
