import { getVillageBySlug } from '@/lib/supabase/queries'
import { notFound } from 'next/navigation'

export const revalidate = 3600

export default async function VillageProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: village, error } = await getVillageBySlug(slug)
  
  if (error || !village) return notFound()

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="border-b border-sand-200 pb-6">
        <h1 className="font-serif text-4xl font-bold text-ocean-800">{village.name}</h1>
        <p className="mt-2 text-gray-600 text-lg">{village.description}</p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="bg-white p-6 rounded-xl shadow-sm border border-sand-200">
          <h2 className="font-serif text-2xl text-ocean-700 mb-4">Sejarah</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{village.history || 'Belum tersedia.'}</p>
        </section>
        <section className="bg-white p-6 rounded-xl shadow-sm border border-sand-200">
          <h2 className="font-serif text-2xl text-ocean-700 mb-4">Visi & Misi</h2>
          <h3 className="font-semibold text-gray-800 mb-1">Visi:</h3>
          <p className="text-gray-700 mb-4">{village.vision || '-'}</p>
          <h3 className="font-semibold text-gray-800 mb-1">Misi:</h3>
          <p className="text-gray-700 whitespace-pre-line">{village.mission || '-'}</p>
        </section>
      </div>

      {village.village_statistics && (
        <section className="bg-tropic-50 p-6 rounded-xl border border-tropic-200">
          <h2 className="font-serif text-2xl text-tropic-700 mb-4">Statistik Desa</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <StatCard value={village.village_statistics.population} label="Jiwa" />
            <StatCard value={village.village_statistics.households} label="KK" />
            <StatCard value={village.village_statistics.hamlets} label="Dusun" />
            <StatCard value={village.village_statistics.area_km2} label="Luas (km²)" />
          </div>
        </section>
      )}
    </div>
  )
}

function StatCard({ value, label }: { value: number | null; label: string }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-2xl font-bold text-ocean-700">{value ?? 0}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}