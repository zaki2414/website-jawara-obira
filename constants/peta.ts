import {
  Landmark,
  School,
  Stethoscope,
  Building2,
  Trees,
  MapPin,
  Anchor,
  Milestone,
  LandPlot,
  Volleyball,
  Flower2,
  Store,
  type LucideIcon,
} from "lucide-react";
import type { VillageKey } from "./profil";

// ==========================================
// TIPE DATA
// ==========================================

// Baris tabel Supabase `map_facilities` — dikelola dari /admin/peta.
// feature_id ("fasum-0".. untuk Kawasi, "fasum-soligi-0".. untuk Soligi)
// adalah kunci pencocokan ke properties.feature_id di public/data/fasum*.geojson,
// DIINJEKSI SAAT KONVERSI (scripts/convert-shp.mjs) karena shapefile sumber
// tidak punya primary key sendiri (id selalu null). Layer bangunan TIDAK
// pernah punya baris di tabel ini — cuma fasum yang dikelola admin.
export type MapFacility = {
  id: string;
  feature_id: string;
  name: string;
  description: string | null;
  photo_url: string | null;
  updated_at?: string;
};

// Properti fasum yang sudah DINORMALISASI ke bentuk ini oleh
// scripts/convert-shp.mjs — Kawasi sumbernya sudah punya kolom "Nama Fasum"
// asli, Soligi sumbernya kolom "Ket"/"Keterangan" beda nama tapi dipetakan
// ke field yang sama di sini supaya VillageCadastralMap.tsx tidak perlu tahu
// bedanya sama sekali.
export type FasumProperties = {
  feature_id: string;
  "Nama Fasum": string;
};

// Properti bangunan yang sudah DINORMALISASI juga — punya beda makna per
// desa: BLOK Kawasi = blok RT/RW asli hasil survei manual, BLOK Soligi =
// nama dusun (Dusun 1/2/3) karena sumbernya cuma footprint hasil deteksi
// otomatis (Plus Code + luas + confidence), bukan survei manual, jadi
// "No Rumah" SELALU null untuk Soligi (kolom itu memang tidak ada di data
// sumbernya). "Pemilik" ada di shapefile Kawasi tapi KOSONG di seluruh 264
// baris, jadi TIDAK ditampilkan di popup supaya tidak nampilkan label kosong.
export type BangunanProperties = {
  feature_id: string;
  Pemilik: string;
  BLOK: string;
  "No Rumah": number | null;
};

// Baris tabel Supabase `map_buildings` (lihat scripts/create-map-buildings-table.sql)
// — override BLOK/No Rumah untuk satu poligon rumah warga, diinput admin
// lewat panel "Rumah Warga" saat GeoJSON sumbernya bilang "Data belum
// lengkap". BEDA dari MapFacility: TIDAK pre-seeded 1 baris per fitur (264+
// rumah per desa, kebanyakan tidak pernah diedit) — baris di sini cuma ada
// untuk rumah yang PERNAH diedit admin, dicocokkan ke geometri lewat
// feature_id yang sama dengan yang dipakai MapFacility.
export type MapBuildingOverride = {
  id: string;
  feature_id: string;
  blok: string | null;
  no_rumah: number | null;
  updated_at?: string;
};

