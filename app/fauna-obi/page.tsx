// app/fauna-obi/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

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

// Warna badge IUCN
const getIucnColor = (status?: string) => {
  const colors: Record<string, string> = {
    LC: "bg-green-100 text-green-800",
    NT: "bg-yellow-100 text-yellow-800",
    VU: "bg-orange-100 text-orange-800",
    EN: "bg-red-100 text-red-800",
    CR: "bg-red-200 text-red-900",
  };
  return colors[status || ""] || "bg-gray-100 text-gray-800";
};

export default function FaunaObiPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [faunas, setFaunas] = useState<Fauna[]>([]);
  const [selected, setSelected] = useState<Fauna | null>(null);
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

  useEffect(() => {
    const slug = searchParams.get("fauna");
    if (slug && faunas.length > 0) {
      setSelected(faunas.find((f) => f.slug === slug) || null);
    } else if (faunas.length > 0 && !slug) {
      setSelected(faunas[0]);
    }
  }, [searchParams, faunas]);

  const handleSelect = (slug: string) => {
    router.push(`/fauna-obi?fauna=${slug}`, { scroll: false });
  };

  const gallery = selected ? parseJsonField(selected.documentations) : [];

  return (
    <div className="flex min-h-screen bg-sand-50">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-sand-200 p-6 overflow-y-auto fixed h-full">
        <h2 className="font-serif text-xl font-bold text-ocean-800 mb-6">
          🦎 Fauna Obi
        </h2>
        {loading ? (
          <p className="text-sm text-gray-500">Memuat...</p>
        ) : (
          <ul className="space-y-2">
            {faunas.map((f) => (
              <li key={f.id}>
                <button
                  onClick={() => handleSelect(f.slug)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                    selected?.slug === f.slug
                      ? "bg-ocean-600 text-ocean-600 shadow-md"
                      : "bg-sand-50 hover:bg-sand-100 text-gray-700"
                  }`}
                >
                  <div className="font-semibold">{f.name_local}</div>
                  <div className="text-xs opacity-75 mt-0.5 italic">
                    {f.name_scientific}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-72 p-8 overflow-y-auto">
        {selected ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-serif font-bold text-ocean-800 mb-2">
                {selected.name_local}
              </h1>
              <p className="text-xl text-gray-500 italic mb-4">
                {selected.name_scientific}
              </p>
              {selected.iucn_status && (
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getIucnColor(selected.iucn_status)}`}
                >
                  Status IUCN: {selected.iucn_status}
                </span>
              )}
            </div>

            {/* Thumbnail */}
            {selected.thumbnail_url && (
              <div className="relative w-full h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={selected.thumbnail_url}
                  alt={selected.name_local}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                />
              </div>
            )}

            {/* Info Box (Klasifikasi & Konservasi) */}
            <section className="bg-white p-6 rounded-xl shadow-sm border border-sand-200">
              <h2 className="font-serif text-xl font-bold text-ocean-800 mb-4">
                📋 Informasi Dasar
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {selected.class && (
                  <div>
                    <strong>Kelas:</strong> {selected.class}
                  </div>
                )}
                {selected.order_name && (
                  <div>
                    <strong>Ordo:</strong> {selected.order_name}
                  </div>
                )}
                {selected.family && (
                  <div>
                    <strong>Famili:</strong> {selected.family}
                  </div>
                )}
                {selected.conservation_notes && (
                  <div className="md:col-span-2">
                    <strong>Catatan Konservasi:</strong>{" "}
                    {selected.conservation_notes}
                  </div>
                )}
              </div>
            </section>

            {/* Description */}
            {selected.description && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-sand-200">
                <h2 className="font-serif text-xl font-bold text-ocean-800 mb-3">
                  📖 Deskripsi
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selected.description}
                </p>
              </section>
            )}

            {/* Physical Characteristics */}
            {selected.physical_characteristics && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-sand-200">
                <h2 className="font-serif text-xl font-bold text-ocean-800 mb-3">
                  {" "}
                  Ciri-ciri Fisik
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {selected.physical_characteristics}
                </p>
              </section>
            )}

            {/* Ecology */}
            <section className="bg-tropic-50 p-6 rounded-xl border border-tropic-200">
              <h2 className="font-serif text-xl font-bold text-tropic-800 mb-4">
                🌿 Ekologi & Perilaku
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-tropic-700">
                {selected.habitat && (
                  <div>
                    <strong>Habitat:</strong> {selected.habitat}
                  </div>
                )}
                {selected.diet && (
                  <div>
                    <strong>Makanan:</strong> {selected.diet}
                  </div>
                )}
                {selected.behavior && (
                  <div>
                    <strong>Perilaku:</strong> {selected.behavior}
                  </div>
                )}
                {selected.distribution && (
                  <div className="md:col-span-2">
                    <strong>Sebaran di Obi:</strong> {selected.distribution}
                  </div>
                )}
              </div>
            </section>

            {/* Gallery */}
            {gallery.length > 0 && (
              <section>
                <h2 className="font-serif text-xl font-bold text-ocean-800 mb-4">
                  📸 Galeri Foto
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {gallery.map((item: any, i: number) => (
                    <div
                      key={i}
                      className="relative h-40 bg-gray-200 rounded-lg overflow-hidden"
                    >
                      <Image
                        src={item.url}
                        alt={`${selected.name_local} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {loading ? <p>Memuat data...</p> : <p>Pilih fauna dari sidebar</p>}
          </div>
        )}
      </main>
    </div>
  );
}
