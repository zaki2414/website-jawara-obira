// app/umkm/page.tsx
import { getAllUMKM } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import { Store, Search, MapPin, Sparkles, Filter } from "lucide-react";

export const revalidate = 3600;

interface UMKMItem {
  id: string;
  slug: string;
  name: string;
  thumbnail_url?: string;
  business_type: string;
  short_description?: string;
  location_text?: string;
  umkm_features?: { feature: string }[];
}

export default async function UMKMList({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; type?: string }>;
}) {
  const { q, type } = await searchParams;
  const { data: umkms } = await getAllUMKM(q, type);

  return (
    <section className="bg-natural-paper py-16 px-6 border-b-4 border-on-surface min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Seksi */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary text-on-primary px-4 py-1.5 font-bold text-sm uppercase tracking-wider mb-4 hard-shadow-sm border border-on-surface">
            <Store className="w-4 h-4" /> Niaga Desa
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface mb-3">
            Direktori UMKM Lokal
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl mx-auto">
            Dokumentasi kolektif usaha mandiri, warung kelontong, dan penyedia jasa warga Kawasi & Soligi. Mari dukung roda ekonomi sirkular pulau kita.
          </p>
        </div>

        {/* Panel Kontrol Filter Pencarian */}
        <form className="flex flex-col md:flex-row gap-4 mb-12 bg-background p-5 border-2 border-on-surface rounded-xl hard-shadow-sm">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              name="q"
              defaultValue={q}
              placeholder="Cari nama toko, produk, atau jasa..."
              className="w-full pl-12 pr-4 py-3.5 border-2 border-on-surface rounded-lg bg-surface font-medium text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:bg-background transition-colors"
            />
          </div>
          
          <select
            name="type"
            defaultValue={type || "all"}
            className="p-3.5 border-2 border-on-surface rounded-lg bg-surface font-bold text-on-surface cursor-pointer focus:outline-none"
          >
            <option value="all">📁 Semua Jenis Usaha</option>
            <option value="toko">🏪 Toko / Warung Kelontong</option>
            <option value="warung_makan">🍲 Warung Makan & Kedai</option>
            <option value="hasil_laut">🐟 Komoditas Hasil Laut</option>
            <option value="jasa">🛠️ Layanan Jasa / Montir</option>
            <option value="kerajinan">🎨 Kerajinan & Olah Tangan</option>
          </select>

          <button
            type="submit"
            className="px-8 py-3.5 bg-primary text-on-primary font-bold rounded-lg border-2 border-on-surface hard-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Filter className="w-4 h-4" /> Saring
          </button>
        </form>

        {/* Grid Etalase Kartu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {umkms?.map((item: UMKMItem) => (
            <Link
              key={item.id}
              href={`/umkm/${item.slug}`}
              className="group bg-background border-2 border-on-surface rounded-xl overflow-hidden hard-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col"
            >
              {/* Cover Gambar */}
              <div className="relative h-48 bg-surface-container-high border-b-2 border-on-surface">
                {item.thumbnail_url ? (
                  <Image
                    src={item.thumbnail_url}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-on-surface-variant/30">
                    <Store className="w-12 h-12" />
                  </div>
                )}
                <span className="absolute top-4 right-4 px-2.5 py-1 bg-background border border-on-surface text-[10px] font-black uppercase tracking-widest rounded-md shadow-sm">
                  {item.business_type.replace("_", " ")}
                </span>
              </div>

              {/* Deskripsi Teks Kardus */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-on-surface group-hover:text-primary transition-colors leading-tight mb-2">
                    {item.name}
                  </h3>
                  <p className="text-sm text-on-surface-variant line-clamp-2 leading-relaxed">
                    {item.short_description}
                  </p>
                </div>

                <div className="space-y-3 pt-3 border-t border-dashed border-outline-variant mt-auto">
                  {item.location_text && (
                    <p className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-primary shrink-0" /> {item.location_text}
                    </p>
                  )}
                  
                  {item.umkm_features && item.umkm_features.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.umkm_features.slice(0, 2).map((f, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 px-2 py-0.5 bg-tropic-50 border border-tropic-200 text-tropic-700 text-[11px] font-medium rounded"
                        >
                          <Sparkles className="w-3 h-3 text-tropic-500" /> {f.feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!umkms || umkms.length === 0) && (
          <div className="text-center bg-background border-2 border-dashed border-outline rounded-xl py-20 max-w-lg mx-auto hard-shadow-sm">
            <Store className="w-12 h-12 mx-auto text-on-surface-variant opacity-30 mb-4" />
            <p className="font-serif text-xl font-bold text-on-surface mb-1">Entitas Usaha Tidak Ditemukan</p>
            <p className="text-sm text-on-surface-variant px-4">Kata kunci atau filter pencarian tidak cocok dengan basis data mitra wirausaha desa.</p>
          </div>
        )}
        
      </div>
    </section>
  );
}