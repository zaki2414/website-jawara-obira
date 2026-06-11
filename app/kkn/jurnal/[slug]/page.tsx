// app/kkn/jurnal/[slug]/page.tsx
import { getKKNJournalBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Camera } from "lucide-react";

export default async function KKNJournalDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: journal, error } = await getKKNJournalBySlug(slug);

  if (error || !journal) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-aged-paper py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        
        {/* TOMBOL KEMBALI BRUTALIST */}
        <Link
          href="/kkn/jurnal"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-on-surface bg-background border-2 border-on-surface px-4 py-2 rounded-lg hard-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:hard-shadow-md transition-all duration-150 mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Kalender
        </Link>

        {/* MAP DOKUMEN UTAMA */}
        <div className="bg-background border-4 border-on-surface rounded-2xl p-6 md:p-10 hard-shadow-lg space-y-8">
          
          {/* HEADER JURNAL */}
          <header className="border-b-4 border-on-surface pb-6">
            <h1 className="text-3xl md:text-5xl font-serif font-black text-on-surface tracking-tight mb-4 leading-tight">
              {journal.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5 bg-surface-container border border-on-surface px-2.5 py-1 rounded-md">
                <Calendar className="w-3.5 h-3.5 text-primary" /> {journal.activity_date}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-surface-container border border-on-surface px-2.5 py-1 rounded-md">
                <MapPin className="w-3.5 h-3.5 text-error" /> Lokasi: {journal.villages?.name || "Kawasan Umum"}
              </span>
            </div>
          </header>

          {/* COVER IMAGE BANNER */}
          {journal.cover_image && (
            <div className="relative w-full h-64 md:h-105 bg-surface-container border-4 border-on-surface rounded-xl overflow-hidden hard-shadow-sm">
              <Image
                src={journal.cover_image}
                alt={journal.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 900px"
                priority
              />
            </div>
          )}

          {/* DOKUMEN ISI JURNAL */}
          <div 
            className="prose prose-neutral max-w-none text-on-surface font-sans font-medium leading-relaxed prose-headings:font-serif prose-headings:font-black prose-strong:font-black whitespace-pre-line border-b border-dashed border-outline-variant pb-8"
            dangerouslySetInnerHTML={{ __html: journal.content }}
          />

          {/* GALERI FOTO LAMPIRAN */}
          {journal.images && journal.images.length > 0 && (
            <section className="space-y-4 pt-2">
              <h3 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" /> Album Dokumentasi Lapangan Tambahan
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {journal.images.map((img: { image_url: string; caption: string | null }, i: number) => (
                  <div
                    key={i}
                    className="bg-background p-2 border-2 border-on-surface rounded-xl hard-shadow-sm group hover:-translate-y-0.5 transition-transform duration-150 flex flex-col justify-between"
                  >
                    <div className="relative h-40 bg-surface-container-high rounded-lg overflow-hidden border border-outline/30">
                      <Image
                        src={img.image_url}
                        alt={img.caption || `Lampiran dokumentasi ke-${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                      />
                    </div>
                    {img.caption && (
                      <p className="mt-2 text-[11px] font-bold text-on-surface-variant tracking-wide border-t border-dashed border-outline-variant/60 pt-2 px-1 leading-snug">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        </div>
      </article>
    </div>
  );
}