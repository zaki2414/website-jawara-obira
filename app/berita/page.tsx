import { getAllNews } from '@/lib/supabase/queries'
import Link from 'next/link'
import Image from 'next/image'

export const revalidate = 3600

export default async function NewsFeed() {
  const { data: news } = await getAllNews()

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-serif text-3xl font-bold text-ocean-800 mb-8">Berita Terkini</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news?.map((item: any) => (
          <Link key={item.id} href={`/berita/${item.villages?.slug || 'kawasi'}/${item.slug}`} className="group block bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden hover:shadow-md transition">
            <div className="relative h-40 bg-sand-100">
              {item.thumbnail_url ? (
                <Image src={item.thumbnail_url} alt={item.title} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl">📰</div>
              )}
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold text-tropic-600 uppercase bg-tropic-50 px-2 py-1 rounded">{item.villages?.name}</span>
              <h2 className="font-serif text-lg font-bold text-ocean-800 mt-2 group-hover:text-ocean-600 line-clamp-2">{item.title}</h2>
              <p className="text-sm text-gray-500 mt-2">{formatDate(item.published_at)}</p>
            </div>
          </Link>
        ))}
      </div>
      {(!news || news.length === 0) && <p className="text-center text-gray-500 py-12">Belum ada berita.</p>}
    </div>
  )
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}