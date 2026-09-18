// scripts/convert-shp.mjs
//
// Konversi shapefile QGIS jadi GeoJSON siap-pakai di public/data/*.geojson.
// Reprojection CRS (mis. WGS 1984 UTM Zone 52S -> WGS84/EPSG:4326) ditangani
// otomatis oleh shpjs lewat isi file .prj — tidak perlu export manual dari
// QGIS. Sumbernya:
//   - public/Peta Bangunan/                              (Desa Kawasi, bangunan)
//   - public/Peta Fasilitas Umum/                         (Desa Kawasi, fasum)
//   - public/Peta Fasilitas Umum dan Bangunan Desa Soligi/ (Desa Soligi, keduanya)
//
// Data Soligi punya SKEMA MENTAH BERBEDA dari Kawasi (dusun1/2/3 = footprint
// bangunan hasil deteksi otomatis dengan kolom Plus Code/area/confidence,
// bukan survei manual BLOK/No Rumah; fasum pakai kolom "Ket"/"Keterangan",
// bukan "Nama Fasum"; menara suar malah file terpisah sendiri) — semuanya
// DINORMALISASI di sini ke bentuk properti yang SAMA PERSIS dengan Kawasi
// (BangunanProperties/FasumProperties di constants/peta.ts), supaya
// VillageCadastralMap.tsx dan seluruh app tidak perlu tahu bedanya sama
// sekali, cukup baca "BLOK"/"No Rumah" atau "Nama Fasum" seperti biasa.
//
// Jalankan ulang script ini setiap kali file shapefile sumber diperbarui:
//   npm run convert:shp
import shp from "shpjs";
import fs from "fs";
import path from "path";

const BASE = process.cwd();

async function loadShp(dir, baseName) {
  const shpBuf = fs.readFileSync(path.join(dir, `${baseName}.shp`));
  const dbfBuf = fs.readFileSync(path.join(dir, `${baseName}.dbf`));
  const prjText = fs.readFileSync(path.join(dir, `${baseName}.prj`), "utf-8");
  const cpgPath = path.join(dir, `${baseName}.cpg`);
  const cpgText = fs.existsSync(cpgPath) ? fs.readFileSync(cpgPath, "utf-8") : undefined;

  const geojson = await shp({ shp: shpBuf, dbf: dbfBuf, prj: prjText, cpg: cpgText });

  // Beberapa baris .dbf sumber (terutama dusun1/dusun3 Soligi) punya
  // geometri kosong/null (baris data tanpa bentuk) — GeoJSON layer Leaflet
  // akan error kalau ini tidak disaring dulu.
  const before = geojson.features.length;
  geojson.features = geojson.features.filter((f) => f.geometry);
  const dropped = before - geojson.features.length;
  if (dropped > 0) {
    console.log(`  (${baseName}: ${dropped} fitur geometri kosong dibuang)`);
  }

  return geojson;
}

function writeOut(outName, geojson) {
  const outPath = path.join(BASE, "public", "data", outName);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(geojson));
  console.log(`${outName}: ${geojson.features.length} fitur ditulis ke ${outPath}`);
}

// ================= DESA KAWASI (skema sudah rapi apa adanya) =================
async function convertKawasi() {
  const sources = [
    { folder: "Peta Bangunan", baseName: "bangunan", outName: "bangunan.geojson" },
    { folder: "Peta Fasilitas Umum", baseName: "fasum", outName: "fasum.geojson" },
  ];

  for (const { folder, baseName, outName } of sources) {
    const dir = path.join(BASE, "public", folder);
    const geojson = await loadShp(dir, baseName);

    // id bawaan dari .dbf selalu null (shapefile tidak punya primary key) —
    // suntik feature_id yang stabil ("fasum-0", "fasum-1", dst.) supaya bisa
    // dipakai sebagai key React DAN sebagai foreign key pencocokan foto/
    // deskripsi di tabel map_facilities, termasuk untuk nama yang kembar
    // (mis. dua entri "Taman Ceria"/"Taman ceria" tetap punya identitas
    // terpisah).
    geojson.features.forEach((feature, i) => {
      feature.properties.feature_id = `${baseName}-${i}`;
    });

    writeOut(outName, geojson);
  }
}

// ================= DESA SOLIGI (skema mentah beda, dinormalisasi) =================
const SOLIGI_DIR = "Peta Fasilitas Umum dan Bangunan Desa Soligi";

async function convertSoligiBangunan() {
  const dir = path.join(BASE, "public", SOLIGI_DIR);
  const merged = { type: "FeatureCollection", features: [] };

  // dusun1/2/3 = 3 shapefile footprint bangunan terpisah per dusun (hasil
  // deteksi otomatis, kolom aslinya cuma Plus Code + luas + confidence, TIDAK
  // ada nama pemilik/nomor rumah) — digabung jadi satu file, BLOK diisi nama
  // dusun asalnya supaya tetap ada info pengelompokan di popup peta.
  const dusunFiles = ["dusun1", "dusun2", "dusun3"];
  for (const [idx, baseName] of dusunFiles.entries()) {
    const geojson = await loadShp(dir, baseName);
    for (const feature of geojson.features) {
      merged.features.push({
        ...feature,
        properties: {
          feature_id: `bangunan-soligi-${merged.features.length}`,
          Pemilik: "",
          BLOK: `Dusun ${idx + 1}`,
          "No Rumah": null,
        },
      });
    }
  }

  writeOut("bangunan-soligi.geojson", merged);
}

async function convertSoligiFasum() {
  const dir = path.join(BASE, "public", SOLIGI_DIR);
  const merged = { type: "FeatureCollection", features: [] };

  // fasum.shp: nama fasilitas ada di kolom "Ket", TAPI satu baris (SMPN 39)
  // isi Ket-nya kosong dan nama aslinya nyasar ke kolom "Keterangan" — jaga
  // fallback keduanya supaya tidak ada fasilitas tanpa nama di popup.
  const fasumGeojson = await loadShp(dir, "fasum");
  for (const feature of fasumGeojson.features) {
    const name =
      feature.properties.Ket?.trim() ||
      feature.properties.Keterangan?.trim() ||
      "Fasilitas Umum";
    merged.features.push({
      ...feature,
      properties: { feature_id: `fasum-soligi-${merged.features.length}`, "Nama Fasum": name },
    });
  }

  // Menara suar disimpan temannya sebagai shapefile TERPISAH (bukan bagian
  // dari fasum.shp) — digabung ke koleksi fasum yang sama di sini supaya di
  // peta ia tetap satu layer fasum yang sama, bukan layer ke-3 sendirian.
  const menaraGeojson = await loadShp(dir, "menara suar tanjung akelamo");
  for (const feature of menaraGeojson.features) {
    const name = feature.properties.Ket?.trim() || "Menara Suar";
    merged.features.push({
      ...feature,
      properties: { feature_id: `fasum-soligi-${merged.features.length}`, "Nama Fasum": name },
    });
  }

  writeOut("fasum-soligi.geojson", merged);
}

await convertKawasi();
await convertSoligiBangunan();
await convertSoligiFasum();
