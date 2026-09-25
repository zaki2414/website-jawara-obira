import { readFile } from "fs/promises";
import path from "path";
import type { FeatureCollection } from "geojson";
import { createClient } from "./server";
import { findBangunanContaining } from "@/lib/geo";
import type { TogaRecipe } from "@/constants/toga";

// ================= TYPES & INTERFACES =================

export interface KKNJournalPayload {
  title: string;
  slug: string;
  cover_image: string;
  activity_date: string;
  content: string;
  village_id: string | null;
  images?: string[];
  image_captions?: string[];
}

export interface KKNProkerPayload {
  title: string;
  slug: string;
  short_description: string;
  full_description?: string;
  impact_metrics?: Record<string, unknown> | string;
  documentation?: string;
  village_id: string | null;
}

export interface KKNTeamMemberPayload {
  name: string;
  cluster: string;
  study_program: string;
  photo_url?: string;
  village_placement: string;
}

export interface TogaPlantPayload {
  name_id: string;
  name_latin: string;
  slug: string;
  description?: string;
  health_benefits?: string[];
  thumbnail_url?: string | null;
  recipes?: TogaRecipe[];
}

export interface FaunaPayload {
  name_local: string;
  name_scientific: string;
  slug: string;
  class?: string;
  order_name?: string;
  family?: string;
  iucn_status?: string;
  conservation_notes?: string;
  habitat?: string;
  diet?: string;
  behavior?: string;
  distribution?: string;
  description?: string;
  physical_characteristics?: string;
  thumbnail_url?: string | null;
  image_source?: string | null;
  documentations?: { url: string; caption: string }[] | null;
}

