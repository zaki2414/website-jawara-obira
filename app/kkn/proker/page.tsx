// app/kkn/proker/page.tsx
import { getAllKKNProkers } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import { Target, Award, ArrowRight, HelpCircle } from "lucide-react";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ desa?: string }>;
};

export default async function KKNProkersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedDesa = params.desa;
  const { data: prokers, error } = await getAllKKNProkers(selectedDesa);

  if (error) {
    return (
      <div className="min-h-screen bg-natural-paper p-8 flex items-center justify-center">
        <div className="bg-background p-6 border-2 border-error rounded-xl max-w-md hard-shadow-sm text-center">
          <p className="font-serif font-black text-error text-lg mb-2">Gagal Memuat Program Kerja</p>
          <p className="text-sm text-on-surface-variant font-medium">{String(error)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-natural-paper py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-6xl mx-auto">
        
        {/* HEADER SECTION */}
        <header className="border-b-4 border-on-surface pb-6 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-black text-on-surface tracking-tight flex items-center gap-3">
              <Target className="w-8 h-8 text-primary stroke-2" /> Realisasi Program Kerja
            </h1>
            <p className="text-on-surface-variant font-medium mt-1">
              Capaian program kerja kami untuk masyarakat desa.
            </p>
          </div>

          {/* TOGGLE FILTER DESA CONTROLLER */}
          <div className="inline-flex p-1 bg-surface-container border-2 border-on-surface rounded-xl shrink-0">
            <Link
              href="?"
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                !selectedDesa
                  ? "bg-on-surface text-background border border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Semua
            </Link>
            <Link
              href="?desa=kawasi"
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                selectedDesa === "kawasi"
                  ? "bg-on-surface text-background border border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Desa Kawasi
            </Link>
            <Link
              href="?desa=soligi"
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                selectedDesa === "soligi"
                  ? "bg-on-surface text-background border border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Desa Soligi
            </Link>
          </div>
        </header>

        {/* GRID CARDS PROGRAM KERJA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {prokers?.map((proker: any) => {
            const thumb = proker.image_url;
            const metrics = proker.impact_metrics || {};

            return (
              <Link
                key={proker.id}
                href={`/kkn/proker/${proker.slug}`}
                className="group flex flex-col justify-between bg-background rounded-2xl border-2 border-on-surface overflow-hidden hard-shadow-sm hover:-translate-x-1 hover:-translate-y-1 hover:hard-shadow-md transition-all duration-150"
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className="relative h-48 bg-surface-container-high border-b-2 border-on-surface">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={proker.title}
                        fill
                        className="object-cover group-hover:scale-102 transition-transform duration-300"
                        loading="eager"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-surface-container text-on-surface-variant/30">
                        <Award className="w-12 h-12 stroke-2" />
                      </div>
                    )}
                  </div>

                  {/* Konten Manuskrip Ringkas */}
                  <div className="p-5">
                    <div className="text-[10px] bg-surface-container border border-on-surface px-2 py-0.5 rounded font-black uppercase tracking-wider text-on-surface-variant inline-block mb-3">
                      📍 {proker.villages?.name || "Umum / Lintas Desa"}
                    </div>
                    <h3 className="font-serif text-xl font-black text-on-surface leading-snug tracking-tight mb-2 group-hover:text-primary transition-colors duration-150 line-clamp-2">
                      {proker.title}
                    </h3>
                    <p className="text-sm font-medium text-on-surface-variant line-clamp-2 leading-relaxed">
                      {proker.short_description}
                    </p>
                  </div>
                </div>

                {/* Indikator Metrik Dampak di Kaki Kartu */}
                <div className="p-5 pt-0">
                  {Object.keys(metrics).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4 pt-3 border-t border-dashed border-outline-variant">
                      {Object.entries(metrics)
                        .filter(([key, value]) => value && value !== "" && key.includes("_num"))
                        .slice(0, 2)
                        .map(([key, value]: [string, any]) => {
                          const labelKey = key.replace("_num", "_label");
                          const label = metrics[labelKey] || key;
                          return (
                            <span
                              key={key}
                              className="text-[11px] font-bold bg-tropic-100 text-tropic-900 border border-tropic-300 px-2.5 py-0.5 rounded"
                            >
                              {label}: <span className="font-black">{value}</span>
                            </span>
                          );
                        })}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-on-surface pt-2 group-hover:text-primary transition-colors">
                    <span>Dokumen Penjelasan</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* STATE JIKA DATA KOSONG */}
        {(!prokers || prokers.length === 0) && (
          <div className="flex flex-col items-center justify-center text-on-surface-variant space-y-2 py-24 bg-background border-2 border-dashed border-outline-variant rounded-2xl">
            <HelpCircle className="w-12 h-12 opacity-30 stroke-[1.5]" />
            <p className="font-serif text-lg font-bold">Belum Ada Program Dampak</p>
            <p className="text-sm">Arsip laporan program kerja untuk kategori ini belum diterbitkan.</p>
          </div>
        )}
      </main>
    </div>
  );
}