import { getAllCulture } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 3600;

export default async function CultureCatalog() {
  const { data: culture } = await getAllCulture();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="font-serif text-3xl font-bold text-ocean-800 mb-2">
        Katalog Budaya Obi
      </h1>
      <p className="text-gray-600 mb-8">
        Warisan tradisi, kuliner, dan kearifan lokal Pulau Obi.
      </p>

      {/* Grid Grid Artikel Budaya */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {culture?.map((item: any) => (
          <Link
            key={item.id}
            href={`/budaya/${item.slug}`}
            className="group block bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden hover:shadow-md transition"
          >
            {/* Bagian Gambar / Thumbnail */}
            <div className="relative h-44 bg-sand-100">
              {item.thumbnail_url ? (
                <Image
                  src={item.thumbnail_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl bg-sand-100">
                  🎭
                </div>
              )}
            </div>

            {/* Bagian Teks Info */}
            <div className="p-4">
              <span className="text-xs font-semibold text-ocean-600 uppercase bg-ocean-50 px-2 py-1 rounded">
                {item.category}
              </span>
              <h2 className="font-serif text-lg font-bold text-ocean-800 mt-2 group-hover:text-ocean-600 line-clamp-2">
                {item.title}
              </h2>
            </div>
          </Link>
        ))}
      </div>

      {/* State Jika Data Kosong */}
      {(!culture || culture.length === 0) && (
        <p className="text-center text-gray-500 py-12">
          Belum ada dokumentasi budaya.
        </p>
      )}
    </div>
  );
}
