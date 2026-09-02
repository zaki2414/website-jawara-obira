// components/admin/TogaPlantForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertCircle, Save, Plus, X, Eye, Sprout } from "lucide-react";
import { parseTogaRecipes, type TogaPlant, type TogaRecipe } from "@/constants/toga";
import ImageUploader from "./ImageUploader";
import { TOGA_ACCENT_BORDERS } from "./toga/togaCardStyles";

type TogaPlantFormProps = {
  initialData?: TogaPlant | null;
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
  const [showSuccess, setShowSuccess] = useState(false);
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
  const defaultRecipes = parseTogaRecipes(initialData?.recipes);
  const [recipes, setRecipes] = useState<TogaRecipe[]>(
    defaultRecipes.length > 0
      ? defaultRecipes
      : [{ title: "", ingredients: [""], steps: [""] }],
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
  const updateRecipe = (i: number, field: "title", val: string) => {
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
    ].ingredients.filter((_, i) => i !== ingIdx);
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
      (_, i) => i !== stepIdx,
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
          .eq("id", initialData!.id);
        if (error) throw error;
      }

      setMessage({
        type: "success",
        text: `Tanaman berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`,
      });
      setShowSuccess(true);

      // ✅ Tambahkan router.refresh() agar list otomatis update
      setTimeout(() => {
        router.refresh();
        if (isNew) router.push("/admin/toga");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setMessage({ type: "error", text: `Gagal: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2"
      >
      {message && (
        <div
          role="alert"
          className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-bold ${message.type === "success" ? "bg-success/10 border-success text-success" : "bg-error-container border-error text-error"}`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          )}
          {message.text}
        </div>
      )}

      {/* Nama */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
            Nama Indonesia *
          </label>
          <input
            type="text"
            value={nameId}
            onChange={handleNameIdChange}
            required
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Jahe"
          />
        </div>
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
            Nama Latin *
          </label>
          <input
            type="text"
            value={nameLatin}
            onChange={(e) => setNameLatin(e.target.value)}
            required
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary italic"
            placeholder="Zingiber officinale"
          />
        </div>
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
            Slug *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            required
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="jahe"
          />
        </div>
      </div>

      {/* Thumbnail */}
      <div>
        <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
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
        <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
          Deskripsi Lengkap
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
          className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          placeholder="Penjelasan lengkap tentang tanaman..."
        />
      </div>

      {/* Manfaat Kesehatan */}
      <div className="border-t-2 border-dashed border-outline-variant pt-4">
        <div className="flex justify-between items-center mb-3">
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Manfaat Kesehatan
          </label>
          <Button type="button" variant="ghost" size="sm" onClick={addBenefit}>
            <Plus className="size-3.5" aria-hidden="true" />
            Tambah Manfaat
          </Button>
        </div>
        <div className="space-y-2">
          {healthBenefits.map((benefit, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(i, e.target.value)}
                placeholder="Contoh: Membantu pencernaan"
                className="flex-1 p-2 border-2 border-on-surface rounded-lg text-sm bg-background text-on-surface"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeBenefit(i)}
                aria-label={`Hapus manfaat ${i + 1}`}
                className="text-error hover:text-error hover:bg-error-container/20"
              >
                <X className="size-4" aria-hidden="true" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Traditional Recipes */}
      <div className="border-t-2 border-dashed border-outline-variant pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-serif text-lg font-black text-on-surface">
            Resep Tradisional
          </h3>
          <Button type="button" variant="ghost" size="sm" onClick={addRecipe}>
            <Plus className="size-3.5" aria-hidden="true" />
            Tambah Resep
          </Button>
        </div>

        <div className="space-y-6">
          {recipes.map((recipe, recipeIdx) => (
            <div
              key={recipeIdx}
              className="p-4 bg-surface-container-low rounded-xl border-2 border-outline-variant relative"
            >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRecipe(recipeIdx)}
                aria-label={`Hapus resep ${recipeIdx + 1}`}
                className="absolute top-2 right-2 text-error hover:text-error hover:bg-error-container/20"
              >
                <X className="size-4" aria-hidden="true" />
              </Button>

              <div className="mb-4 pr-12">
                <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
                  Nama Resep
                </label>
                <input
                  type="text"
                  value={recipe.title}
                  onChange={(e) =>
                    updateRecipe(recipeIdx, "title", e.target.value)
                  }
                  placeholder="Contoh: Wedang Jahe"
                  className="w-full p-2 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm"
                />
              </div>

              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
                    Bahan-bahan
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addIngredient(recipeIdx)}
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                    Tambah Bahan
                  </Button>
                </div>
                <div className="space-y-2">
                  {recipe.ingredients.map((ingredient, ingIdx) => (
                    <div key={ingIdx} className="flex gap-2">
                      <input
                        type="text"
                        value={ingredient}
                        onChange={(e) =>
                          updateIngredient(recipeIdx, ingIdx, e.target.value)
                        }
                        placeholder="Contoh: 200 g jahe"
                        className="flex-1 p-2 border-2 border-on-surface rounded-lg text-sm bg-background text-on-surface"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(recipeIdx, ingIdx)}
                        aria-label={`Hapus bahan ${ingIdx + 1}`}
                        className="text-error hover:text-error hover:bg-error-container/20"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
                    Langkah Pembuatan
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => addStep(recipeIdx)}
                  >
                    <Plus className="size-3.5" aria-hidden="true" />
                    Tambah Langkah
                  </Button>
                </div>
                <div className="space-y-2">
                  {recipe.steps.map((step, stepIdx) => (
                    <div key={stepIdx} className="flex gap-2">
                      <span className="text-sm font-bold text-on-surface-variant w-6 pt-2">
                        {stepIdx + 1}.
                      </span>
                      <textarea
                        value={step}
                        onChange={(e) =>
                          updateStep(recipeIdx, stepIdx, e.target.value)
                        }
                        placeholder="Langkah..."
                        rows={2}
                        className="flex-1 p-2 border-2 border-on-surface rounded-lg text-sm bg-background text-on-surface"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(recipeIdx, stepIdx)}
                        aria-label={`Hapus langkah ${stepIdx + 1}`}
                        className="text-error hover:text-error hover:bg-error-container/20"
                      >
                        <X className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t-2 border-dashed border-outline-variant">
        <Button type="submit" variant="cream" loading={loading}>
          {!loading && <Save className="size-4" aria-hidden="true" />}
          {isNew ? "Simpan Tanaman" : "Update Tanaman"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
      </form>

      {/* Pratinjau kartu — mencerminkan tampilan ensiklopedia toga secara
          langsung sambil admin mengisi form, dibungkus sticky supaya tetap
          terlihat saat scroll (pola sama dengan FaunaForm/CultureForm). */}
      <div className="lg:col-span-1">
        <div
          className={`overflow-hidden rounded-2xl border-4 bg-background hard-shadow-md lg:sticky lg:top-6 ${TOGA_ACCENT_BORDERS[0]}`}
        >
          <div className="flex items-center gap-2 border-b-2 border-on-surface bg-surface-container-low px-4 py-3">
            <Eye className="size-4 text-on-surface-variant" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Pratinjau Kartu
            </span>
          </div>

          <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={nameId || "Pratinjau tanaman obat"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <Sprout className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
            {healthBenefits.filter((b) => b.trim()).length > 0 && (
              <Badge variant="solid-cream" className="absolute right-2 top-2">
                {healthBenefits.filter((b) => b.trim()).length} Khasiat
              </Badge>
            )}
          </div>

          <div className="space-y-1 p-4">
            <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
              {nameId || "Nama Indonesia"}
            </h3>
            <p className="text-sm italic font-bold text-on-cream">
              {nameLatin || "Nama Latin"}
            </p>
            <p className="line-clamp-2 text-sm text-on-surface-variant">
              {description || "Deskripsi lengkap akan tampil di sini."}
            </p>
          </div>
        </div>
      </div>

      <Toast show={showSuccess} message={`Tanaman berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`} />
    </div>
  );
}
