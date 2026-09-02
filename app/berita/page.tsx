// app/berita/page.tsx
import { getAllNews } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Newspaper } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { BeritaPageBackground } from "@/components/berita/BeritaPageBackground";

export const revalidate = 3600;

interface NewsItem {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  thumbnail_url?: string;
  villages?: {
    name: string;
    slug: string;
  };
}

export default async function NewsFeed() {
  const { data: news } = await getAllNews();

  return (
    <section className="relative bg-natural-paper py-16 px-6 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <BeritaPageBackground />

      <div className="relative max-w-6xl mx-auto z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="inline-block bg-primary text-on-primary px-4 py-1.5 font-semibold text-sm uppercase tracking-wider mb-4 hard-shadow-sm">
            Warta Obira
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface">
            Berita Terkini
          </h1>
        </div>

        {/* Grid Kliping Berita */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* getAllNews() tidak pakai generated Supabase types, jadi relasi villages()
              disimpulkan sebagai array meski secara runtime selalu objek tunggal. */}
          {(news as unknown as NewsItem[] | null)?.map((item: NewsItem) => {
            const isKawasi = item.villages?.slug === "kawasi";
            const badgeColor = isKawasi 
              ? "bg-ocean-100 text-ocean-700 border-ocean-700" 
              : "bg-tropic-100 text-tropic-700 border-tropic-700";

            return (
              <Link
                key={item.id}
                href={`/berita/${item.villages?.slug || "kawasi"}/${item.slug}`}
                className="group block bg-background border-2 border-on-surface rounded-xl overflow-hidden hard-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                {/* Thumbnail */}
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
                    <div className="flex items-center justify-center h-full text-on-surface/40">
                      <Newspaper className="w-12 h-12" />
                    </div>
                  )}
                </div>

                {/* Konten Card */}
                <div className="p-6 space-y-3">
                  <span className={`inline-block px-2.5 py-1 border text-xs font-bold uppercase tracking-wider rounded-md ${badgeColor}`}>
                    {item.villages?.name}
                  </span>
                  
                  <h2 className="font-serif text-xl font-bold text-on-surface leading-tight group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h2>
                  
                  <div className="flex items-center gap-1.5 text-xs font-medium text-on-surface-variant pt-2 border-t border-dashed border-outline-variant">
                    <Calendar className="w-3.5 h-3.5 text-primary" />
                    {formatDate(item.published_at)}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {(!news || news.length === 0) && (
          <div className="text-center bg-background border-2 border-dashed border-outline rounded-xl py-16 hard-shadow-sm">
            <Newspaper className="w-12 h-12 mx-auto text-on-surface-variant opacity-40 mb-3" />
            <p className="font-serif text-lg text-on-surface-variant font-medium">Belum ada rilis berita saat ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}