// ==========================================
// KATEGORI FASILITAS — untuk pemilihan ikon (SVG lucide, bukan emoji, sesuai
// CLAUDE.md §3.4) berdasarkan FUNGSI bangunan, bukan per-agama, supaya tempat
// ibadah (Masjid/Mushola/Gereja) diperlakukan setara dengan ikon yang sama.
// ==========================================
// Peta nama -> ikon LANGSUNG (bukan lewat fungsi pembungkus) supaya caller
// bisa resolve dengan object-lookup (`FACILITY_ICON_BY_NAME[name] ?? MapPin`),
// pola yang sama dengan ICONS[item.icon] di MenuCard.tsx/KKNMenuCard.tsx —
// eslint-plugin-react-hooks (static-components) menandai pemanggilan FUNGSI
// yang me-return komponen sebagai "component created during render", tapi
// tidak menandai object-lookup biasa.
export const FACILITY_ICON_BY_NAME: Record<string, LucideIcon> = {
  // Desa Kawasi
  Masjid: Landmark,
  Mushola: Landmark,
  Gereja: Landmark,
  "Sekolah Dasar": School,
  SMP: School,
  SMA: School,
  Puskesmas: Stethoscope,
  "Kantor Desa": Building2,
  "Kantor Advokasi": Building2,
  "Gedung Serbaguna": Trees,
  "Taman Ceria": Trees,
  "Taman ceria": Trees,
  "Lapangan Volly": Trees,
  "Lapangan Sepak Bola": Trees,

  // Desa Soligi — nama aslinya proper noun spesifik (mis. "Masjid AL-Baqi"),
  // beda dari Kawasi yang generik ("Masjid"), jadi tetap didaftar exact-match
  // satu-satu di sini (bukan dicocokkan via substring) supaya konsisten
  // dengan pola object-lookup di atas.
  Dermaga: Anchor,
  Jembatan: Milestone,
  "Lapangan Desa": LandPlot,
  "Lapangan Voli": Volleyball,
  Makam: Flower2,
  "Masjid AL-Baqi": Landmark,
  "Mushola Al-Aqhirra": Landmark,
  POSTU: Stethoscope,
  RUTE: Store,
  "SDN 148 HALSEL": School,
  "SDN 264 HALSEL": School,
  "SMAN 35 HALSEL": School,
  "SMPN 39 Halsesl": School,
  "Menara Suar Tanjung Akelamo": Anchor,
};

export const DEFAULT_FACILITY_ICON: LucideIcon = MapPin;

// ==========================================
// STYLE GEOMETRI PETA — nilai hex literal (BUKAN var(--color-*)) karena
// Leaflet/Canvas butuh string warna langsung, sama seperti alasan MAP_THEME
// di constants/profil.ts (dipakai VillagePickerMap.tsx). Jaga sinkron manual
// dengan app/globals.css kalau token warnanya berubah.
// ==========================================
export const PETA_STYLE = {
  fasumDefault: "#FEBE00", // --color-primary
  fasumHover: "#FEBE00", // --color-tertiary
  fasumFillOpacity: 0.65,
  fasumFillOpacityHover: 0.9,
  bangunanDefault: "#006689", // --color-primary-container
  bangunanHover: "#006689", // --color-primary
  bangunanFillOpacity: 0.65,
  bangunanFillOpacityHover: 0.9,
  stroke: "#1d1c18", // --color-on-surface
};

// ==========================================
// KONFIGURASI PETA PER DESA — satu-satunya tempat yang tahu nama file
// GeoJSON & titik tengah tiap desa, supaya VillageCadastralMap.tsx cukup
// menerima prop `village` dan tidak perlu percabangan if/else Kawasi-vs-Soligi
// tersebar di banyak tempat.
// ==========================================
export type CadastralMapConfig = {
  bangunanUrl: string;
  fasumUrl: string;
  center: [number, number];
};

export const CADASTRAL_MAP_CONFIG: Record<VillageKey, CadastralMapConfig> = {
  kawasi: {
    bangunanUrl: "/data/bangunan.geojson",
    fasumUrl: "/data/fasum.geojson",
    center: [-1.5919, 127.4171],
  },
  soligi: {
    bangunanUrl: "/data/bangunan-soligi.geojson",
    fasumUrl: "/data/fasum-soligi.geojson",
    center: [-1.6573, 127.4213],
  },
};

// feature_id sudah dinamespace per-desa sejak diinjeksi di convert-shp.mjs
// ("fasum-soligi-N"/"bangunan-soligi-N" utk Soligi, "fasum-N"/"bangunan-N"
// utk Kawasi) — dipakai FacilityLocationMap.tsx (admin) untuk tahu geojson
// desa mana yang perlu di-load dari satu feature_id saja, tanpa perlu kolom
// "village" terpisah di tabel map_facilities.
export function getVillageFromFeatureId(featureId: string): VillageKey {
  return featureId.includes("-soligi-") ? "soligi" : "kawasi";
}
