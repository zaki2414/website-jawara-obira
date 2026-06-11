// app/budaya/page.tsx
import { getAllCulture } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export const revalidate = 3600;

interface CultureItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  thumbnail_url?: string;
  published_at?: string;
  villages?: {
    name: string;
  };
}

export default async function CultureCatalog() {
  const { data: culture } = await getAllCulture();

  return (
    <section className="bg-natural-paper py-16 px-6 border-b-4 border-on-surface min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block bg-tertiary text-on-tertiary px-4 py-1.5 font-semibold text-sm uppercase tracking-wider mb-4 hard-shadow-sm">
            Khazanah Lokal
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface mb-2">
            Katalog Budaya Obi
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Arsip dokumentasi warisan tradisi, ritus adat, kuliner khas, dan kearifan lokal masyarakat Pulau Obi.
          </p>
        </div>

        {/* Grid Katalog */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {culture?.map((item: CultureItem) => (
            <Link
              key={item.id}
              href={`/budaya/${item.slug}`}
              className="group block bg-background border-2 border-on-surface rounded-xl overflow-hidden hard-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              {/* Thumbnail / Gambar Banner */}
              <div className="relative h-48 bg-surface-container-high border-b-2 border-on-surface">
                {item.thumbnail_url ? (
                  <Image
                    src={item.thumbnail_url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-on-surface/30">
                    <Sparkles className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Info Detail Singkat */}
              <div className="p-6 space-y-3">
                <span className="inline-block px-2.5 py-1 bg-surface-container border border-outline-variant text-xs font-bold uppercase tracking-wider rounded-md text-on-surface-variant">
                  {item.category}
                </span>
                
                <h2 className="font-serif text-xl font-bold text-on-surface leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!culture || culture.length === 0) && (
          <div className="text-center bg-background border-2 border-dashed border-outline rounded-xl py-16 hard-shadow-sm">
            <Sparkles className="w-12 h-12 mx-auto text-on-surface-variant opacity-40 mb-3" />
            <p className="font-serif text-lg text-on-surface-variant font-medium">Belum ada dokumentasi budaya yang diunggah.</p>
          </div>
        )}
      </div>
    </section>
  );
}