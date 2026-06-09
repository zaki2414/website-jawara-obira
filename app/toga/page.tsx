"use client";

import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

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

export default function TogaPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch semua tanaman
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

  const selectedPlant = useMemo(() => {
    const slug = searchParams.get("plant");
    if (slug && plants.length > 0) {
      return plants.find((p) => p.slug === slug) || null;
    }
    if (plants.length > 0) return plants[0];
    return null;
  }, [searchParams, plants]);

  const handleSelectPlant = (slug: string) => {
    router.push(`/toga?plant=${slug}`, { scroll: false });
  };

  return (
    <div className="flex min-h-screen bg-sand-50">
      {/* Sidebar - List Tanaman */}
      <aside className="w-72 bg-white border-r border-sand-200 p-6 overflow-y-auto fixed h-full">
        <h2 className="font-serif text-xl font-bold text-ocean-800 mb-6">
          🌿 Daftar Tanaman
        </h2>

        {loading ? (
          <p className="text-sm text-gray-500">Memuat...</p>
        ) : (
          <ul className="space-y-2">
            {plants.map((plant) => (
              <li key={plant.id}>
                <button
                  onClick={() => handleSelectPlant(plant.slug)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all ${
                    selectedPlant?.slug === plant.slug
                      ? "bg-ocean-600 text-ocean-600 shadow-md"
                      : "bg-sand-50 hover:bg-sand-100 text-gray-700"
                  }`}
                >
                  <div className="font-semibold">{plant.name_id}</div>
                  {plant.name_latin && (
                    <div className="text-xs opacity-75 mt-0.5">
                      {plant.name_latin}
                    </div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* Main Content - Detail Tanaman */}
      <main className="flex-1 ml-72 p-8 overflow-y-auto">
        {selectedPlant ? (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-4xl font-serif font-bold text-ocean-800 mb-2">
                {selectedPlant.name_id}
              </h1>
              <p className="text-base text-gray-500 italic">
                {selectedPlant.name_latin}
              </p>
            </div>

            {/* Thumbnail */}
            {selectedPlant.thumbnail_url && (
              <div className="relative w-full h-80 bg-gray-200 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={selectedPlant.thumbnail_url}
                  alt={selectedPlant.name_id}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Description */}
            {selectedPlant.description && (
              <section className="bg-white p-6 rounded-xl shadow-sm border border-sand-200">
                <h2 className="font-serif text-xl font-bold text-ocean-800 mb-3 flex items-center gap-2">
                  📖 Penjelasan
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {selectedPlant.description}
                </p>
              </section>
            )}

            {/* Health Benefits */}
            {selectedPlant.health_benefits &&
              selectedPlant.health_benefits.length > 0 && (
                <section className="bg-white p-6 rounded-xl shadow-sm border border-sand-200">
                  <h2 className="font-serif text-xl font-bold text-ocean-800 mb-4 flex items-center gap-2">
                    💚 Manfaat Kesehatan
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPlant.health_benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-gray-700"
                      >
                        <span className="text-tropic-600 text-lg">✓</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

            {/* Traditional Recipes */}
            {selectedPlant.recipes && (
              (() => {
                const recipeList = typeof selectedPlant.recipes === "string"
                  ? JSON.parse(selectedPlant.recipes)
                  : selectedPlant.recipes;

                if (!Array.isArray(recipeList) || recipeList.length === 0) return null;

                return (
                  <section className="bg-white p-6 rounded-xl shadow-sm border border-sand-200">
                    <h2 className="font-serif text-xl font-bold text-ocean-800 mb-4 flex items-center gap-2">
                      🍵 Resep Tradisional
                    </h2>
                    <div className="space-y-6">
                      {recipeList.map((recipe: any, i: number) => (
                        <div
                          key={i}
                          className="border-b border-sand-200 last:border-0 pb-6 last:pb-0"
                        >
                          <h3 className="font-bold font-serif text-xl text-ocean-700 mb-3">
                            Resep {recipe.title}
                          </h3>

                          {/* Ingredients */}
                          <div className="mb-3">
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">
                              Bahan-bahan:
                            </h4>
                            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                              {recipe.ingredients
                                ?.filter((ing: string) => ing.trim())
                                .map((ing: string, j: number) => (
                                  <li key={j}>{ing}</li>
                                ))}
                            </ul>
                          </div>

                          {/* Steps */}
                          <div>
                            <h4 className="font-semibold text-sm text-gray-700 mb-2">
                              Langkah:
                            </h4>
                            <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                              {recipe.steps
                                ?.filter((step: string) => step.trim())
                                .map((step: string, j: number) => (
                                  <li key={j}>{step}</li>
                                ))}
                            </ol>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                );
              })()
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            {loading ? (
              <p className="text-lg">Memuat data tanaman...</p>
            ) : (
              <p className="text-lg">
                Pilih tanaman dari sidebar untuk melihat detail
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
