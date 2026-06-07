import { getAllUMKM } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 3600;

export default async function UMKMList({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const { data: umkms } = await getAllUMKM(searchParams.q, searchParams.type);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-ocean-800 mb-2">
          🏪 Direktori UMKM Lokal
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Dokumentasi usaha, warung, dan jasa warga Kawasi & Soligi. Bantu
          kenali ekonomi desa kami.
        </p>
      </div>

      {/* Filter Bar */}
      <form className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-xl shadow-sm border border-sand-200">
        <input
          name="q"
          defaultValue={searchParams.q}
          placeholder="🔍 Cari nama toko/usaha..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
        />
        <select
          name="type"
          defaultValue={searchParams.type || "all"}
          className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 bg-white"
        >
          <option value="all">Semua Jenis Usaha</option>
          <option value="toko">Toko / Warung</option>
          <option value="warung_makan">Warung Makan</option>
          <option value="hasil_laut">Hasil Laut</option>
          <option value="jasa">Jasa</option>
          <option value="kerajinan">Kerajinan</option>
        </select>
        <button
          type="submit"
          className="px-6 py-3 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition"
        >
          Filter
        </button>
      </form>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {umkms?.map((item: any) => (
          <Link
            key={item.id}
            href={`/umkm/${item.slug}`}
            className="group bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden hover:shadow-md transition flex flex-col"
          >
            <div className="relative h-48 bg-sand-100">
              {item.thumbnail_url ? (
                <Image
                  src={item.thumbnail_url}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-4xl bg-sand-100">
                  🏪
                </div>
              )}
              <span className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur text-xs font-semibold rounded-full shadow">
                {item.business_type.replace("_", " ").toUpperCase()}
              </span>
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="font-serif text-xl font-bold text-ocean-800 mb-1">
                {item.name}
              </h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2 flex-1">
                {item.short_description}
              </p>
              {item.location_text && (
                <p className="text-xs text-gray-400 flex items-center gap-1 mb-2">
                  📍 {item.location_text}
                </p>
              )}
              {item.umkm_features?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-auto">
                  {item.umkm_features.slice(0, 3).map((f: any, i: number) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-tropic-50 text-tropic-700 text-xs rounded-md"
                    >
                      ✨ {f.feature}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
      {(!umkms || umkms.length === 0) && (
        <p className="text-center text-gray-500 py-12">
          Belum ada UMKM terdaftar.
        </p>
      )}
    </div>
  );
}