export interface UMKMPayload {
  name: string;
  slug: string;
  business_type: string;
  village_id: string | null;
  short_description?: string;
  full_description?: string;
  location_text?: string;
  thumbnail_url?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface UMKMGalleryPayload {
  umkm_id: string;
  image_url: string;
  caption?: string | null;
  sort_order: number;
}

export interface UMKMFeaturePayload {
  umkm_id: string;
  feature: string;
}

export interface UMKMProductPayload {
  umkm_id: string;
  category_id: string | null;
  item_name: string;
}

export interface CulturePayload {
  title: string;
  slug: string;
  category: string;
  content: string;
  thumbnail_url?: string | null;
  village_id?: string | null;
  extra_images?: { url: string; caption: string }[];
  published_at?: string;
}

interface GroupedJournal {
  [dateKey: string]: Array<{
    id: string;
    title: string;
    slug: string;
    cover_image: string | null;
    activity_date: string;
    village_id: string | null;
    villages: { name: string } | null;
  }>;
}

// ================= VILLAGE QUERIES =================

// title/long_description/highlight SENGAJA tidak ada di sini — kolom itu
// dulu ada di tipe ini dan di form admin, tapi tidak pernah benar-benar
// dibuat di tabel `villages`. Setiap update selalu gagal (Postgrest menolak
// SELURUH request kalau satu saja kolom di payload tidak dikenal — PGRST204),
// termasuk saat admin cuma ingin ganti thumbnail. Payload sekarang dibatasi
// persis ke kolom yang benar-benar ada.
export interface VillagePayload {
  name: string;
  description?: string | null;
  thumbnail_url?: string | null;
}

export interface VillageStatisticsPayload {
  population?: number | null;
  households?: number | null;
  hamlets?: number | null;
  area_km2?: number | null;
}

// Dipakai admin (list+form) DAN publik (/profil, VillageExplorer.tsx) — sama
// persis, tidak ada beda published/draft untuk desa (cuma 2 baris tetap,
// Kawasi & Soligi), jadi satu fungsi cukup buat keduanya.
export async function getAllVillages() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("villages")
      .select("*, village_statistics(*)")
      .order("slug");
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getVillageById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("villages")
      .select("*, village_statistics(*)")
      .eq("id", id)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// TIDAK ada updateVillage() di sini — pola form admin di proyek ini (lihat
// UMKMForm.tsx/PetaFacilityForm.tsx) selalu menulis lewat browser client
// (lib/supabase/client.ts) langsung dari Client Component, bukan lewat
// queries.ts (yang server-only: pakai cookies() lewat lib/supabase/server.ts
// dan fs/promises, tidak bisa di-bundle ke browser). VillageForm.tsx
// menyimpan dua UPDATE (villages + village_statistics) sendiri di sana.

// ================= CULTURE (BUDAYA) QUERIES =================

export async function getAllCulture() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("culture_articles")
      // `content` ikut diambil supaya katalog bisa menampilkan CUPLIKAN isi
      // (lihat excerptFromHtml di lib/utils.ts). Sebelumnya listing hanya
      // punya judul + kategori, jadi satu-satunya cara pembaca tahu sebuah
      // artikel tentang apa adalah membukanya.
      //
      // Trade-off yang disadari: ini menarik seluruh HTML artikel untuk
      // halaman daftar. Aman selama arsipnya berjumlah puluhan dan halaman
      // ini ter-cache (revalidate 3600). Kalau nanti artikelnya sudah ratusan,
      // pindahkan ke kolom `excerpt` terpisah di tabel — jangan biarkan
      // select ini tumbuh diam-diam.
      .select(
        "id, title, slug, thumbnail_url, category, published_at, content, villages(name)",
      )
      .order("published_at", { ascending: false });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getCultureDetail(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("culture_articles")
      .select("*, villages(name, slug)")
      .eq("slug", slug)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Dipakai halaman admin (edit by id) — sebelumnya app/admin/budaya/[id]/page.tsx
// memanggil createClient() + query manual langsung di page.tsx, melanggar
// aturan "semua query Server Component lewat lib/supabase/queries.ts".
export async function getCultureById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("culture_articles")
      .select("*, villages(name, slug)")
      .eq("id", id)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// ✅ BARU: CRUD Culture
export async function createCulture(payload: CulturePayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("culture_articles")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateCulture(
  id: string,
  payload: Partial<CulturePayload>,
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("culture_articles")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function deleteCulture(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("culture_articles")
      .delete()
      .eq("id", id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ================= UMKM QUERIES =================
// (Dibiarkan sama seperti sebelumnya, akan kita handle nanti)
export async function getAllUMKM(search?: string, businessType?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("umkm")
      .select("*, villages(name), umkm_features(feature)")
      .order("name");
    if (search) query = query.ilike("name", `%${search}%`);
    // ilike, BUKAN eq: nilai business_type di database ditulis admin dengan
    // kapitalisasi bebas ("Produk", "Jasa", "Kuliner") sementara nilai filter
    // yang dikirim UI berbentuk slug huruf kecil. Dengan eq(), 16 dari 17
    // usaha tidak pernah bisa disaring sama sekali. ilike tanpa wildcard =
    // perbandingan penuh yang mengabaikan besar-kecil huruf.
    if (businessType && businessType !== "all")
      query = query.ilike("business_type", businessType);
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Hitungan per jenis usaha (tidak terpengaruh filter q/type) — dipakai legenda
// statistik di UMKMHeader supaya pengguna bisa lihat sebaran taksonomi lengkap.
export async function getUMKMBusinessTypeCounts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("umkm").select("business_type");
    if (error || !data) return { data: null, error };

    // Kunci dinormalkan ke huruf kecil supaya "Jasa" dan "jasa" tidak terhitung
    // sebagai dua jenis usaha berbeda — lihat normalizeBusinessType di
    // constants/umkm.ts soal kenapa nilai di database tidak seragam.
    const counts: Record<string, number> = {};
    for (const row of data) {
      const key = String(row.business_type ?? "").trim().toLowerCase();
      if (!key) continue;
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return { data: counts, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Baca bangunan.geojson/bangunan-soligi.geojson langsung dari disk (BUKAN
// fetch HTTP ke public/) — ini Server Component/query helper yang jalan di
// Node, jadi baca file lebih murah & tidak butuh self-fetch loop ke server
// sendiri. Dipakai sekali per request halaman detail UMKM (revalidate 3600
// di app/umkm/[slug]/page.tsx), jadi tidak perlu di-cache manual di sini.
async function loadBangunanGeoJSON(villageSlug: string): Promise<FeatureCollection | null> {
  const filename = villageSlug === "soligi" ? "bangunan-soligi.geojson" : "bangunan.geojson";
  try {
    const raw = await readFile(path.join(process.cwd(), "public", "data", filename), "utf-8");
    return JSON.parse(raw) as FeatureCollection;
  } catch {
    return null;
  }
}

export async function getUMKMBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data: umkm, error: umkmError } = await supabase
      .from("umkm")
      .select("*, villages(name, slug)")
      .eq("slug", slug)
      .single();
    if (umkmError || !umkm) return { data: null, error: umkmError };

    const [gallery, features, categories, products] = await Promise.all([
      supabase
        .from("umkm_gallery")
        .select("*")
        .eq("umkm_id", umkm.id)
        .order("sort_order"),
      supabase.from("umkm_features").select("feature").eq("umkm_id", umkm.id),
      supabase
        .from("umkm_category_items")
        .select("cat:umkm_categories(id, name, icon)")
        .eq("umkm_id", umkm.id),
      supabase
        .from("umkm_products")
        .select("item_name, c:umkm_categories(id, name, icon)")
        .eq("umkm_id", umkm.id),
    ]);

    // Blok/dusun BUKAN kolom tabel — diturunkan dari titik lat/lng UMKM
    // terhadap poligon bangunan desa yang bersangkutan (point-in-polygon),
    // supaya selalu sinkron dengan peta kadaster tanpa admin isi manual.
    let blok: string | null = null;
    const villageSlug = (umkm.villages as { slug?: string } | null)?.slug;
    if (umkm.latitude != null && umkm.longitude != null && villageSlug) {
      const bangunan = await loadBangunanGeoJSON(villageSlug);
      if (bangunan) {
        const match = findBangunanContaining(
          { lat: umkm.latitude, lng: umkm.longitude },
          bangunan,
        );
        const matchedBlok = (match?.properties as { BLOK?: string } | undefined)?.BLOK?.trim();
        blok = matchedBlok || null;
      }
    }

    return {
      data: {
        ...umkm,
        blok,
        gallery: gallery.data || [],
        features: features.data?.map((f) => f.feature) || [],
        categories: categories.data?.map((c) => c.cat) || [],
        products:
          products.data?.map((p) => ({
            item_name: p.item_name,
            category: p.c,
          })) || [],
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Semua pin UMKM yang punya lokasi Google Maps — dipakai peta kadaster
// /profil (VillageCadastralMap.tsx) untuk mencocokkan UMKM ke poligon
// bangunan via point-in-polygon di sisi client (geojson bangunan sudah
// di-fetch di sana). feature_id TIDAK disimpan di tabel `umkm` sama sekali —
// pencocokan selalu dihitung ulang dari lat/lng supaya tidak ada dua sumber
// kebenaran lokasi yang bisa saling tidak sinkron.
export async function getUMKMMapPins() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("umkm")
      .select("id, slug, name, thumbnail_url, latitude, longitude, villages(slug)")
      .not("latitude", "is", null)
      .not("longitude", "is", null);
    if (error || !data) return { data: null, error };

    const umkmIds = data.map((row) => row.id);
    const { data: galleryRows } = await supabase
      .from("umkm_gallery")
      .select("umkm_id, image_url")
      .in("umkm_id", umkmIds)
      .order("sort_order");

    const firstGalleryByUmkmId = new Map<string, string>();
    for (const row of galleryRows || []) {
      if (!firstGalleryByUmkmId.has(row.umkm_id)) {
        firstGalleryByUmkmId.set(row.umkm_id, row.image_url);
      }
    }

    const pins = data.map((row) => ({
      id: row.id,
      slug: row.slug,
      name: row.name,
      thumbnail_url: row.thumbnail_url,
      latitude: row.latitude as number,
      longitude: row.longitude as number,
      village_slug: (row.villages as { slug?: string } | null)?.slug ?? null,
      extra_photo_url: firstGalleryByUmkmId.get(row.id) ?? null,
    }));

    return { data: pins, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Dipakai admin (app/admin/umkm/[id]/page.tsx) untuk mengisi form edit —
// TANPA filter published (beda dari getUMKMBySlug yang untuk halaman publik),
// mengambil relasi gallery/features/categories/products sekaligus supaya
// page.tsx tidak perlu panggil createClient() langsung (pola sama dengan
// getCultureById).
export async function getUMKMById(id: string) {
  try {
    const supabase = await createClient();
    const { data: umkm, error: umkmError } = await supabase
      .from("umkm")
      .select("*")
      .eq("id", id)
      .single();
    if (umkmError || !umkm) return { data: null, error: umkmError };

    const [gallery, features, categories, products] = await Promise.all([
      supabase.from("umkm_gallery").select("*").eq("umkm_id", id),
      supabase.from("umkm_features").select("feature").eq("umkm_id", id),
      supabase.from("umkm_category_items").select("category_id").eq("umkm_id", id),
      supabase.from("umkm_products").select("item_name, category_id").eq("umkm_id", id),
    ]);

    return {
      data: {
        ...umkm,
        gallery: gallery.data ?? [],
        features: features.data?.map((f) => f.feature) ?? [],
        categories: categories.data ?? [],
        products: products.data ?? [],
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
}

// ================= UMKM CRUD FUNCTIONS =================
// Note: Fungsi ini untuk Server Components saja
// Client Component (UMKMForm.tsx) tetap pakai createClient langsung

export async function createUMKM(payload: UMKMPayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("umkm")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateUMKM(id: string, payload: Partial<UMKMPayload>) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("umkm")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function deleteUMKM(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("umkm").delete().eq("id", id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// Helper functions untuk relasi UMKM
export async function createUMKMGallery(payload: UMKMGalleryPayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("umkm_gallery")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function createUMKMFeature(payload: UMKMFeaturePayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("umkm_features")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function createUMKMProduct(payload: UMKMProductPayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("umkm_products")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// ================= KKN TEAM QUERIES =================
export async function getAllKKNTeamMembers() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_members")
      .select("id, name, cluster, study_program, photo_url, village_placement")
      .order("village_placement", { ascending: true });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getKKNTeamMemberById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_members")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function createKKNTeamMember(payload: KKNTeamMemberPayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_members")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateKKNTeamMember(
  id: string,
  payload: Partial<KKNTeamMemberPayload>,
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_members")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function deleteKKNTeamMember(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("kkn_members").delete().eq("id", id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ================= KKN JOURNAL QUERIES =================
// (Dibiarkan sama seperti sebelumnya)

// Dipakai khusus kalender manajemen admin (app/admin/kkn/jurnal/page.tsx) —
// ambil SEMUA jurnal tanpa filter bulan, supaya navigasi kalender bisa
// pindah ke bulan mana pun secara instan di client tanpa fetch ulang.
export async function getAllKKNJournalsForAdmin() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_journals")
      .select("id, title, slug, cover_image, activity_date, village_id, villages(name)")
      .order("activity_date", { ascending: true });
    if (error || !data) return { data: null, error };

    // Supabase kadang mengembalikan relasi villages(name) sebagai array,
    // kadang sebagai objek tunggal, tergantung inferensi FK — dinormalisasi
    // di sini (sama seperti getKKNJournalsByMonth) supaya konsumen di client
    // selalu menerima bentuk yang konsisten: { name: string } | null.
    const normalized = data.map((journal) => {
      let villageData: { name: string } | null = null;
      if (journal.villages) {
        if (Array.isArray(journal.villages) && journal.villages.length > 0) {
          villageData = { name: String(journal.villages[0].name) };
        } else if (!Array.isArray(journal.villages)) {
          villageData = { name: String((journal.villages as { name: string }).name) };
        }
      }
      return { ...journal, villages: villageData };
    });

    return { data: normalized, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Ketiga query jurnal publik di bawah menyaring `published` SECARA EKSPLISIT
// meski RLS sudah menahan draft dari pengunjung anonim. Alasannya: klien
// Supabase di Server Component membawa sesi pemakai, jadi ketika ADMIN yang
// sedang login membuka halaman publik, RLS meloloskan draft miliknya dan
// kalender publik jadi menampilkan entri yang pengunjung lain tidak lihat —
// dan mengkliknya berujung notFound(), karena getKKNJournalBySlug memang
// menyaring `published`. Filter ini menyamakan ketiganya.
export async function getKKNJournalsByMonth(
  year: number,
  month: number,
  villageId?: string,
) {
  try {
    const supabase = await createClient();
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    // Tanggal terakhir bulan ini dirakit SEBAGAI STRING, jangan lewat
    // toISOString().
    //
    // `new Date(year, month, 0)` menghasilkan tengah malam WAKTU LOKAL di hari
    // terakhir bulan itu. `.toISOString()` lalu mengubahnya ke UTC — dan di
    // zona waktu mana pun yang di DEPAN UTC (Asia/Jakarta UTC+7, misalnya) itu
    // mundur ke tanggal sebelumnya. Efeknya: `lte("activity_date", …)` memakai
    // tanggal 29 untuk bulan Juni, dan HARI TERAKHIR SETIAP BULAN hilang dari
    // kalender tanpa error apa pun. Lebih jahat lagi, ini bergantung zona waktu
    // mesin: benar di server Vercel (UTC), salah di laptop developer Indonesia.
    //
    // `.getDate()` aman dipakai karena yang diambil cuma ANGKA harinya.
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    let query = supabase
      .from("kkn_journals")
      .select(
        "id, title, slug, cover_image, activity_date, village_id, villages(name)",
      )
      .eq("published", true)
      .gte("activity_date", startDate)
      .lte("activity_date", endDate)
      .order("activity_date", { ascending: true });

    if (villageId)
      query = query.or(`village_id.eq.${villageId},village_id.is.null`);

    const { data, error } = await query;
    const grouped =
      data?.reduce<GroupedJournal>((acc, curr) => {
        const dateKey = curr.activity_date;
        if (!acc[dateKey]) acc[dateKey] = [];
        
        let villageData: { name: string } | null = null;
        
        if (curr.villages) {
          if (Array.isArray(curr.villages) && curr.villages.length > 0) {
            villageData = { name: String(curr.villages[0].name) };
          } else if (!Array.isArray(curr.villages)) {
            villageData = {
              name: String((curr.villages as { name: string }).name),
            };
          }
        }
        
        acc[dateKey].push({
          id: String(curr.id),
          title: String(curr.title),
          slug: String(curr.slug),
          cover_image: curr.cover_image ? String(curr.cover_image) : null,
          activity_date: String(curr.activity_date),
          village_id: curr.village_id ? String(curr.village_id) : null,
          villages: villageData,
        });
        return acc;
      }, {}) ?? {};
    return { data: grouped, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getKKNJournalBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data: journal, error: journalError } = await supabase
      .from("kkn_journals")
      .select(
        "id, title, slug, content, cover_image, activity_date, village_id, published",
      )
      .eq("slug", slug)
      .eq("published", true)
      .maybeSingle();
    if (journalError) return { data: null, error: journalError };
    if (!journal)
      return {
        data: null,
        error: { message: "Journal not found or not published" },
      };

    const [villageRes, imagesRes] = await Promise.all([
      supabase
        .from("villages")
        .select("name")
        .eq("id", journal.village_id)
        .maybeSingle(),
      supabase
        .from("kkn_journal_images")
        .select("image_url, caption")
        .eq("journal_id", journal.id)
        .order("id"),
    ]);
    return {
      data: {
        ...journal,
        villages: villageRes.data,
        images: imagesRes.data || [],
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getKKNJournalById(id: string) {
  try {
    const supabase = await createClient();
    const { data: journal, error: journalError } = await supabase
      .from("kkn_journals")
      .select("*, villages(name)")
      .eq("id", id)
      .single();
    if (journalError || !journal) return { data: null, error: journalError };
    const { data: images } = await supabase
      .from("kkn_journal_images")
      .select("image_url, caption")
      .eq("journal_id", journal.id)
      .order("id");
    return { data: { ...journal, images: images || [] }, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getPreviousJournal(
  currentDate: string,
  villageId?: string,
) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("kkn_journals")
      .select("id, title, slug, activity_date")
      .lt("activity_date", currentDate)
      .order("activity_date", { ascending: false })
      .limit(1);
    if (villageId) query = query.eq("village_id", villageId);
    const { data, error } = await query;
    return { data: data?.[0] || null, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getNextJournal(currentDate: string, villageId?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("kkn_journals")
      .select("id, title, slug, activity_date")
      .gt("activity_date", currentDate)
      .order("activity_date", { ascending: true })
      .limit(1);
    if (villageId) query = query.eq("village_id", villageId);
    const { data, error } = await query;
    return { data: data?.[0] || null, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function createKKNJournal(payload: KKNJournalPayload) {
  try {
    const supabase = await createClient();
    const { data: journal, error: jError } = await supabase
      .from("kkn_journals")
      .insert({
        title: payload.title,
        slug: payload.slug,
        cover_image: payload.cover_image,
        activity_date: payload.activity_date,
        content: payload.content,
        village_id: payload.village_id,
      })
      .select()
      .single();
    if (jError || !journal) return { data: null, error: jError };
    if (payload.images?.length) {
      const imgPayload = payload.images.map((url: string, i: number) => ({
        journal_id: journal.id,
        image_url: url,
        caption: payload.image_captions?.[i] || "",
      }));
      await supabase.from("kkn_journal_images").insert(imgPayload);
    }
    return { data: journal, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateKKNJournal(
  id: string,
  payload: Partial<KKNJournalPayload>,
  images?: { url: string; caption: string }[],
) {
  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("kkn_journals")
      .update({
        title: payload.title,
        slug: payload.slug,
        cover_image: payload.cover_image,
        activity_date: payload.activity_date,
        content: payload.content,
        village_id: payload.village_id,
      })
      .eq("id", id);
    if (error) return { error };
    if (images) {
      await supabase.from("kkn_journal_images").delete().eq("journal_id", id);
      const imgPayload = images
        .filter((img) => img.url)
        .map((img) => ({
          journal_id: id,
          image_url: img.url,
          caption: img.caption || "",
        }));
      if (imgPayload.length)
        await supabase.from("kkn_journal_images").insert(imgPayload);
    }
    return { error: null };
  } catch (err) {
    return { error: err };
  }
}

export async function deleteKKNJournal(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("kkn_journals").delete().eq("id", id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ================= KKN PROKER QUERIES =================
// (Dibiarkan sama seperti sebelumnya)
export async function getAllKKNProkers(villageSlug?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("kkn_prokers")
      .select(
        "id, title, slug, short_description, image_url, impact_metrics, documentation, village_id, villages(name, slug)",
      )
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (villageSlug) {
      const { data: village } = await supabase
        .from("villages")
        .select("id")
        .eq("slug", villageSlug)
        .single();
      if (village?.id)
        query = query.or(`village_id.eq.${village.id},village_id.is.null`);
    }
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Dipakai halaman admin (list semua entry termasuk draft) — getAllKKNProkers
// di atas khusus halaman publik dan sengaja hanya menampilkan yang published.
export async function getAllKKNProkersAdmin() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_prokers")
      .select(
        "id, title, slug, image_url, short_description, village_id, villages(name, slug)",
      )
      .order("created_at", { ascending: false });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getKKNProkerBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_prokers")
      .select("*, villages(name, slug)")
      .eq("slug", slug)
      .eq("published", true)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Dipakai halaman admin (edit by id, tanpa filter published supaya draft tetap
// bisa dibuka) — getKKNProkerBySlug di atas khusus untuk halaman publik.
export async function getKKNProkerById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_prokers")
      .select("*, villages(name, slug)")
      .eq("id", id)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function createKKNProker(payload: KKNProkerPayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_prokers")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateKKNProker(
  id: string,
  payload: Partial<KKNProkerPayload>,
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_prokers")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function deleteKKNProker(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("kkn_prokers").delete().eq("id", id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ================= TOGA PLANTS QUERIES =================
export async function getAllTogaPlants(search?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("toga_plants")
      .select("*")
      .order("name_id", { ascending: true });
    if (search) query = query.or(`name_id.ilike.%${search}%,name_latin.ilike.%${search}%`);
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getTogaTotalCount() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("toga_plants")
      .select("id", { count: "exact", head: true });
    return { count: count ?? 0, error };
  } catch (err) {
    return { count: 0, error: err };
  }
}

export async function getTogaPlantBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("toga_plants")
      .select("*")
      .eq("slug", slug)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getTogaPlantById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("toga_plants")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function createTogaPlant(payload: TogaPlantPayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("toga_plants")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateTogaPlant(
  id: string,
  payload: Partial<TogaPlantPayload>,
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("toga_plants")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function deleteTogaPlant(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("toga_plants").delete().eq("id", id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ================= FAUNA OBI QUERIES =================
export async function getAllFauna(search?: string, faunaClass?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("fauna_obi")
      .select("*")
      .order("name_local", { ascending: true });
    if (search) query = query.or(`name_local.ilike.%${search}%,name_scientific.ilike.%${search}%`);
    if (faunaClass && faunaClass !== "all") query = query.eq("class", faunaClass);
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Total spesimen (tidak terpengaruh filter search/class) — dipakai widget counter
// di hero list page supaya angkanya tetap bermakna saat user sedang memfilter.
export async function getFaunaTotalCount() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("fauna_obi")
      .select("id", { count: "exact", head: true });
    return { count: count ?? 0, error };
  } catch (err) {
    return { count: 0, error: err };
  }
}

export async function getFaunaBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("fauna_obi")
      .select("*")
      .eq("slug", slug)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getFaunaById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("fauna_obi")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function createFauna(payload: FaunaPayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("fauna_obi")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateFauna(id: string, payload: Partial<FaunaPayload>) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("fauna_obi")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function deleteFauna(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("fauna_obi").delete().eq("id", id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ================= ADMIN DASHBOARD QUERIES =================
// Dipakai khusus app/admin/page.tsx untuk kartu statistik ringkas.
export async function getAdminDashboardStats() {
  try {
    const supabase = await createClient();
    const [culture, gallery, umkm] = await Promise.all([
      supabase.from("culture_articles").select("id", { count: "exact", head: true }),
      supabase.from("galleries").select("id", { count: "exact", head: true }),
      supabase.from("umkm").select("id", { count: "exact", head: true }),
    ]);
    return {
      data: {
        culture: culture.count ?? 0,
        gallery: gallery.count ?? 0,
        umkm: umkm.count ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Dipakai khusus app/admin/kkn/page.tsx untuk kartu statistik ringkas KKN hub.
// Jurnal terbaru lintas bulan — dipakai landing page /kkn. Sengaja TERPISAH
// dari getKKNJournalsByMonth: fungsi itu dibangun untuk tampilan kalender
// (dikelompokkan per tanggal, dibatasi satu bulan), jadi memakainya di sini
// akan menampilkan "kosong" setiap kali bulan berjalan kebetulan belum ada
// entri — padahal yang diminta halaman ini adalah entri TERAKHIR, kapan pun
// itu ditulis.
export async function getLatestKKNJournals(limit = 3) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_journals")
      .select("id, title, slug, cover_image, activity_date, villages(name)")
      .eq("published", true)
      .order("activity_date", { ascending: false })
      .limit(limit);
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

/**
 * Sebaran jurnal per bulan sepanjang masa KKN.
 *
 * Hanya menarik kolom `activity_date` (bukan seluruh baris) karena yang
 * dibutuhkan cuma tanggalnya untuk dihitung — payload-nya jadi sangat kecil
 * meski entrinya nanti bertambah banyak.
 */
export async function getKKNJournalMonthCounts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("kkn_journals")
      .select("activity_date")
      .eq("published", true)
      .order("activity_date", { ascending: true });
    if (error || !data) return { data: null, error };

    const counts: Record<string, number> = {};
    for (const row of data) {
      const date = String(row.activity_date ?? "");
      if (date.length < 7) continue;
      const key = date.slice(0, 7); // "YYYY-MM"
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return { data: counts, error: null };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getKKNHubStats() {
  try {
    const supabase = await createClient();
    const [journals, prokers, members] = await Promise.all([
      supabase.from("kkn_journals").select("id", { count: "exact", head: true }),
      supabase.from("kkn_prokers").select("id", { count: "exact", head: true }),
      supabase.from("kkn_members").select("id", { count: "exact", head: true }),
    ]);
    return {
      data: {
        journals: journals.count ?? 0,
        prokers: prokers.count ?? 0,
        members: members.count ?? 0,
      },
      error: null,
    };
  } catch (err) {
    return { data: null, error: err };
  }
}

// ================= HOME PAGE QUERIES =================
// Dipanggil dari app/page.tsx (Server Component) — menggantikan
// hooks/useHomePageData.ts yang lama fetch client-side lewat useEffect
// (kehilangan caching/SSR, lihat CLAUDE.md §1.1/§1.3). Tiap fungsi tetap
// satu concern (pola sama dengan getUMKMBusinessTypeCounts/getKKNHubStats),
// digabung lewat Promise.all di page-nya, bukan satu mega-fungsi.

export async function getUMKMCount() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("umkm")
      .select("id", { count: "exact", head: true });
    return { count: count ?? 0, error };
  } catch (err) {
    return { count: 0, error: err };
  }
}

export async function getPublishedKKNJournalCount() {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from("kkn_journals")
      .select("id", { count: "exact", head: true })
      .eq("published", true);
    return { count: count ?? 0, error };
  } catch (err) {
    return { count: 0, error: err };
  }
}

// count di sini TIDAK terpengaruh .limit() (PostgREST menghitung total baris
// yang cocok terlepas dari limit/range) — jadi satu query ini sekaligus
// menjawab "berapa total proker published" (dipakai badge KKNSection) DAN
// "3 proker terbaru" (featuredProkers), tanpa perlu 2 round-trip terpisah
// seperti hooks/useHomePageData.ts yang lama.
export async function getFeaturedKKNProkers(limit = 3) {
  const columns =
    "id, title, slug, short_description, image_url, impact_metrics, documentation";
  try {
    const supabase = await createClient();

    // `featured` dulu supaya proker yang dicentang admin (form
    // /admin/kkn/proker) selalu naik ke beranda /kkn. created_at tetap jadi
    // pengurut kedua untuk mengisi sisa kuota — 22 dari 23 baris punya
    // created_at identik dari satu kali insert massal, jadi kalau
    // mengandalkan itu saja urutannya ditentukan Postgres, bukan admin.
    const withFeatured = await supabase
      .from("kkn_prokers")
      .select(columns, { count: "exact" })
      .eq("published", true)
      .order("featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    // 42703 = kolom tidak ada, artinya scripts/add-kkn-proker-featured.sql
    // belum dijalankan di database ini. Jangan biarkan seksi Program Kerja di
    // beranda /kkn ikut kosong gara-gara migrasi yang belum jalan: ulangi
    // query tanpa pengurut `featured` (persis perilaku lama).
    if (
      withFeatured.error &&
      (withFeatured.error as { code?: string }).code === "42703"
    ) {
      const { data, count, error } = await supabase
        .from("kkn_prokers")
        .select(columns, { count: "exact" })
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      return { data, count: count ?? 0, error };
    }

    return {
      data: withFeatured.data,
      count: withFeatured.count ?? 0,
      error: withFeatured.error,
    };
  } catch (err) {
    return { data: null, count: 0, error: err };
  }
}

// ================= SITEMAP =================
// Ambil slug + tanggal untuk app/sitemap.ts. SENGAJA tidak memakai getAllX()
// yang sudah ada: fungsi-fungsi itu menarik kolom berat (HTML artikel penuh,
// galeri, relasi) yang tidak dipakai sitemap sama sekali. Di sini cukup dua
// kolom per baris.
export type SitemapEntry = { slug: string; lastModified: string | null };

async function slugRows(
  table: string,
  dateColumn: "updated_at" | "created_at",
  publishedOnly: boolean,
): Promise<SitemapEntry[]> {
  try {
    const supabase = await createClient();
    let query = supabase.from(table).select(`slug, ${dateColumn}`);
    if (publishedOnly) query = query.eq("published", true);
    const { data, error } = await query;
    if (error || !data) return [];
    return (data as Record<string, unknown>[])
      .filter((row): row is Record<string, unknown> => typeof row.slug === "string" && !!row.slug)
      .map((row) => ({
        slug: row.slug as string,
        lastModified: (row[dateColumn] as string | null) ?? null,
      }));
  } catch {
    return [];
  }
}

export async function getSitemapEntries() {
  // Kolom tanggalnya berbeda-beda per tabel (sebagian tidak punya updated_at),
  // dan hanya kkn_* yang punya konsep published — dicek langsung ke skema,
  // bukan diasumsikan seragam.
  const [budaya, umkm, toga, fauna, proker, jurnal] = await Promise.all([
    slugRows("culture_articles", "created_at", false),
    slugRows("umkm", "created_at", false),
    slugRows("toga_plants", "updated_at", false),
    slugRows("fauna_obi", "updated_at", false),
    slugRows("kkn_prokers", "updated_at", true),
    slugRows("kkn_journals", "created_at", true),
  ]);
  return { budaya, umkm, toga, fauna, proker, jurnal };
}

// ================= GALLERY QUERIES =================
export async function getAllGalleries() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("galleries")
      .select("*")
      .order("uploaded_at", { ascending: false });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// ================= MAP FACILITIES QUERIES =================
// Tabel map_facilities menyimpan deskripsi + foto 14 fasilitas umum dari
// public/data/fasum.geojson (feature_id sebagai kunci pencocokan ke
// geometri) — TIDAK ada konsep published/draft, satu fungsi ini dipakai
// untuk halaman publik (/profil) MAUPUN admin (/admin/peta), sama seperti
// pola getAllGalleries()/getAllUMKM().
export async function getMapFacilities() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("map_facilities")
      .select("*")
      .order("name");
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getMapFacilityById(id: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("map_facilities")
      .select("*")
      .eq("id", id)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// Baris map_facilities sudah di-seed tetap (1 baris per fitur fasum) —
// admin hanya UPDATE (deskripsi + foto), tidak ada create/delete supaya
// tidak ada baris yang lepas dari feature_id manapun di geojson.
export async function updateMapFacility(
  id: string,
  payload: { name: string; description: string | null; photo_url: string | null },
) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("map_facilities")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// ================= MAP BUILDINGS QUERIES =================
// Tabel map_buildings menyimpan override BLOK/No Rumah untuk poligon rumah
// warga di public/data/bangunan*.geojson (feature_id sebagai kunci
// pencocokan) — lihat scripts/create-map-buildings-table.sql. BEDA dari
// map_facilities: TIDAK pre-seeded (264+ rumah per desa, kebanyakan tidak
// pernah diedit), jadi diambil sekaligus lalu di-merge client-side oleh
// VillageCadastralMap.tsx, bukan di-query per-fitur.
export async function getMapBuildingOverrides() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("map_buildings").select("*");
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}
