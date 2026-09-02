// app/berita/[desa]/page.tsx
import { getNewsByVillageSlug } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Calendar, User, Newspaper, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { BeritaPageBackground } from "@/components/berita/BeritaPageBackground";

export const revalidate = 3600;

interface VillageNewsItem {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  author_name?: string;
  thumbnail_url?: string;
}

export default async function VillageNews({
  params,
}: {
  params: Promise<{ desa: string }>;
}) {
  const { desa } = await params;
  const { data: news, error } = await getNewsByVillageSlug(desa);
  if (error) return notFound();

  const isKawasi = desa === "kawasi";
  const desaName = isKawasi ? "Kawasi" : "Soligi";
  const accentColor = isKawasi ? "text-primary" : "text-tropic-700";

  return (
    <section className="relative bg-aged-paper py-16 px-6 border-b-4 border-on-surface min-h-screen overflow-hidden">
      <BeritaPageBackground />

      <div className="relative max-w-4xl mx-auto z-10">
        {/* Tombol Kembali */}
        <Link href="/berita" className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-primary mb-6 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Semua Berita
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface mb-3">
            Kliping Berita <span className={`italic ${accentColor}`}>Desa {desaName}</span>
          </h1>
          <p className="text-on-surface-variant text-lg">
            Kumpulan kabar, aktivitas komunitas, dan info perkembangan berkala dari Desa {desaName}.
          </p>
        </div>

        {/* Daftar Berita List Style */}
        <div className="space-y-6">
          {news?.map((item: VillageNewsItem) => (
            <Link
              key={item.id}
              href={`/berita/${desa}/${item.slug}`}
              className="flex flex-col md:flex-row gap-6 p-5 bg-background border-2 border-on-surface rounded-xl hard-shadow hover:-translate-x-1 hover:-translate-y-1 hover:shadow-hard-lg transition-all"
            >
              {/* Image Column */}
              <div className="relative w-full md:w-52 h-36 shrink-0 overflow-hidden rounded-lg bg-surface-container-high border border-on-surface/20">
                {item.thumbnail_url ? (
                  <Image
                    src={item.thumbnail_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 208px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40">
                    <Newspaper className="w-8 h-8" />
                  </div>
                )}
              </div>

              {/* Info Column */}
              <div className="flex flex-col justify-between flex-1 py-1">
                <h2 className="font-serif text-2xl font-bold text-on-surface line-clamp-2 leading-tight hover:text-primary transition-colors">
                  {item.title}
                </h2>
                
                <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-on-surface-variant pt-4 mt-2 border-t border-dashed border-outline-variant">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> {formatDate(item.published_at)}
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-tertiary" /> {item.author_name || "Tim Redaksi"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {(!news || news.length === 0) && (
          <div className="text-center bg-background border-2 border-dashed border-outline rounded-xl py-16 hard-shadow-sm">
            <p className="font-serif text-lg text-on-surface-variant font-medium">Belum ada warta terbit untuk desa ini.</p>
          </div>
        )}
      </div>
    </section>
  );
}

