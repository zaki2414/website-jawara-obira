//app/berita/[desa]/[slug]/page.tsx
import { getNewsDetail } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

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
  const { slug } = await params;
  const { data: news, error } = await getNewsDetail(slug);
  if (error || !news) return notFound();

  const extraImages: ExtraImage[] = news.extra_images || [];
  const hasExtraImages = extraImages.length > 0;

  return (
    <article className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      {/* Thumbnail Utama */}
      {news.thumbnail_url && (
        <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden mb-8 md:mb-12 shadow-xl">
          <Image
            src={news.thumbnail_url}
            alt={news.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      {/* Kontainer Grid Responsif */}
      <div className="relative">
        {/* Desktop Layout: Grid 3 Kolom dengan Gambar Samping */}
        <div className="hidden md:grid md:grid-cols-12 md:gap-8 md:items-start">
          {/* Gambar Kiri (Slot 1) - Rotasi -3° */}
          {extraImages[0]?.url && (
            <div className="md:col-span-3 md:sticky md:top-24">
              <div className="relative -rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src={extraImages[0].url}
                  alt={extraImages[0].caption || "Gambar pendukung"}
                  width={400}
                  height={500}
                  className="rounded-xl shadow-lg"
                />
                {extraImages[0].caption && (
                  <p className="text-xs text-gray-500 mt-3 text-center italic">
                    {extraImages[0].caption}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Teks Utama - Center (Menggunakan Object Mapping untuk mengamankan class Tailwind) */}
          <div
            className={
              hasExtraImages
                ? "md:col-span-6 md:col-start-4"
                : "md:col-span-12 md:col-start-1"
            }
          >
            <header className="mb-8">
              <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-ocean-800 mb-4 leading-tight">
                {news.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 border-b border-sand-200 pb-6">
                <span className="flex items-center gap-1">
                  📅 {formatDate(news.published_at)}
                </span>
                <span className="flex items-center gap-1">
                  ✍️ {news.author_name || "Tim Redaksi"}
                </span>
                {news.villages && (
                  <span className="flex items-center gap-1">
                    📍 {news.villages.name}
                  </span>
                )}
              </div>
            </header>

            <div
              className="prose prose-lg md:prose-xl max-w-none prose-ocean prose-headings:font-serif prose-headings:font-bold prose-a:text-ocean-600 hover:prose-a:text-ocean-700"
              dangerouslySetInnerHTML={{ __html: news.content }}
            />
          </div>

          {/* Gambar Kanan (Slot 2) - Rotasi +3° */}
          {extraImages[1]?.url && (
            <div className="md:col-span-3 md:sticky md:top-24">
              <div className="relative rotate-3 hover:rotate-0 transition-transform duration-300">
                <Image
                  src={extraImages[1].url}
                  alt={extraImages[1].caption || "Gambar pendukung"}
                  width={400}
                  height={500}
                  className="rounded-xl shadow-lg"
                />
                {extraImages[1].caption && (
                  <p className="text-xs text-gray-500 mt-3 text-center italic">
                    {extraImages[1].caption}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile Layout: Stack Vertical */}
        <div className="md:hidden space-y-8">
          <header className="mb-6">
            <h1 className="font-serif text-2xl md:text-3xl font-bold text-ocean-800 mb-3">
              {news.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
              <span>📅 {formatDate(news.published_at)}</span>
              <span>✍️ {news.author_name || "Tim Redaksi"}</span>
            </div>
          </header>

          <div
            className="prose prose-base max-w-none"
            dangerouslySetInnerHTML={{ __html: news.content }}
          />

          {/* Extra Images di bawah (Mobile) dengan tipe data index yang jelas */}
          {extraImages.map(
            (img: ExtraImage, index: number) =>
              img.url && (
                <div
                  key={index}
                  className="bg-white p-3 rounded-xl shadow-sm border border-sand-200"
                >
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "75%" }}
                  >
                    <Image
                      src={img.url}
                      alt={img.caption || "Gambar pendukung"}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  {img.caption && (
                    <p className="text-sm text-gray-600 mt-2 text-center">
                      {img.caption}
                    </p>
                  )}
                </div>
              ),
          )}
        </div>
      </div>
    </article>
  );
}
