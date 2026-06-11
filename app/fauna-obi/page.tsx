// app/fauna-obi/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Bird, Info, BookOpen, Leaf, Camera, ShieldAlert, Sparkles, HelpCircle } from "lucide-react";

type Fauna = {
  id: string;
  name_local: string;
  name_scientific: string;
  slug: string;
  class?: string;
  order_name?: string;
  family?: string;
  iucn_status?: string;
  conservation_notes?: string;
  habitat?: string;
  diet?: string;
  behavior?: string;
  distribution?: string;
  description?: string;
  physical_characteristics?: string;
  thumbnail_url?: string;
  documentations?: string | any[];
};

const parseJsonField = (value: any): any[] => {
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

const getIucnBrutalistClass = (status?: string) => {
  const styles: Record<string, string> = {
    LC: "bg-[#22c55e] text-black border-2 border-on-surface",
    NT: "bg-[#eab308] text-black border-2 border-on-surface",
    VU: "bg-[#f97316] text-white border-2 border-on-surface",
    EN: "bg-[#ef4444] text-white border-2 border-on-surface font-black",
    CR: "bg-[#7f1d1d] text-white border-2 border-on-surface font-black animate-pulse",
  };
  return styles[status || ""] || "bg-surface-container text-on-surface border border-outline";
};

function FaunaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [faunas, setFaunas] = useState<Fauna[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFauna = async () => {
      setLoading(true);
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("fauna_obi")
          .select("*")
          .order("name_local", { ascending: true });
        setFaunas(data || []);
      } catch (error) {
        console.error("Error fetching fauna:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFauna();
  }, []);

  // Sinkronisasi data terpilih langsung dari URL saat render (Aman dari ESLint Cascading Render)
  const slug = searchParams.get("fauna");
  const selected = faunas.find((f) => f.slug === slug) || faunas[0] || null;

  const handleSelect = (targetSlug: string) => {
    router.push(`/fauna-obi?fauna=${targetSlug}`, { scroll: false });
  };

  const gallery = selected ? parseJsonField(selected.documentations) : [];

  return (
    <div className="flex bg-natural-paper min-h-screen">
      
      {/* SIDEBAR NAVIGATION (STAY STICKY & RESPECT FOOTER) */}
      <aside className="w-80 bg-background border-r-4 border-on-surface p-6 overflow-y-auto sticky top-0 h-screen z-10 flex flex-col justify-between shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 bg-secondary text-on-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider border border-on-surface mb-4 hard-shadow-sm">
            <Bird className="w-3.5 h-3.5" /> Endemisme
          </div>
          <h2 className="font-serif text-2xl font-black text-on-surface mb-6 tracking-tight">
            Fauna Pulau Obi
          </h2>
          
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-12 bg-surface-container border border-outline-variant rounded-lg animate-pulse" />
              ))}
            </div>
          ) : (
            <ul className="space-y-3">
              {faunas.map((f) => {
                const isSelected = selected?.slug === f.slug;
                return (
                  <li key={f.id}>
                    <button
                      onClick={() => handleSelect(f.slug)}
                      className={`w-full text-left p-4 rounded-xl border-2 border-on-surface transition-all duration-150 ${
                        isSelected
                          ? "bg-on-surface text-background hard-shadow-sm -translate-x-0.5 -translate-y-0.5"
                          : "bg-background text-on-surface hover:bg-surface-container-low"
                      }`}
                    >
                      <div className="font-serif font-bold text-base leading-tight">{f.name_local}</div>
                      <div className={`text-xs mt-1 italic font-medium ${isSelected ? "text-background/80" : "text-on-surface-variant"}`}>
                        {f.name_scientific}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        
        <div className="pt-4 border-t border-dashed border-outline-variant text-[10px] uppercase font-bold tracking-wider text-on-surface-variant/60 mt-6">
          Sistem Informasi Biodiversitas Maluku Utara
        </div>
      </aside>

      {/* DETAIL CONTENT PANEL (FLEX AUTO-LAYOUT) */}
      <main className="flex-1 p-8 md:p-12 bg-aged-paper">
        {selected ? (
          <div className="max-w-4xl mx-auto space-y-10 animate-fade-in">
            
            {/* Header Identitas */}
            <div className="border-b-4 border-on-surface pb-6 relative">
              <h1 className="text-4xl md:text-5xl font-serif font-black text-on-surface tracking-tight mb-2">
                {selected.name_local}
              </h1>
              <p className="text-xl font-sans font-medium text-on-surface-variant italic mb-5">
                {selected.name_scientific}
              </p>
              
              {selected.iucn_status && (
                <div className="inline-flex items-center gap-2">
                  <span className={`px-4 py-1.5 rounded-md text-xs font-black uppercase tracking-widest hard-shadow-sm ${getIucnBrutalistClass(selected.iucn_status)}`}>
                    Status IUCN: {selected.iucn_status}
                  </span>
                </div>
              )}
            </div>

            {/* Gambar Banner Utama */}
            {selected.thumbnail_url && (
              <div className="relative w-full h-80 md:h-96 border-4 border-on-surface rounded-xl overflow-hidden hard-shadow-lg bg-surface-container-high">
                <Image
                  src={selected.thumbnail_url}
                  alt={selected.name_local}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1200px) 100vw, 800px"
                  priority
                />
              </div>
            )}

            {/* Kotak Klasifikasi */}
            <section className="bg-background p-6 border-2 border-on-surface rounded-xl hard-shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-black text-on-surface flex items-center gap-2 border-b border-dashed border-outline-variant pb-2">
                <Info className="w-5 h-5 text-primary" /> Informasi Dasar & Taksonomi
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-sans">
                {selected.class && (
                  <div className="bg-surface-container-low p-3 border border-outline rounded-lg">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-0.5">Kelas</span>
                    <span className="font-bold text-on-surface">{selected.class}</span>
                  </div>
                )}
                {selected.order_name && (
                  <div className="bg-surface-container-low p-3 border border-outline rounded-lg">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-0.5">Ordo</span>
                    <span className="font-bold text-on-surface">{selected.order_name}</span>
                  </div>
                )}
                {selected.family && (
                  <div className="bg-surface-container-low p-3 border border-outline rounded-lg">
                    <span className="block text-[10px] font-black uppercase tracking-wider text-on-surface-variant mb-0.5">Famili</span>
                    <span className="font-bold text-on-surface">{selected.family}</span>
                  </div>
                )}
                {selected.conservation_notes && (
                  <div className="sm:col-span-3 bg-tertiary-container/20 p-4 border border-outline rounded-lg mt-2">
                    <span className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-on-surface mb-1">
                      <ShieldAlert className="w-3.5 h-3.5 text-error" /> Catatan Konservasi Tambahan
                    </span>
                    <p className="text-sm font-medium text-on-surface-variant leading-relaxed">{selected.conservation_notes}</p>
                  </div>
                )}
              </div>
            </section>

            {/* Narasi Deskripsi */}
            {selected.description && (
              <section className="bg-background p-6 border-2 border-on-surface rounded-xl hard-shadow-sm space-y-3">
                <h2 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-primary" /> Deskripsi Biologis
                </h2>
                <p className="text-on-surface-variant leading-relaxed font-sans font-medium whitespace-pre-line">
                  {selected.description}
                </p>
              </section>
            )}

            {/* Karakteristik Fisik */}
            {selected.physical_characteristics && (
              <section className="bg-background p-6 border-2 border-on-surface rounded-xl hard-shadow-sm space-y-3">
                <h2 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-secondary" /> Morfologi & Ciri Fisik
                </h2>
                <p className="text-on-surface-variant leading-relaxed font-sans font-medium whitespace-pre-line">
                  {selected.physical_characteristics}
                </p>
              </section>
            )}

            {/* Ekologi Lingkungan & Perilaku */}
            <section className="bg-tropic-50 p-6 border-2 border-tropic-700 rounded-xl hard-shadow-sm space-y-4">
              <h2 className="font-serif text-xl font-black text-tropic-900 flex items-center gap-2 border-b border-tropic-200 pb-2">
                <Leaf className="w-5 h-5 text-tropic-700" /> Ekologi, Habitat & Perilaku
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-sans text-tropic-800 font-medium">
                {selected.habitat && (
                  <div className="bg-background/40 p-3 rounded-lg border border-tropic-200">
                    <strong className="block text-[10px] uppercase font-black tracking-wide text-tropic-900 mb-1">Habitat Utama:</strong>
                    {selected.habitat}
                  </div>
                )}
                {selected.diet && (
                  <div className="bg-background/40 p-3 rounded-lg border border-tropic-200">
                    <strong className="block text-[10px] uppercase font-black tracking-wide text-tropic-900 mb-1">Rantai Makanan/Diet:</strong>
                    {selected.diet}
                  </div>
                )}
                {selected.behavior && (
                  <div className="bg-background/40 p-3 rounded-lg border border-tropic-200">
                    <strong className="block text-[10px] uppercase font-black tracking-wide text-tropic-900 mb-1">Pola Perilaku:</strong>
                    {selected.behavior}
                  </div>
                )}
                {selected.distribution && (
                  <div className="md:col-span-2 bg-background/60 p-3 rounded-lg border border-tropic-300 font-bold">
                    <strong className="block text-[10px] uppercase font-black tracking-wide text-tropic-900 mb-1">Peta Sebaran Ringkas di Kawasan Obi:</strong>
                    {selected.distribution}
                  </div>
                )}
              </div>
            </section>

            {/* Galeri Foto Tambahan */}
            {gallery.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-serif text-xl font-black text-on-surface flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" /> Koleksi Gambar Dokumentasi Lapangan
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="bg-background p-2 border-2 border-on-surface rounded-xl hard-shadow-sm group hover:-translate-y-0.5 transition-transform duration-150"
                    >
                      <div className="relative h-40 bg-surface-container-high rounded-lg overflow-hidden">
                        <Image
                          src={item.url}
                          alt={`${selected.name_local} dokumentasi ${i + 1}`}
                          fill
                          className="object-cover group-hover:scale-102 transition-transform duration-200"
                          sizes="(max-width: 768px) 50vw, 33vw"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-on-surface-variant space-y-2 py-20">
            <HelpCircle className="w-12 h-12 opacity-30 stroke-[1.5]" />
            <p className="font-serif text-lg font-bold">Tidak Ada Spesimen Terpilih</p>
            <p className="text-sm">Silakan pilih salah satu entitas taksa fauna pada daftar menu navigasi sebelah kiri.</p>
          </div>
        )}
      </main>

    </div>
  );
}

export default function FaunaObiPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-natural-paper font-serif font-bold text-on-surface">
        Menyiapkan Lembar Arsip Fauna...
      </div>
    }>
      <FaunaContent />
    </Suspense>
  );
}