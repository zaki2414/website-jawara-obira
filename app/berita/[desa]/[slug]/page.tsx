// app/berita/[desa]/[slug]/page.tsx
import { getNewsDetail } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { Calendar, User, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

interface ExtraImage {
  url: string;
  caption?: string;
}

export default async function NewsDetail({
  params,
}: {
  params: Promise<{ desa: string; slug: string }>;
}) {
  const { desa, slug } = await params;
  const { data: news, error } = await getNewsDetail(slug);
  if (error || !news) return notFound();

  const extraImages: ExtraImage[] = news.extra_images || [];
  const hasExtraImages = extraImages.length > 0;

  return (
    <article className="bg-natural-paper py-12 border-b-4 border-on-surface min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Navigasi Atas */}
        <Link href={`/berita/${desa}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-primary mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Berita Desa {desa === "kawasi" ? "Kawasi" : "Soligi"}
        </Link>

        {/* Cover Thumbnail Utama */}
        {news.thumbnail_url && (
          <div className="relative w-full h-64 md:h-112.5 border-4 border-on-surface rounded-xl overflow-hidden mb-12 hard-shadow-lg">
            <Image
              src={news.thumbnail_url}
              alt={news.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Layout Grid Artikel */}
        <div className="relative">
          {/* == DESKTOP VIEW GRID == */}
          <div className="hidden md:grid md:grid-cols-12 md:gap-10 md:items-start">
            
            {/* Gambar Pendukung Kiri (Slot 1) */}
            {extraImages[0]?.url ? (
              <div className="md:col-span-3 md:sticky md:top-24 space-y-2">
                <div className="bg-background p-2.5 border-2 border-on-surface rounded-xl hard-shadow -rotate-3 hover:rotate-0 transition-all duration-300">
                  <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg">
                    <Image
                      src={extraImages[0].url}
                      alt={extraImages[0].caption || "Kliping lampiran"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                {extraImages[0].caption && (
                  <p className="text-xs font-medium text-on-surface-variant text-center italic px-2">
                    {extraImages[0].caption}
                  </p>
                )}
              </div>
            ) : <div className="md:col-span-3" />}

            {/* Kolom Teks Inti Utama */}
            <div className={hasExtraImages ? "md:col-span-6" : "md:col-span-8 md:col-start-3"}>
              <header className="mb-8 space-y-4">
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-on-surface leading-tight">
                  {news.title}
                </h1>
                
                {/* Meta Bar */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b-2 border-dashed border-outline-variant pb-6">
                  <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-primary" /> {formatDate(news.published_at)}</span>
                  <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-tertiary" /> {news.author_name || "Tim Redaksi"}</span>
                  {news.villages && (
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-tropic-700" /> {news.villages.name}</span>
                  )}
                </div>
              </header>

              {/* Sanitize/Render HTML Konten */}
              <div
                className="prose prose-lg max-w-none font-sans text-on-surface-variant leading-relaxed
                           prose-headings:font-serif prose-headings:font-bold prose-headings:text-on-surface
                           prose-p:mb-6 prose-strong:text-on-surface prose-strong:font-bold
                           prose-a:text-primary prose-a:underline hover:prose-a:text-primary-container"
                dangerouslySetInnerHTML={{ __html: news.content }}
              />
            </div>

            {/* Gambar Pendukung Kanan (Slot 2) */}
            {extraImages[1]?.url ? (
              <div className="md:col-span-3 md:sticky md:top-24 space-y-2">
                <div className="bg-background p-2.5 border-2 border-on-surface rounded-xl hard-shadow rotate-3 hover:rotate-0 transition-all duration-300">
                  <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg">
                    <Image
                      src={extraImages[1].url}
                      alt={extraImages[1].caption || "Kliping lampiran"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                {extraImages[1].caption && (
                  <p className="text-xs font-medium text-on-surface-variant text-center italic px-2">
                    {extraImages[1].caption}
                  </p>
                )}
              </div>
            ) : <div className="md:col-span-3" />}

          </div>

          {/* == MOBILE VIEW ACCORDION (Stack) == */}
          <div className="md:hidden space-y-6">
            <header className="space-y-3">
              <h1 className="font-serif text-3xl font-bold text-on-surface leading-tight">
                {news.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-xs font-bold text-on-surface-variant uppercase">
                <span>{formatDate(news.published_at)}</span>
                <span>•</span>
                <span>By {news.author_name || "Redaksi"}</span>
              </div>
            </header>

            <div
              className="prose prose-base max-w-none text-on-surface-variant leading-relaxed"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />

            {/* Galeri Tambahan di bawah khusus Mobile */}
            {hasExtraImages && (
              <div className="pt-6 border-t-2 border-dashed border-outline-variant space-y-6">
                <h4 className="font-serif text-lg font-bold text-on-surface">Gambar Dokumentasi</h4>
                {extraImages.map((img: ExtraImage, index: number) => img.url && (
                  <div key={index} className="bg-background p-3 border-2 border-on-surface rounded-xl hard-shadow">
                    <div className="relative w-full aspect-4/3 overflow-hidden rounded-lg mb-2">
                      <Image
                        src={img.url}
                        alt={img.caption || "Lampiran"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {img.caption && (
                      <p className="text-xs font-medium text-on-surface-variant text-center italic">{img.caption}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </article>
  );
}