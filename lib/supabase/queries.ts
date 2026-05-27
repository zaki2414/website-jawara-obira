import { createClient } from './server'

export async function getVillageBySlug(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('villages')
    .select('*, village_statistics(*)')
    .eq('slug', slug)
    .single()
  return { data, error }
}

export async function getAllNews() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news')
    .select('id, title, slug, thumbnail_url, author_name, published_at, villages(name, slug)')
    .order('published_at', { ascending: false })
  return { data, error }
}

export async function getNewsByVillageSlug(desaSlug: string) {
  const supabase = await createClient()
  const { data: village } = await supabase.from('villages').select('id').eq('slug', desaSlug).single()
  if (!village) return { data: [], error: { message: 'Desa tidak ditemukan' } }

  const { data, error } = await supabase
    .from('news')
    .select('id, title, slug, thumbnail_url, author_name, published_at')
    .eq('village_id', village.id)
    .order('published_at', { ascending: false })
  return { data, error }
}

export async function getNewsDetail(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('news')
    .select('*, villages(name, slug)')
    .eq('slug', slug)
    .single()
  return { data, error }
}

export async function getAllCulture() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('culture_articles')
    .select('id, title, slug, thumbnail_url, category, published_at')
    .order('published_at', { ascending: false })
  return { data, error }
}

export async function getCultureDetail(slug: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('culture_articles')
    .select('*, villages(name, slug)') //
    .eq('slug', slug)
    .single()
  return { data, error }
}

export async function getAllUMKM(search?: string, businessType?: string) {
  const supabase = await createClient()
  let query = supabase
    .from('umkm')
    .select('*, villages(name), umkm_features(feature)')
    .order('name')

  if (search) query = query.ilike('name', `%${search}%`)
  if (businessType && businessType !== 'all') query = query.eq('business_type', businessType)

  const { data, error } = await query
  return { data, error }
}

export async function getUMKMBySlug(slug: string) {
  const supabase = await createClient()
  const { data: umkm, error: umkmError } = await supabase
    .from('umkm')
    .select('*, villages(name)')
    .eq('slug', slug)
    .single()
  if (umkmError || !umkm) return { data: null, error: umkmError }

  const [gallery, features, categories, products] = await Promise.all([
    supabase.from('umkm_gallery').select('*').eq('umkm_id', umkm.id).order('sort_order'),
    supabase.from('umkm_features').select('feature').eq('umkm_id', umkm.id),
    
    supabase.from('umkm_category_items')
      .select('cat:umkm_categories(id, name, icon)')
      .eq('umkm_id', umkm.id),
      
    supabase.from('umkm_products')
      .select('item_name, c:umkm_categories(id, name, icon)')
      .eq('umkm_id', umkm.id)
  ])

  return {
    data: {
      ...umkm,
      gallery: gallery.data || [],
      features: features.data?.map((f: any) => f.feature) || [],
      
      categories: categories.data?.map((c: any) => c.cat) || [],
      
      products: products.data?.map((p: any) => ({
        item_name: p.item_name,
        category: p.c
      })) || []
    },
    error: null
  }
}