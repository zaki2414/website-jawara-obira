// app/toga/page.tsx
"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Sprout, BookOpen, HeartPulse, CupSoda, HelpCircle, ArrowRight, CheckCircle2 } from "lucide-react";

type Plant = {
  id: string;
  name_id: string;
  name_latin: string;
  slug: string;
  description?: string;
  health_benefits?: string[];
  thumbnail_url?: string;
  gallery_urls?: string | any[];
  recipes?: string | any[];
};

// Amankan parsing JSON untuk data resep tradisional dari database
const parseRecipesField = (value: any): any[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

function TogaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data tanaman obat dari Supabase
  useEffect(() => {
    const fetchPlants = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("toga_plants")
          .select("*")
          .order("name_id", { ascending: true });

        setPlants(data || []);
      } catch (error) {
        console.error("Error fetching plants:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, []);

  // Menentukan tanaman terpilih langsung dari URL (State Derivation yang aman dari cascading render)
  const selectedPlant = useMemo(() => {
    const slug = searchParams.get("plant");
    if (slug && plants.length > 0) {
      return plants.find((p) => p.slug === slug) || null;
    }
    if (plants.length > 0) return plants[0];
    return null;
  }, [searchParams, plants]);

  const handleSelectPlant = (targetSlug: string) => {
    router.push(`/toga?plant=${targetSlug}`, { scroll: false });
  };

  return (
    <div className="flex bg-natural-paper min-h-screen">
      
      {/* SIDEBAR - LIST TANAMAN (STICKY POSITION FIX) */}
      <aside className="w-80 bg-background border-r-4 border-on-surface p-6 overflow-y-auto sticky top-0 h-screen z-10 flex flex-col justify-between shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 bg-tropic-100 text-tropic-900 px-3 py-1 text-xs font-bold uppercase tracking-wider border border-on-surface mb-4 hard-shadow-sm">
            <Sprout className="w-3.5 h-3.5" /> Botani Lokal
          </div>
          <h2 className="font-serif text-2xl font-black text-on-surface mb-6 tracking-tight">
            Daftar Tanaman Obat
          </h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="h-12 bg-surface-container border border-outline-variant rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {plants.map((plant) => {
                const isSelected = selectedPlant?.slug === plant.slug;
                return (
                  <li key={plant.id}>
                    <button
                      onClick={() => handleSelectPlant(plant.slug)}
                      className={`w-full text-left p-4 rounded-xl border-2 border-on-surface transition-all duration-150 ${
                        isSelected
                          ? "bg-on-surface text-background hard-shadow-sm -translate-x-0.5 -translate-y-0.5"
                          : "bg-background text-on-surface hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="font-serif font-bold text-base leading-tight">{plant.name_id}</div>
                      {plant.name_latin && (
                        <div className={`text-xs mt-1 italic font-medium ${isSelected ? "text-background/80" : "text-on-surface-variant"}`}>
                          {plant.name_latin}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="pt-4 border-t border-dashed border-outline-variant text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 mt-6">
          Apotek Hidup & Kearsipan Toga Obira
        </div>
      </aside>

      {/* MAIN CONTENT - DETAIL TANAMAN (AUTO-FLEX REFLOW) */}
      <main className="flex-1 p-8 md:p-12 bg-aged-paper">
        {selectedPlant ? (
          <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
            
            {/* Header Identitas Tanaman */}
            <div className="border-b-4 border-on-surface pb-6 relative">
              <h1 className="text-4xl md:text-5xl font-serif font-black text-on-surface tracking-tight mb-2">
                {selectedPlant.name_id}
              </h1>
              <p className="text-xl font-sans font-medium text-on-surface-variant italic">
                {selectedPlant.name_latin}
              </p>
            </div>

            {/* Gambar Mini Banner Tanaman */}
            {selectedPlant.thumbnail_url && (
              <div className="relative w-full h-80 md:h-96 border-4 border-on-surface rounded-xl overflow-hidden hard-shadow-lg bg-surface-container-high">
                <Image
                  src={selectedPlant.thumbnail_url}
                  alt={selectedPlant.name_id}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Narasi Penjelasan */}
            {selectedPlant.description && (
              <section className="bg-background p-6 border-2 border-on-surface rounded-xl hard-shadow-sm space-y-3">
                <h2 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Deskripsi Klasifikasi Tanaman
                </h2>
                <p className="text-on-surface-variant leading-relaxed font-sans font-medium whitespace-pre-line">
                  {selectedPlant.description}
                </p>
              </section>
            )}

            {/* Khasiat & Manfaat Kesehatan */}
            {selectedPlant.health_benefits && selectedPlant.health_benefits.length > 0 && (
              <section className="bg-background p-6 border-2 border-on-surface rounded-xl hard-shadow-sm space-y-4">
                <h2 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                  <HeartPulse className="w-5 h-5 text-error" /> Khasiat & Manfaat Kesehatan
                </h2>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedPlant.health_benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-on-surface-variant font-sans font-medium text-sm bg-surface-container-low p-3 rounded-lg border border-outline/40"
                    >
                      <CheckCircle2 className="w-4 h-4 text-tropic-500 shrink-0 mt-0.5" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Blok Panduan Resep Tradisional */}
            {(() => {
              const recipeList = parseRecipesField(selectedPlant.recipes);
              if (recipeList.length === 0) return null;

              return (
                <section className="bg-tropic-50 p-6 border-2 border-tropic-700 rounded-xl hard-shadow-sm space-y-6">
                  <h2 className="font-serif text-xl font-black text-tropic-900 flex items-center gap-2 border-b border-tropic-200 pb-2">
                    <CupSoda className="w-5 h-5 text-tropic-700" /> Resep Racikan Tradisional
                  </h2>
                  <div className="space-y-6 split-dashed">
                    {recipeList.map((recipe: any, i: number) => (
                      <div
                        key={i}
                        className="border-b border-dashed border-tropic-300 last:border-0 pb-6 last:pb-0"
                      >
                        <h3 className="font-black font-serif text-xl text-tropic-900 mb-4 inline-flex items-center gap-2">
                          <ArrowRight className="w-4 h-4 text-tropic-700" /> Racikan: {recipe.title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Bahan-bahan */}
                          <div className="bg-background/50 p-4 border border-tropic-200 rounded-lg">
                            <h4 className="font-black text-xs uppercase tracking-wide text-tropic-900 mb-2">
                              Komposisi Bahan:
                            </h4>
                            <ul className="list-disc list-inside text-sm text-tropic-800 font-medium space-y-1.5">
                              {recipe.ingredients
                                ?.filter((ing: string) => ing.trim())
                                .map((ing: string, j: number) => (
                                  <li key={j} className="text-tropic-800">{ing}</li>
                                ))}
                            </ul>
                          </div>

                          {/* Langkah Pembuatan */}
                          <div className="bg-background/50 p-4 border border-tropic-200 rounded-lg">
                            <h4 className="font-black text-xs uppercase tracking-wide text-tropic-900 mb-2">
                              Tahap Pengolahan:
                            </h4>
                            <ol className="list-decimal list-inside text-sm text-tropic-800 font-medium space-y-1.5">
                              {recipe.steps
                                ?.filter((step: string) => step.trim())
                                .map((step: string, j: number) => (
                                  <li key={j} className="text-tropic-800">{step}</li>
                                ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant space-y-2 py-20">
            <HelpCircle className="w-12 h-12 opacity-30 stroke-[1.5]" />
            <p className="font-serif text-lg font-bold">Tidak Ada Spesimen Terpilih</p>
            <p className="text-sm">Silakan pilih jenis tanaman obat pada daftar menu navigasi sebelah kiri.</p>
          </div>
        )}
      </main>

    </div>
  );
}

// Wrapper Pembungkus Suspense agar aman dari kegagalan kompilasi static build Next.js akibat useSearchParams
export default function TogaPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-natural-paper font-serif font-bold text-on-surface">
        Membuka Katalog Tanaman Obat...
      </div>
    }>
      <TogaContent />
    </Suspense>
  );
}