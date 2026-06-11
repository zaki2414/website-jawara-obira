// app/kkn/proker/[slug]/page.tsx
import { getKKNProkerBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin, Target, CheckSquare, BarChart3, Trophy, Camera } from "lucide-react";

export default async function KKNProkerDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: proker, error } = await getKKNProkerBySlug(slug);

  if (error || !proker) return notFound();

  const metrics = proker.impact_metrics || {};
  const achievements = proker.key_achievements || [];
  const docs = Array.isArray(proker.documentation) ? proker.documentation : [];
  const coverImage = proker.image_url;

  return (
    <div className="min-h-screen bg-aged-paper py-12 px-4 sm:px-6 lg:px-8">
      <article className="max-w-4xl mx-auto">
        
        {/* TOMBOL KEMBALI BRUTALIST */}
        <Link
          href="/kkn/proker"
          className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-on-surface bg-background border-2 border-on-surface px-4 py-2 rounded-lg hard-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:hard-shadow-md transition-all duration-150 mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar Program
        </Link>

        {/* MAP DOKUMEN LAPORAN */}
        <div className="bg-background border-4 border-on-surface rounded-2xl p-6 md:p-10 hard-shadow-lg space-y-10">
          
          {/* HEADER IDENTITAS */}
          <header className="border-b-4 border-on-surface pb-6">
            <div className="inline-flex items-center gap-1.5 bg-surface-container border border-on-surface px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-4">
              <MapPin className="w-3.5 h-3.5 text-error" /> Wilayah Tugas: {proker.villages?.name || "Kawasan Umum"}
            </div>
            <h1 className="text-3xl md:text-5xl font-serif font-black text-on-surface tracking-tight leading-tight">
              {proker.title}
            </h1>
          </header>

          {/* COVER IMAGE UTAMA */}
          {coverImage && (
            <div className="relative w-full h-64 md:h-105 bg-surface-container border-4 border-on-surface rounded-xl overflow-hidden hard-shadow-sm">
              <Image
                src={coverImage}
                alt={proker.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 900px"
                priority
              />
            </div>
          )}

          {/* DESKRIPSI SINGKAT */}
          {proker.short_description && (
            <p className="text-lg md:text-xl font-sans font-medium text-on-surface-variant leading-relaxed border-l-4 border-primary pl-4 py-1 italic">
              {proker.short_description}
            </p>
          )}

          {/* TUJUAN PROGRAM */}
          {proker.goals && (
            <section className="space-y-3 bg-surface-container-low/40 p-6 border-2 border-on-surface rounded-xl">
              <h3 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" /> Maksud & Tujuan Program
              </h3>
              <div
                className="prose prose-neutral max-w-none text-on-surface-variant font-sans font-medium text-sm md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: proker.goals }}
              />
            </section>
          )}

          {/* HASIL PELAKSANAAN */}
          {proker.results && (
            <section className="space-y-3 bg-surface-container-low/40 p-6 border-2 border-on-surface rounded-xl">
              <h3 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-tropic-500" /> Hasil Realisasi Lapangan
              </h3>
              <div
                className="prose prose-neutral max-w-none text-on-surface-variant font-sans font-medium text-sm md:text-base leading-relaxed"
                dangerouslySetInnerHTML={{ __html: proker.results }}
              />
            </section>
          )}

          {/* PAPAN METRIK DAMPAK (IMPACT METRICS) */}
          {Object.keys(metrics).length > 0 && (
            <section className="bg-tropic-50 p-6 border-2 border-tropic-700 rounded-xl hard-shadow-sm space-y-4">
              <h3 className="font-serif text-xl font-black text-tropic-900 flex items-center gap-2 border-b border-tropic-200 pb-2">
                <BarChart3 className="w-5 h-5 text-tropic-700" /> Kuantifikasi Dampak & Manfaat
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(metrics)
                  .filter(([key, value]) => value && value !== "" && key.includes("_num"))
                  .map(([key, value]: [string, any]) => {
                    const labelKey = key.replace("_num", "_label");
                    const label = metrics[labelKey] || key.replace("_num", "").replace("_", " ");

                    return (
                      <div key={key} className="p-4 bg-background border-2 border-on-surface rounded-lg text-center hard-shadow-sm">
                        <div className="text-3xl font-serif font-black text-tropic-700 mb-1">
                          {value}
                        </div>
                        <div className="text-xs uppercase font-black tracking-wide text-on-surface-variant">
                          {label}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}

          {/* PENCAPAIAN UTAMA LIST */}
          {achievements.length > 0 && (
            <section className="space-y-4">
              <h3 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                <Trophy className="w-5 h-5 text-sand-500" /> Indikator Pencapaian Utama
              </h3>
              <ul className="space-y-2.5 font-sans font-medium text-on-surface-variant text-sm md:text-base">
                {achievements.map((item: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 bg-surface-container-low p-3 rounded-lg border border-outline/30">
                    <span className="font-black text-primary text-sm bg-background border border-on-surface px-1.5 py-0.5 rounded shrink-0">
                      #{i + 1}
                    </span>
                    <span className="pt-0.5 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* GALERI FOTO DOKUMEN RESMI */}
          {docs.length > 0 && (
            <section className="space-y-4 pt-4 border-t border-dashed border-outline-variant">
              <h3 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary" /> Berkas Dokumentasi Implementasi
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {docs.map((img: any, i: number) => {
                  const imageUrl = img.url || img.image_url;
                  if (!imageUrl) return null;

                  return (
                    <div
                      key={i}
                      className="bg-background p-2 border-2 border-on-surface rounded-xl hard-shadow-sm flex flex-col justify-between"
                    >
                      <div className="relative h-40 bg-surface-container rounded-lg overflow-hidden border border-outline/30">
                        <Image
                          src={imageUrl}
                          alt={img.caption || `Dokumentasi Luaran ${i + 1}`}
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
                  );
                })}
              </div>
            </section>
          )}

        </div>
      </article>
    </div>
  );
}