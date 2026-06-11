// app/budaya/[slug]/page.tsx
import { getCultureDetail } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, MapPin, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

interface ExtraImage {
  url: string;
  caption?: string;
}

export default async function CultureDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: culture, error } = await getCultureDetail(slug);
  if (error || !culture) return notFound();

  // Parsing extra_images secara aman
  let extraImages: ExtraImage[] = [];
  try {
    extraImages =
      typeof culture.extra_images === "string"
        ? JSON.parse(culture.extra_images)
        : culture.extra_images || [];
  } catch (e) {
    console.error("Gagal parsing extra_images:", e);
  }

  const hasExtraImages = extraImages.length > 0;

  return (
    <article className="bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Navigasi / Back Button */}
        <Link href="/budaya" className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-primary mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Katalog Budaya
        </Link>

        {/* Hero Banner Gambar Utama */}
        {culture.thumbnail_url && (
          <div className="relative w-full h-64 md:h-112.5 border-4 border-on-surface rounded-xl overflow-hidden mb-12 hard-shadow-lg">
            <Image
              src={culture.thumbnail_url}
              alt={culture.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}

        {/* Tata Letak Konten Artikel */}
        <div className="relative">
          {/* == TAMPILAN DEKSTOP (Grid Koran dengan Kliping Foto Miring) == */}
          <div className="hidden md:grid md:grid-cols-12 md:gap-10 md:items-start">
            
            {/* Foto Dokumentasi Samping Kiri */}
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

            {/* Narasi Utama Sejarah/Budaya */}
            <div className={hasExtraImages ? "md:col-span-6" : "md:col-span-8 md:col-start-3"}>
              <header className="mb-8 space-y-4">
                <div className="inline-flex items-center gap-1 text-xs font-bold text-tertiary bg-surface-container-high border border-outline-variant px-2.5 py-1 rounded-md uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" /> {culture.category}
                </div>
                
                <h1 className="font-serif text-4xl lg:text-5xl font-bold text-on-surface leading-tight">
                  {culture.title}
                </h1>
                
                {/* Meta Identitas Informasi */}
                <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b-2 border-dashed border-outline-variant pb-6">
                  {culture.published_at && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(culture.published_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  {culture.villages && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-tropic-700" /> Asal: {culture.villages.name}
                    </span>
                  )}
                </div>
              </header>

              {/* Render Dokumen HTML Teks */}
              <div
                className="prose prose-lg max-w-none font-sans text-on-surface-variant leading-relaxed
                           prose-headings:font-serif prose-headings:font-bold prose-headings:text-on-surface
                           prose-p:mb-6 prose-strong:text-on-surface prose-strong:font-bold
                           prose-a:text-primary prose-a:underline hover:prose-a:text-primary-container"
                dangerouslySetInnerHTML={{ __html: culture.content }}
              />
            </div>

            {/* Foto Dokumentasi Samping Kanan */}
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

          {/* == TAMPILAN RESPONSIVE MOBILE (Stack Vertikal) == */}
          <div className="md:hidden space-y-6">
            <header className="space-y-3">
              <span className="inline-block text-xs font-bold text-tertiary uppercase tracking-wider">{culture.category}</span>
              <h1 className="font-serif text-3xl font-bold text-on-surface leading-tight">
                {culture.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-xs font-bold text-on-surface-variant uppercase">
                {culture.published_at && (
                  <span>
                    {new Date(culture.published_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
                {culture.villages && (
                  <span>• Peta: {culture.villages.name}</span>
                )}
              </div>
            </header>

            <div
              className="prose prose-base max-w-none text-on-surface-variant leading-relaxed"
              dangerouslySetInnerHTML={{ __html: culture.content }}
            />

            {/* Galeri Gambar Ekstra Bagian Bawah Layar Gawai (Mobile) */}
            {hasExtraImages && (
              <div className="pt-6 border-t-2 border-dashed border-outline-variant space-y-6">
                <h4 className="font-serif text-lg font-bold text-on-surface">Dokumentasi Terlampir</h4>
                {extraImages.map((img: ExtraImage, index: number) => img.url && (
                  <div key={index} className="bg-background p-3 border-2 border-on-surface rounded-xl hard-shadow">
                    <div className="relative w-full aspect-4/3 overflow-hidden rounded-lg mb-2">
                      <Image
                        src={img.url}
                        alt={img.caption || "Lampiran Budaya"}
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