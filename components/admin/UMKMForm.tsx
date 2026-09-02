// components/admin/UMKMForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { generateSlug, parseGmapsLocation } from "@/lib/utils";
import { formatBusinessType } from "@/constants/umkm";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ImageUploader from "./ImageUploader";
import ExtraImageUploader from "./ExtraImageUploader";
import { Sparkles, Package, Images, Upload, Save, X, Eye, Store, MapPin, CheckCircle2, AlertCircle, Home } from "lucide-react";
import type { UMKMPayload, UMKMGalleryPayload } from "@/lib/supabase/queries";
import { UMKM_ACCENT_BORDERS } from "./umkm/umkmCardStyles";
import BangunanPickerMapLoader from "./umkm/BangunanPickerMapLoader";
import type { VillageKey } from "@/constants/profil";

export type UMKMFormInitialData = UMKMPayload & {
  id: string;
  gallery: (UMKMGalleryPayload & { id: string })[];
  features: string[];
  categories: { category_id: string }[];
  products: { item_name: string; category_id: string | null }[];
};

type UMKMFormProps = { initialData?: UMKMFormInitialData | null; isNew: boolean };
type Product = { catId: string; name: string };
type UMKMCategory = { id: string; name: string; icon: string | null };
type Village = { id: string; name: string; slug: string };

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

  const [latitude, setLatitude] = useState<number | null>(
    initialData?.latitude ?? null,
  );
  const [longitude, setLongitude] = useState<number | null>(
    initialData?.longitude ?? null,
  );
  const [gmapsInput, setGmapsInput] = useState(
    initialData?.latitude != null && initialData?.longitude != null
      ? `${initialData.latitude}, ${initialData.longitude}`
      : "",
  );
  const [gmapsError, setGmapsError] = useState(false);
  const [gmapsResolving, setGmapsResolving] = useState(false);
  const [selectedBlok, setSelectedBlok] = useState<string | null>(null);

  const handleGmapsInputChange = (value: string) => {
    setGmapsInput(value);
    if (!value.trim()) {
      setLatitude(null);
      setLongitude(null);
      setGmapsError(false);
      return;
    }
    const parsed = parseGmapsLocation(value);
    if (parsed) {
      setLatitude(parsed.lat);
      setLongitude(parsed.lng);
      setGmapsError(false);
    } else {
      setLatitude(null);
      setLongitude(null);
      setGmapsError(true);
    }
  };

  // Link "Bagikan" dari Google Maps di HP berbentuk maps.app.goo.gl — URL-nya
  // sendiri TIDAK mengandung koordinat (baru muncul setelah redirect), jadi
  // parseGmapsLocation di atas pasti gagal untuk link ini. Baru dicoba
  // resolve ke server saat blur (bukan tiap ketik) supaya tidak fetch
  // berkali-kali sambil user masih mengetik/menempel.
  const handleGmapsInputBlur = async () => {
    if (latitude != null || !gmapsInput.trim().startsWith("http")) return;
    setGmapsResolving(true);
    try {
      const res = await fetch("/api/gmaps/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: gmapsInput.trim() }),
      });
      const result = await res.json();
      if (res.ok && result.lat != null && result.lng != null) {
        setLatitude(result.lat);
        setLongitude(result.lng);
        setGmapsError(false);
      } else {
        setGmapsError(true);
      }
    } catch {
      setGmapsError(true);
    } finally {
      setGmapsResolving(false);
    }
  };

  // Klik rumah di peta kadaster TETAP mengisi latitude/longitude yang sama
  // dengan field "Lokasi Google Maps" di atas — cuma cara mengisinya beda
  // (klik poligon rumah asli vs tempel link). Ini satu-satunya sumber
  // lokasi UMKM; tidak ada kolom feature_id terpisah, jadi hasil klik di
  // sini dijamin match ke poligon kadaster (bukan sekadar dekat/kira-kira
  // seperti pin Google Maps yang presisinya tidak terjamin).
  const handleBuildingSelect = ({ lat, lng, blok }: { lat: number; lng: number; blok: string | null }) => {
    setLatitude(lat);
    setLongitude(lng);
    setGmapsInput(`${lat}, ${lng}`);
    setGmapsError(false);
    setSelectedBlok(blok);
  };

  const [features, setFeatures] = useState<string[]>(
    initialData?.features || [],
  );

  const [featuresInput, setFeaturesInput] = useState<string>(
    initialData?.features?.join(", ") || "",
  );

  const defaultGallery = initialData?.gallery || [];
  const [gallery, setGallery] = useState(
    Array.from({ length: 5 }, (_, i) => ({
      url: defaultGallery[i]?.image_url || "",
      caption: defaultGallery[i]?.caption || "",
    })),
  );

  const [products, setProducts] = useState<Product[]>(
    initialData?.products?.map((p) => ({
      catId: p.category_id || "",
      name: p.item_name,
    })) || [],
  );

  const [categories, setCategories] = useState<UMKMCategory[]>([]);
  const [villages, setVillages] = useState<Village[]>([]);

  // "kawasi"/"soligi" dari villages.slug (bukan village_id UUID) — dipakai
  // BangunanPickerMapLoader untuk tahu geojson desa mana yang perlu
  // di-load. undefined kalau desa belum dipilih ATAU villages.slug bukan
  // salah satu dari dua desa yang punya data kadaster.
  const villageSlug = villages.find((v) => v.id === village)?.slug as VillageKey | undefined;
  const hasCadastralData = villageSlug === "kawasi" || villageSlug === "soligi";

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
    setGmapsInput("");
    setLatitude(null);
    setLongitude(null);
    setGmapsError(false);
    setGmapsResolving(false);
    setSelectedBlok(null);
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
        latitude,
        longitude,
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
        text: `UMKM ${isNew ? "ditambahkan" : "diperbarui"}!`,
      });
      setShowSuccess(true);

      if (isNew) {
        resetForm();
      } else {
        setTimeout(() => router.push("/admin/umkm"), 1500);
      }
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      console.error("Submit error:", err);
      setMessage({ type: "error", text: `Gagal: ${errMessage}` });
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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2"
      >
      {message && (
        <div
          role="alert"
          className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-bold ${message.type === "success" ? "bg-success/10 text-success border-success/30" : "bg-error-container text-error border-error/30"}`}
        >
          {message.text}
        </div>
      )}

      {/* Form Fields Utama */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">Nama UMKM *</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            required
          />
        </div>
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">Slug *</label>
          <input
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary font-mono text-sm"
            required
          />
        </div>
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
            Jenis Usaha *
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            <option value="toko">Toko / Warung Kelontong</option>
            <option value="warung_makan">Warung Makan</option>
            <option value="hasil_laut">Hasil Laut</option>
            <option value="jasa">Jasa</option>
            <option value="kerajinan">Kerajinan</option>
          </select>
        </div>
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">Desa</label>
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          >
            {villages.map((v) => (
              <option key={v.id} value={v.id}>
                {v.name}
              </option>
            ))}
          </select>
          {villages.length === 0 && (
            <p className="text-xs text-on-surface-variant/60 mt-1">Memuat data desa...</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">Lokasi Singkat</label>
        <input
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
          placeholder="Contoh: dekat pelabuhan"
          className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
          Lokasi Google Maps
        </label>
        <input
          value={gmapsInput}
          onChange={(e) => handleGmapsInputChange(e.target.value)}
          onBlur={handleGmapsInputBlur}
          placeholder="Tempel link share Google Maps, atau 'lat, lng'"
          className={`w-full p-3 border-2 rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 ${gmapsError ? "border-error focus:border-error" : "border-on-surface focus:border-primary"}`}
        />
        <p className="mt-1.5 flex items-center gap-1.5 text-xs">
          {gmapsResolving ? (
            <span className="text-on-surface-variant/60">Membuka link Google Maps...</span>
          ) : gmapsError ? (
            <span className="flex items-center gap-1 text-error">
              <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
              Link/koordinat tidak dikenali — coba link lengkap dari browser (bukan link pendek), atau koordinat &ldquo;lat, lng&rdquo;.
            </span>
          ) : latitude != null && longitude != null ? (
            <span className="flex items-center gap-1 text-success">
              <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
              Lokasi terbaca: {latitude.toFixed(6)}, {longitude.toFixed(6)}
            </span>
          ) : (
            <span className="text-on-surface-variant/60">
              Buka Google Maps → klik kanan lokasi → salin koordinat, atau bagikan link lokasinya ke sini.
            </span>
          )}
        </p>
        {latitude != null && longitude != null && (
          <div className="mt-2 h-40 overflow-hidden rounded-lg border-2 border-on-surface">
            <iframe
              title="Pratinjau lokasi Google Maps"
              src={`https://www.google.com/maps?q=${latitude},${longitude}&z=17&output=embed`}
              className="h-full w-full border-0"
              loading="lazy"
            />
          </div>
        )}
      </div>

      <div>
        <label className="mb-1.5 flex items-center gap-2 text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
          <Home className="size-4 shrink-0" aria-hidden="true" />
          Atau, Klik Rumah di Peta Kadaster
        </label>
        {hasCadastralData ? (
          <>
            <p className="mb-2 text-xs text-on-surface-variant/70">
              Lebih presisi dari link Google Maps — klik langsung menjamin lokasinya nyambung ke
              peta desa di web ini (halaman Profil).
            </p>
            <BangunanPickerMapLoader
              key={villageSlug}
              village={villageSlug as VillageKey}
              value={latitude != null && longitude != null ? { lat: latitude, lng: longitude } : null}
              onSelect={handleBuildingSelect}
            />
            {selectedBlok && (
              <p className="mt-1.5 flex items-center gap-1 text-xs text-success">
                <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                Bangunan terpilih — Blok/Dusun: {selectedBlok}
              </p>
            )}
          </>
        ) : (
          <p className="rounded-lg border-2 border-dashed border-outline-variant p-3 text-xs text-on-surface-variant/70">
            Pilih Desa (Kawasi/Soligi) dulu di atas untuk menampilkan peta kadaster.
          </p>
        )}
      </div>

      <div>
        <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
          Deskripsi Singkat (untuk card)
        </label>
        <textarea
          value={shortDesc}
          onChange={(e) => setShortDesc(e.target.value)}
          rows={2}
          className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>
      <div>
        <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
          Cerita Lengkap / Tentang
        </label>
        <textarea
          value={fullDesc}
          onChange={(e) => setFullDesc(e.target.value)}
          rows={4}
          className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Thumbnail */}
      <div className="border-t-2 border-dashed border-outline-variant pt-4">
        <h3 className="font-medium mb-2">Thumbnail Utama</h3>
        <ImageUploader
          key={`thumb-${formKey}`}
          value={thumbnail}
          onChange={setThumbnail}
          label="Foto Cover"
        />
      </div>

      {/* Features */}
      <div className="border-t-2 border-dashed border-outline-variant pt-4">
        <h3 className="font-black text-on-surface mb-2 flex items-center gap-2">
          <Sparkles className="size-4" aria-hidden="true" /> Highlight / Badge
        </h3>
        <p className="text-xs text-on-surface-variant mb-2">Pisahkan dengan koma (,)</p>
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
          className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {/* Products */}
      <div className="border-t-2 border-dashed border-outline-variant pt-4">
        <h3 className="font-black text-on-surface mb-2 flex items-center gap-2">
          <Package className="size-4" aria-hidden="true" /> Daftar Barang/Jasa
        </h3>
        {categories.length === 0 && (
          <p className="text-xs text-on-surface-variant/60 mb-2">Memuat kategori...</p>
        )}
        <div className="space-y-2">
          {products.map((p, i) => (
            <div key={i} className="flex gap-2">
              <select
                value={p.catId}
                onChange={(e) => updateProduct(i, "catId", e.target.value)}
                className="w-1/3 p-2 border-2 border-on-surface rounded-lg text-sm bg-background text-on-surface"
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
                className="flex-1 p-2 border-2 border-on-surface rounded-lg text-sm bg-background text-on-surface"
              />
              <button
                type="button"
                onClick={() => removeProduct(i)}
                aria-label={`Hapus barang ${p.name || i + 1}`}
                className="px-3 text-error hover:bg-error-container rounded-lg border-2 border-transparent hover:border-error/30 transition-colors"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}
          <Button type="button" variant="ghost" size="sm" onClick={addProduct}>
            + Tambah Barang
          </Button>
        </div>
      </div>

      {/* Gallery */}
      <div className="border-t-2 border-dashed border-outline-variant pt-4">
        <h3 className="font-black text-on-surface mb-2 flex items-center gap-2">
          <Images className="size-4" aria-hidden="true" /> Galeri UMKM (Maks 5 Foto)
        </h3>
        <p className="text-xs text-on-surface-variant mb-4">
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
      <div className="flex gap-4 pt-4 border-t-2 border-dashed border-outline-variant">
        <Button type="submit" variant="cream" loading={loading}>
          {!loading && (isNew ? <Upload className="size-4" aria-hidden="true" /> : <Save className="size-4" aria-hidden="true" />)}
          {loading ? "Menyimpan..." : isNew ? "Simpan UMKM" : "Update"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
      </form>

      {/* Pratinjau kartu — mencerminkan tampilan direktori UMKM secara
          langsung sambil admin mengisi form, dibungkus sticky supaya tetap
          terlihat saat scroll (pola sama dengan FaunaForm/CultureForm). */}
      <div className="lg:col-span-1">
        <div
          className={`overflow-hidden rounded-2xl border-4 bg-background hard-shadow-md lg:sticky lg:top-6 ${UMKM_ACCENT_BORDERS[0]}`}
        >
          <div className="flex items-center gap-2 border-b-2 border-on-surface bg-surface-container-low px-4 py-3">
            <Eye className="size-4 text-on-surface-variant" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Pratinjau Kartu
            </span>
          </div>

          <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
            {thumbnail ? (
              <Image src={thumbnail} alt={name || "Pratinjau UMKM"} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <Store className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
            <Badge variant="solid-cream" className="absolute right-2 top-2">
              {formatBusinessType(type) || "Jenis Usaha"}
            </Badge>
          </div>

          <div className="space-y-1 p-4">
            <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
              {name || "Nama UMKM"}
            </h3>
            {locationText && (
              <p className="flex items-center gap-1.5 text-sm text-on-surface-variant">
                <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                {locationText}
              </p>
            )}
            <p className="line-clamp-2 text-sm text-on-surface-variant">
              {shortDesc || "Deskripsi singkat akan tampil di sini."}
            </p>
          </div>
        </div>
      </div>

      <Toast show={showSuccess} message={`UMKM berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`} />
    </div>
  );
}
