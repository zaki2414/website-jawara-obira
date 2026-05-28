// components/admin/UMKMForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import ImageUploader from "./ImageUploader";
import ExtraImageUploader from "./ExtraImageUploader";

type UMKMFormProps = { initialData?: any; isNew: boolean };
type Product = { catId: string; name: string };

export default function UMKMForm({ initialData, isNew }: UMKMFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");

  const [type, setType] = useState(initialData?.business_type || "toko");
  const [village, setVillage] = useState(initialData?.village_id || "");
  const [shortDesc, setShortDesc] = useState(
    initialData?.short_description || "",
  );
  const [fullDesc, setFullDesc] = useState(initialData?.full_description || "");
  const [locationText, setLocationText] = useState(
    initialData?.location_text || "",
  );
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail_url || "");

  const [features, setFeatures] = useState<string[]>(
    initialData?.features || [],
  );

  const [featuresInput, setFeaturesInput] = useState<string>(
    initialData?.features?.join(", ") || "",
  );

  const defaultGallery = initialData?.gallery || [];
  const [gallery, setGallery] = useState([
    {
      url: defaultGallery[0]?.url || "",
      caption: defaultGallery[0]?.caption || "",
    },
    {
      url: defaultGallery[1]?.url || "",
      caption: defaultGallery[1]?.caption || "",
    },
    {
      url: defaultGallery[2]?.url || "",
      caption: defaultGallery[2]?.caption || "",
    },
    {
      url: defaultGallery[3]?.url || "",
      caption: defaultGallery[3]?.caption || "",
    },
    {
      url: defaultGallery[4]?.url || "",
      caption: defaultGallery[4]?.caption || "",
    },
  ]);

  const [products, setProducts] = useState<Product[]>(
    initialData?.products || [],
  );

  const [categories, setCategories] = useState<any[]>([]);
  const [villages, setVillages] = useState<any[]>([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);

  useEffect(() => {
    if (!initialData?.slug && name) setSlug(generateSlug(name));
  }, [name, initialData?.slug]);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const [catsRes, villagesRes] = await Promise.all([
        supabase.from("umkm_categories").select("id, name, icon").order("name"),
        supabase.from("villages").select("id, name, slug").order("name"),
      ]);

      if (catsRes.data) setCategories(catsRes.data);
      if (villagesRes.data) setVillages(villagesRes.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!isNew && initialData) {
      if (initialData.village_id) setVillage(initialData.village_id);
    }
  }, [initialData, isNew]);

  const resetForm = () => {
    setName("");
    setSlug("");
    setShortDesc("");
    setFullDesc("");
    setLocationText("");
    setThumbnail("");
    setFeatures([]);
    setFeaturesInput("");
    setVillage("");
    setGallery([
      { url: "", caption: "" },
      { url: "", caption: "" },
      { url: "", caption: "" },
      { url: "", caption: "" },
      { url: "", caption: "" },
    ]);
    setProducts([]);
    setFormKey((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !type)
      return setMessage({
        type: "error",
        text: "Nama dan Jenis Usaha wajib diisi.",
      });

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      const umkmPayload = {
        name,
        slug,
        business_type: type,
        village_id: village || null,
        short_description: shortDesc,
        full_description: fullDesc,
        location_text: locationText,
        thumbnail_url: thumbnail || null,
      };

      let umkmId = initialData?.id;

      if (isNew) {
        const { data, error } = await supabase
          .from("umkm")
          .insert(umkmPayload)
          .select()
          .single();
        if (error) throw error;
        umkmId = data.id;
        console.log("✅ UMKM created with ID:", umkmId);
      } else {
        const { error } = await supabase
          .from("umkm")
          .update(umkmPayload)
          .eq("id", umkmId);
        if (error) throw error;
        console.log("✅ UMKM updated:", umkmId);

        await supabase.from("umkm_features").delete().eq("umkm_id", umkmId);
        await supabase.from("umkm_gallery").delete().eq("umkm_id", umkmId);
        await supabase.from("umkm_products").delete().eq("umkm_id", umkmId);
        await supabase
          .from("umkm_category_items")
          .delete()
          .eq("umkm_id", umkmId);
      }

      if (features.length > 0) {
        const featuresPayload = features
          .filter((f) => f.trim())
          .map((f) => ({ umkm_id: umkmId, feature: f.trim() }));
        if (featuresPayload.length > 0) {
          const { error } = await supabase
            .from("umkm_features")
            .insert(featuresPayload);
          if (error) console.warn("⚠️ Features insert warning:", error);
        }
      }

      const galleryWithImages = gallery
        .filter((g) => g.url?.trim())
        .map((g, i) => ({
          umkm_id: umkmId,
          image_url: g.url,
          caption: g.caption?.trim() || null,
          sort_order: i,
        }));
      if (galleryWithImages.length > 0) {
        const { error } = await supabase
          .from("umkm_gallery")
          .insert(galleryWithImages);
        if (error) console.warn("⚠️ Gallery insert warning:", error);
      }

      const validProducts = products.filter((p) => p.name?.trim());
      if (validProducts.length > 0) {
        const productsPayload = validProducts.map((p) => ({
          umkm_id: umkmId,
          category_id: p.catId || null,
          item_name: p.name.trim(),
        }));
        const { error: prodError } = await supabase
          .from("umkm_products")
          .insert(productsPayload);
        if (prodError) console.warn("⚠️ Products insert warning:", prodError);

        const uniqueCatIds = [
          ...new Set(
            validProducts
              .map((p) => p.catId)
              .filter((id): id is string => !!id),
          ),
        ];
        if (uniqueCatIds.length > 0) {
          const mappingPayload = uniqueCatIds.map((catId) => ({
            umkm_id: umkmId,
            category_id: catId,
          }));
          const { error: mapError } = await supabase
            .from("umkm_category_items")
            .insert(mappingPayload);
          if (mapError)
            console.warn("⚠️ Category mapping insert warning:", mapError);
        }
      }

      setMessage({
        type: "success",
        text: `✅ UMKM ${isNew ? "ditambahkan" : "diperbarui"}!`,
      });
      setShowSuccess(true);

      if (isNew) {
        resetForm();
      } else {
        setTimeout(() => router.push("/admin/umkm"), 1500);
      }
    } catch (err: any) {
      console.error("❌ Submit error:", err);
      setMessage({ type: "error", text: `❌ Gagal: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = () => setProducts([...products, { catId: "", name: "" }]);

  const updateProduct = (i: number, field: keyof Product, val: string) => {
    setProducts((prev) => {
      const newP = [...prev];
      newP[i] = { ...newP[i], [field]: val };
      return newP;
    });
  };

  const removeProduct = (i: number) =>
    setProducts(products.filter((_, idx) => idx !== i));

  const handleGalleryImageChange = (
    index: number,
    url: string,
    caption: string,
  ) => {
    const newGallery = [...gallery];
    newGallery[index] = { url, caption };
    setGallery(newGallery);
  };

  const handleSlugChange = (value: string) => {
    setSlug(generateSlug(value));
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

      {/* Form Fields Utama */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nama UMKM *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Slug *</label>
          <input
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-500 font-mono text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Jenis Usaha *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-500"
          >
            <option value="toko">Toko / Warung Kelontong</option>
            <option value="warung_makan">Warung Makan</option>
            <option value="hasil_laut">Hasil Laut</option>
            <option value="jasa">Jasa</option>
            <option value="kerajinan">Kerajinan</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Desa</label>
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-500"
          >
            <option value="">Umum / Tidak Spesifik</option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          {villages.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">Memuat data desa...</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Lokasi Singkat</label>
        <input
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          placeholder="Contoh: dekat pelabuhan"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Deskripsi Singkat (untuk card)
        </label>
        <textarea
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          rows={2}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Cerita Lengkap / Tentang
        </label>
        <textarea
          value={fullDesc}
          onChange={(e) => setFullDesc(e.target.value)}
          rows={4}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-500"
        />
      </div>

      {/* Thumbnail */}
      <div className="border-t border-sand-200 pt-4">
        <h3 className="font-medium mb-2">Thumbnail Utama</h3>
        <ImageUploader
          key={`thumb-${formKey}`}
          value={thumbnail}
          onChange={setThumbnail}
          label="Foto Cover"
        />
      </div>

      {/* Features */}
      <div className="border-t border-sand-200 pt-4">
        <h3 className="font-medium mb-2">✨ Highlight / Badge</h3>
        <p className="text-xs text-gray-500 mb-2">Pisahkan dengan koma (,)</p>
        <input
          type="text"
          value={featuresInput}
          onChange={(e) => {
            const txt = e.target.value;
            setFeaturesInput(txt);

            const arrayResult = txt
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean);
            setFeatures(arrayResult);
          }}
          onBlur={() => {
            setFeaturesInput(features.join(", "));
          }}
          placeholder="buka malam, token listrik, dekat pelabuhan"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-ocean-500"
        />
      </div>

      {/* Products */}
      <div className="border-t border-sand-200 pt-4">
        <h3 className="font-medium mb-2">📦 Daftar Barang/Jasa</h3>
        {categories.length === 0 && (
          <p className="text-xs text-gray-400 mb-2">Memuat kategori...</p>
        )}
        <div className="space-y-2">
          {products.map((p, i) => (
            <div key={i} className="flex gap-2">
              <select
                value={p.catId}
                onChange={(e) => updateProduct(i, "catId", e.target.value)}
                className="w-1/3 p-2 border rounded-lg text-sm bg-white"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
              <input
                value={p.name}
                onChange={(e) => updateProduct(i, "name", e.target.value)}
                placeholder="Nama barang (misal: Beras 5kg)"
                className="flex-1 p-2 border rounded-lg text-sm"
              />
              <button
                type="button"
                onClick={() => removeProduct(i)}
                className="px-3 text-red-600 hover:bg-red-50 rounded"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addProduct}
            className="text-sm text-ocean-600 hover:underline"
          >
            + Tambah Barang
          </button>
        </div>
      </div>

      {/* Gallery */}
      <div className="border-t border-sand-200 pt-4">
        <h3 className="font-medium mb-2">📸 Galeri UMKM (Maks 5 Foto)</h3>
        <p className="text-xs text-gray-500 mb-4">
          Tambahkan foto-foto UMKM untuk galeri.
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {gallery.map((img, idx) => (
            <ExtraImageUploader
              key={`umkm-gallery-${idx}-${formKey}`}
              slotNumber={idx + 1}
              value={img.url}
              caption={img.caption}
              onChange={(url, caption) =>
                handleGalleryImageChange(idx, url, caption)
              }
            />
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
          {loading ? "Menyimpan..." : isNew ? "📤 Simpan UMKM" : "💾 Update"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Batal
        </button>
      </div>

      {/* Toast Success */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center gap-2">
          <span>✅</span>
          <span>UMKM berhasil {isNew ? "ditambahkan" : "diperbarui"}!</span>
        </div>
      )}
    </form>
  );
}
