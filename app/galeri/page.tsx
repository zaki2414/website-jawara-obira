import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'

export const revalidate = 3600

export default async function GalleryPage() {
  const supabase = await createClient()
  const { data: galleries } = await supabase
    .from('galleries')
    .select('*')
    .order('uploaded_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto">
      <h1 className="font-serif text-3xl font-bold text-ocean-800 mb-2">Galeri Foto Obi</h1>
      <p className="text-gray-600 mb-8">Keindahan alam, budaya, dan keseharian Pulau Obi.</p>
      
      {/* Masonry Grid dengan CSS Columns */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {galleries?.map((item: any) => (
          <div key={item.id} className="break-inside-avoid bg-white rounded-xl overflow-hidden shadow-sm border border-sand-200 group">
            <div className="relative w-full" style={{ paddingBottom: `${(400/600)*100}%` }}>
              <Image
                src={item.image_url}
                alt={item.title || 'Galeri Obi'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            </div>
            <div className="p-4">
              <span className="text-xs font-semibold text-ocean-600 uppercase bg-ocean-50 px-2 py-1 rounded">{item.category}</span>
              {item.title && <p className="font-medium text-gray-800 mt-2">{item.title}</p>}
              {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
            </div>
          </div>
        ))}
      </div>
      
      {(!galleries || galleries.length === 0) && (
        <p className="text-center text-gray-500 py-12">Belum ada foto di galeri.</p>
      )}
    </div>
  )
}