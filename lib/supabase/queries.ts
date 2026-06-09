import { createClient } from "./server";

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
  recipes?: any[];
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

export interface NewsPayload {
  title: string;
  slug: string;
  content: string;
  thumbnail_url?: string | null;
  author_name?: string;
  village_id: string | null;
  extra_images?: { url: string; caption: string }[];
  published_at?: string;
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

export async function getVillageBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("villages")
      .select("*, village_statistics(*)")
      .eq("slug", slug)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// ================= NEWS (BERITA) QUERIES =================

export async function getAllNews() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select(
        "id, title, slug, thumbnail_url, author_name, published_at, villages(name, slug)",
      )
      .order("published_at", { ascending: false });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getNewsByVillageSlug(desaSlug: string) {
  try {
    const supabase = await createClient();
    const { data: village } = await supabase
      .from("villages")
      .select("id")
      .eq("slug", desaSlug)
      .single();
    if (!village)
      return { data: [], error: { message: "Desa tidak ditemukan" } };

    const { data, error } = await supabase
      .from("news")
      .select("id, title, slug, thumbnail_url, author_name, published_at")
      .eq("village_id", village.id)
      .order("published_at", { ascending: false });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getNewsDetail(slug: string) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .select("*, villages(name, slug)")
      .eq("slug", slug)
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

// ✅ BARU: CRUD News
export async function createNews(payload: NewsPayload) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .insert(payload)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function updateNews(id: string, payload: Partial<NewsPayload>) {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("news")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function deleteNews(id: string) {
  try {
    const supabase = await createClient();
    const { error } = await supabase.from("news").delete().eq("id", id);
    return { error };
  } catch (err) {
    return { error: err };
  }
}

// ================= CULTURE (BUDAYA) QUERIES =================

export async function getAllCulture() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("culture_articles")
      .select("id, title, slug, thumbnail_url, category, published_at")
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
    if (businessType && businessType !== "all")
      query = query.eq("business_type", businessType);
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
  }
}

export async function getUMKMBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data: umkm, error: umkmError } = await supabase
      .from("umkm")
      .select("*, villages(name)")
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

    return {
      data: {
        ...umkm,
        gallery: gallery.data || [],
        features: features.data?.map((f: any) => f.feature) || [],
        categories: categories.data?.map((c: any) => c.cat) || [],
        products:
          products.data?.map((p: any) => ({
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
export async function getKKNJournalsByMonth(
  year: number,
  month: number,
  villageId?: string,
) {
  try {
    const supabase = await createClient();
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];
    let query = supabase
      .from("kkn_journals")
      .select(
        "id, title, slug, cover_image, activity_date, village_id, villages(name)",
      )
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
// (Dibiarkan sama seperti sebelumnya)
export async function getAllTogaPlants(category?: string) {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("toga_plants")
      .select("*")
      .order("name_id", { ascending: true });
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
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
// (Dibiarkan sama seperti sebelumnya)
export async function getAllFauna() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("fauna_obi")
      .select("*")
      .order("name_local", { ascending: true });
    return { data, error };
  } catch (err) {
    return { data: null, error: err };
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
