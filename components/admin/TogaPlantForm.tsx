// components/admin/TogaPlantForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import ImageUploader from "./ImageUploader";

type TogaPlantFormProps = {
  initialData?: any;
  isNew: boolean;
};

export default function TogaPlantForm({
  initialData,
  isNew,
}: TogaPlantFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formKey, setFormKey] = useState(0);

  // Form state
  const [nameId, setNameId] = useState(initialData?.name_id || "");
  const [nameLatin, setNameLatin] = useState(initialData?.name_latin || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [healthBenefits, setHealthBenefits] = useState<string[]>(
    initialData?.health_benefits || [],
  );
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData?.thumbnail_url || "",
  );

  // Recipes state
  const [recipes, setRecipes] = useState<any[]>(
    initialData?.recipes || [{ title: "", ingredients: [""], steps: [""] }],
  );

  // ✅ FIX: Hapus useEffect untuk auto-generate slug

  // ✅ FIX: Pindahkan logika auto-generate slug ke event handler
  const handleNameIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setNameId(newName);
    if (isNew && !initialData?.slug) {
      setSlug(generateSlug(newName));
    }
  };

  // Recipe handlers
  const addRecipe = () =>
    setRecipes([...recipes, { title: "", ingredients: [""], steps: [""] }]);
  const updateRecipe = (i: number, field: string, val: string) => {
    const newRecipes = [...recipes];
    newRecipes[i] = { ...newRecipes[i], [field]: val };
    setRecipes(newRecipes);
  };
  const addIngredient = (recipeIdx: number) => {
    const newRecipes = [...recipes];
    newRecipes[recipeIdx].ingredients.push("");
    setRecipes(newRecipes);
  };
  const updateIngredient = (recipeIdx: number, ingIdx: number, val: string) => {
    const newRecipes = [...recipes];
    newRecipes[recipeIdx].ingredients[ingIdx] = val;
    setRecipes(newRecipes);
  };
  const removeIngredient = (recipeIdx: number, ingIdx: number) => {
    const newRecipes = [...recipes];
    newRecipes[recipeIdx].ingredients = newRecipes[
      recipeIdx
    ].ingredients.filter((_: any, i: number) => i !== ingIdx);
    setRecipes(newRecipes);
  };
  const addStep = (recipeIdx: number) => {
    const newRecipes = [...recipes];
    newRecipes[recipeIdx].steps.push("");
    setRecipes(newRecipes);
  };
  const updateStep = (recipeIdx: number, stepIdx: number, val: string) => {
    const newRecipes = [...recipes];
    newRecipes[recipeIdx].steps[stepIdx] = val;
    setRecipes(newRecipes);
  };
  const removeStep = (recipeIdx: number, stepIdx: number) => {
    const newRecipes = [...recipes];
    newRecipes[recipeIdx].steps = newRecipes[recipeIdx].steps.filter(
      (_: any, i: number) => i !== stepIdx,
    );
    setRecipes(newRecipes);
  };
  const removeRecipe = (i: number) =>
    setRecipes(recipes.filter((_, idx) => idx !== i));

  const addBenefit = () => setHealthBenefits([...healthBenefits, ""]);
  const updateBenefit = (i: number, val: string) => {
    const newBenefits = [...healthBenefits];
    newBenefits[i] = val;
    setHealthBenefits(newBenefits);
  };
  const removeBenefit = (i: number) =>
    setHealthBenefits(healthBenefits.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameId || !nameLatin) {
      return setMessage({
        type: "error",
        text: "Nama Indonesia dan Latin wajib diisi.",
      });
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // ✅ Payload disesuaikan dengan struktur database aslimu
      const payload = {
        name_id: nameId,
        name_latin: nameLatin,
        slug,
        description,
        health_benefits: healthBenefits.filter((b) => b.trim()),
        thumbnail_url: thumbnailUrl || null,
        recipes: recipes.filter((r) => r.title.trim()),
      };

      if (isNew) {
        const { error } = await supabase.from("toga_plants").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("toga_plants")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
      }

      setMessage({
        type: "success",
        text: `✅ Tanaman berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`,
      });

      // ✅ Tambahkan router.refresh() agar list otomatis update
      setTimeout(() => {
        router.refresh();
        if (isNew) router.push("/admin/toga");
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: `❌ Gagal: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-sand-200 space-y-6"
    >
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      {/* Nama */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Indonesia *
          </label>
          <input
            type="text"
            value={nameId}
            onChange={handleNameIdChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
            placeholder="Jahe"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Latin *
          </label>
          <input
            type="text"
            value={nameLatin}
            onChange={(e) => setNameLatin(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 italic"
            placeholder="Zingiber officinale"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 font-mono text-sm"
            placeholder="jahe"
          />
        </div>
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Thumbnail
        </label>
        <ImageUploader
          key={`toga-thumb-${formKey}`}
          value={thumbnailUrl}
          onChange={setThumbnailUrl}
          label="Upload Foto Utama"
        />
      </div>

      {/* Deskripsi */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi Lengkap
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
          placeholder="Penjelasan lengkap tentang tanaman..."
        />
      </div>

      {/* Manfaat Kesehatan */}
      <div className="border-t border-sand-200 pt-4">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Manfaat Kesehatan
          </label>
          <button
            type="button"
            onClick={addBenefit}
            className="text-sm text-ocean-600 hover:underline"
          >
            + Tambah Manfaat
          </button>
        </div>
        <div className="space-y-2">
          {healthBenefits.map((benefit, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(i, e.target.value)}
                placeholder="Contoh: Membantu pencernaan"
                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => removeBenefit(i)}
                className="px-3 text-red-600 hover:bg-red-50 rounded"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Traditional Recipes */}
      <div className="border-t border-sand-200 pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg font-bold text-ocean-800">
            🍵 Resep Tradisional
          </h3>
          <button
            type="button"
            onClick={addRecipe}
            className="text-sm text-ocean-600 hover:underline font-medium"
          >
            + Tambah Resep
          </button>
        </div>

        <div className="space-y-6">
          {recipes.map((recipe, recipeIdx) => (
            <div
              key={recipeIdx}
              className="p-4 bg-sand-50 rounded-xl border border-sand-200 relative"
            >
              <button
                type="button"
                onClick={() => removeRecipe(recipeIdx)}
                className="absolute top-2 right-2 text-red-600 hover:bg-red-50 p-1 rounded"
                title="Hapus resep"
              >
                ✕
              </button>

              <div className="mb-4 pr-8">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Resep
                </label>
                <input
                  type="text"
                  value={recipe.title}
                  onChange={(e) =>
                    updateRecipe(recipeIdx, "title", e.target.value)
                  }
                  placeholder="Contoh: Wedang Jahe"
                  className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Bahan-bahan
                  </label>
                  <button
                    type="button"
                    onClick={() => addIngredient(recipeIdx)}
                    className="text-xs text-ocean-600 hover:underline"
                  >
                    + Tambah Bahan
                  </button>
                </div>
                <div className="space-y-2">
                  {recipe.ingredients.map(
                    (ingredient: string, ingIdx: number) => (
                      <div key={ingIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={ingredient}
                          onChange={(e) =>
                            updateIngredient(recipeIdx, ingIdx, e.target.value)
                          }
                          placeholder="Contoh: 200 g jahe"
                          className="flex-1 p-2 border border-gray-300 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeIngredient(recipeIdx, ingIdx)}
                          className="text-red-600 hover:bg-red-50 px-2 rounded"
                        >
                          ✕
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Langkah Pembuatan
                  </label>
                  <button
                    type="button"
                    onClick={() => addStep(recipeIdx)}
                    className="text-xs text-ocean-600 hover:underline"
                  >
                    + Tambah Langkah
                  </button>
                </div>
                <div className="space-y-2">
                  {recipe.steps.map((step: string, stepIdx: number) => (
                    <div key={stepIdx} className="flex gap-2">
                      <span className="text-sm font-medium text-gray-500 w-6">
                        {stepIdx + 1}.
                      </span>
                      <textarea
                        value={step}
                        onChange={(e) =>
                          updateStep(recipeIdx, stepIdx, e.target.value)
                        }
                        placeholder="Langkah..."
                        rows={2}
                        className="flex-1 p-2 border border-gray-300 rounded text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => removeStep(recipeIdx, stepIdx)}
                        className="text-red-600 hover:bg-red-50 px-2 rounded"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-sand-200">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : isNew ? "📤 Simpan Tanaman" : "💾 Update"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
