// app/kkn/proker/page.tsx
import { getAllKKNProkers } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import { Award, ArrowRight, HelpCircle, MapPin } from "lucide-react";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";
import { KKNProkerHero } from "@/components/kkn/KKNProkerHero";
import { PROKER_CARD_ACCENTS } from "@/components/kkn/kknCardStyles";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ desa?: string }>;
};

type ProkerListItem = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  image_url: string | null;
  impact_metrics: Record<string, string | number> | null;
  village_id: string | null;
  villages: { name: string; slug: string } | null;
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
    <div className="relative min-h-screen bg-natural-paper py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <KknPageBackground />

      <main className="relative max-w-6xl mx-auto z-10">

        <KKNProkerHero totalCount={prokers?.length ?? 0} />

        {/* TOGGLE FILTER DESA CONTROLLER */}
        <div className="flex justify-end mb-8">
          <div className="inline-flex p-1 bg-surface-container border-2 border-on-surface rounded-xl shrink-0">
            <Link
              href="?"
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                !selectedDesa
                  ? "bg-on-surface text-background border-2 border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Semua
            </Link>
            <Link
              href="?desa=kawasi"
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                selectedDesa === "kawasi"
                  ? "bg-on-surface text-background border-2 border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Desa Kawasi
            </Link>
            <Link
              href="?desa=soligi"
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                selectedDesa === "soligi"
                  ? "bg-on-surface text-background border-2 border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Desa Soligi
            </Link>
          </div>
        </div>

        {/* GRID CARDS PROGRAM KERJA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {(prokers as unknown as ProkerListItem[] | null)?.map((proker, index) => {
            const thumb = proker.image_url;
            const metrics = proker.impact_metrics || {};
            // Border kartu & tag metrik dampak di dalamnya SENGAJA satu
            // objek aksen yang sama (bukan dirotasi independen) supaya
            // warnanya selalu cocok — primary+primary, tertiary+tertiary,
            // cream+cream, bukan border tertiary tapi tag-nya tetap primary.
            const cardStyle = PROKER_CARD_ACCENTS[index % PROKER_CARD_ACCENTS.length];

            return (
              <Link
                key={proker.id}
                href={`/kkn/proker/${proker.slug}`}
                className={`group flex flex-col justify-between bg-background rounded-2xl border-4 ${cardStyle.border} overflow-hidden hard-shadow hard-shadow-hover transition-all`}
              >
                <div>
                  {/* Thumbnail Cover */}
                  <div className={`relative h-48 bg-surface-container-high border-b-2 ${cardStyle.border}`}>
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
                        <Award className="w-12 h-12 stroke-2" aria-hidden="true" />
                      </div>
                    )}
                  </div>

                  {/* Konten Manuskrip Ringkas */}
                  <div className="p-5">
                    <div className="inline-flex items-center gap-1 text-label-sm bg-surface-container border-2 border-on-surface px-2 py-0.5 rounded font-black uppercase tracking-wider text-on-surface-variant mb-3">
                      <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
                      {proker.villages?.name || "Umum / Lintas Desa"}
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
                        .map(([key, value]) => {
                          const labelKey = key.replace("_num", "_label");
                          const label = metrics[labelKey] || key;
                          return (
                            <span
                              key={key}
                              className={`text-label-sm font-bold border-2 px-2.5 py-0.5 rounded ${cardStyle.chip}`}
                            >
                              {label}: <span className="font-black">{value}</span>
                            </span>
                          );
                        })}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-on-surface pt-2 group-hover:text-primary transition-colors">
                    <span>Dokumen Penjelasan</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* STATE JIKA DATA KOSONG */}
        {(!prokers || prokers.length === 0) && (
          <div className="flex flex-col items-center justify-center text-on-surface-variant space-y-2 py-24 bg-background border-2 border-dashed border-outline-variant rounded-2xl">
            <HelpCircle className="w-12 h-12 opacity-30 stroke-[1.5]" aria-hidden="true" />
            <p className="font-serif text-lg font-bold">Belum Ada Program Dampak</p>
            <p className="text-sm">Arsip laporan program kerja untuk kategori ini belum diterbitkan.</p>
          </div>
        )}
      </main>
    </div>
  );
}