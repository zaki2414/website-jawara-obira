// components/admin/KKNProkerForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";

type KKNProkerFormProps = {
  initialData?: any;
  isNew: boolean;
};

export default function KKNProkerForm({
  initialData,
  isNew,
}: KKNProkerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [villages, setVillages] = useState<any[]>([]);

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [village, setVillage] = useState(
    initialData?.village_slug || initialData?.villages?.slug || "",
  );
  const [shortDesc, setShortDesc] = useState(
    initialData?.short_description || "",
  );
  const [content, setContent] = useState(initialData?.goals || "");

  // Cover image (single)
  const [coverUrl, setCoverUrl] = useState(initialData?.image_url || "");

  // Metrics (3 boxes)
  const [metric1Num, setMetric1Num] = useState(
    initialData?.impact_metrics?.m1_num || "",
  );
  const [metric1Label, setMetric1Label] = useState(
    initialData?.impact_metrics?.m1_label || "",
  );
  const [metric2Num, setMetric2Num] = useState(
    initialData?.impact_metrics?.m2_num || "",
  );
  const [metric2Label, setMetric2Label] = useState(
    initialData?.impact_metrics?.m2_label || "",
  );
  const [metric3Num, setMetric3Num] = useState(
    initialData?.impact_metrics?.m3_num || "",
  );
  const [metric3Label, setMetric3Label] = useState(
    initialData?.impact_metrics?.m3_label || "",
  );

  // Extra images (documentation JSONB array)
  const defaultDocs = initialData?.documentation || [];
  const [extraImages, setExtraImages] = useState<
    { url: string; caption: string }[]
  >(
    defaultDocs.length > 0
      ? typeof defaultDocs === "string"
        ? JSON.parse(defaultDocs)
        : defaultDocs
      : [
          { url: "", caption: "" },
          { url: "", caption: "" },
        ],
  );

  // Toast auto-hide
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // ✅ FIX: Hapus useEffect untuk auto-generate slug, pindahkan ke onChange handler
  // useEffect(() => {
  //   if (!initialData?.slug && title) setSlug(generateSlug(title))
  // }, [title, initialData?.slug])

  // Fetch villages dynamically
  useEffect(() => {
    const fetchVillages = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("villages")
        .select("id, name, slug")
        .order("name");
      if (data) setVillages(data);
    };
    fetchVillages();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setShortDesc("");
    setContent("");
    setCoverUrl("");
    setVillage("");
    setMetric1Num("");
    setMetric1Label("");
    setMetric2Num("");
    setMetric2Label("");
    setMetric3Num("");
    setMetric3Label("");
    setExtraImages([
      { url: "", caption: "" },
      { url: "", caption: "" },
    ]);
    setFormKey((prev) => prev + 1);
  };

  // ✅ FIX: Handler untuk auto-generate slug saat judul berubah
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!initialData?.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Extra images handlers
  const addExtraImage = () =>
    setExtraImages([...extraImages, { url: "", caption: "" }]);
  const updateExtraImage = (
    i: number,
    field: "url" | "caption",
    val: string,
  ) => {
    const newImages = [...extraImages];
    newImages[i] = { ...newImages[i], [field]: val };
    setExtraImages(newImages);
  };
  const removeExtraImage = (i: number) =>
    setExtraImages(extraImages.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content)
      return setMessage({
        type: "error",
        text: "Judul dan detail proker wajib diisi.",
      });

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // Get village_id
      let villageId = null;
      if (village) {
        const { data } = await supabase
          .from("villages")
          .select("id")
          .eq("slug", village)
          .single();
        villageId = data?.id || null;
      }

      // Filter extra images: hanya yang ada URL-nya
      const validExtraImages = extraImages.filter((img) => img.url);

      // Payload
      const payload = {
        title,
        slug,
        short_description: shortDesc,
        goals: content,
        impact_metrics: {
          m1_num: metric1Num,
          m1_label: metric1Label,
          m2_num: metric2Num,
          m2_label: metric2Label,
          m3_num: metric3Num,
          m3_label: metric3Label,
        },
        documentation: validExtraImages.length > 0 ? validExtraImages : null,
        image_url: coverUrl || null,
        village_id: villageId,
        published: true,
      };

      if (isNew) {
        const { error } = await supabase.from("kkn_prokers").insert(payload);
        if (error) throw error;
        resetForm();
      } else {
        const { error } = await supabase
          .from("kkn_prokers")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
      }

      setMessage({
        type: "success",
        text: `✅ Proker berhasil ${isNew ? "dibuat" : "diperbarui"}!`,
      });
      setShowSuccess(true);

      // ✅ Tambahkan router.refresh() agar list otomatis update
      setTimeout(() => {
        router.refresh();
        if (!isNew) {
          router.push("/admin/kkn/proker");
        }
      }, 1500);
    } catch (err: any) {
      console.error("❌ Submit error:", err);
      setMessage({ type: "error", text: `❌ Gagal: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-sand-200 space-y-8"
    >
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      {/* 1. Cover Utama */}
      <section>
        <h3 className="font-serif text-lg font-bold text-ocean-800 mb-3">
          🖼️ Cover Utama Proker
        </h3>
        <ImageUploader
          key={`proker-cover-${formKey}`}
          value={coverUrl}
          onChange={setCoverUrl}
          label="Gambar Banner Utama"
        />
      </section>

      {/* 2. Metadata Dasar */}
      <section className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul Proker *
          </label>
          {/* ✅ Gunakan handleTitleChange di sini */}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 text-sm"
            placeholder="Contoh: Digitalisasi Pemetaan Wilayah Desa"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug URL *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 font-mono text-sm"
            placeholder="digitalisasi-pemetaan-wilayah-desa"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokasi Wilayah Desa
          </label>
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 text-sm"
          >
            <option value="">Umum / Kedua Desa</option>
            {villages.map((v: any) => (
              <option key={v.id} value={v.slug}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* 3. Ringkasan & Rich Text Konten */}
      <section className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sub-judul / Deskripsi Pendek
          </label>
          <input
            type="text"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 text-sm"
            placeholder="1 kalimat penjelas di bawah judul utama..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📝 Detail Narasi & Cerita Proker *
          </label>
          <RichTextEditor
            key={`proker-rte-${formKey}`}
            content={content}
            onChange={setContent}
          />
        </div>
      </section>

      {/* 4. 3 Kotak Metrik Dampak */}
      <section className="border-t border-sand-200 pt-6">
        <h3 className="font-serif text-lg font-bold text-ocean-800 mb-3">
          📊 Dampak Program Kerja
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-bold text-orange-700 block mb-2 uppercase tracking-wider">
              Kotak Kiri
            </span>
            <input
              type="text"
              value={metric1Num}
              onChange={(e) => setMetric1Num(e.target.value)}
              placeholder="Angka (e.g. 50+)"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm font-bold mb-2 focus:ring-2 focus:ring-ocean-500 text-gray-800"
            />
            <input
              type="text"
              value={metric1Label}
              onChange={(e) => setMetric1Label(e.target.value)}
              placeholder="Label (e.g. Warga Terlibat)"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-ocean-500"
            />
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-bold text-blue-700 block mb-2 uppercase tracking-wider">
              Kotak Tengah
            </span>
            <input
              type="text"
              value={metric2Num}
              onChange={(e) => setMetric2Num(e.target.value)}
              placeholder="Angka (e.g. 12)"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm font-bold mb-2 focus:ring-2 focus:ring-ocean-500 text-gray-800"
            />
            <input
              type="text"
              value={metric2Label}
              onChange={(e) => setMetric2Label(e.target.value)}
              placeholder="Label (e.g. Buku Didonasikan)"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-ocean-500"
            />
          </div>
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-xs">
            <span className="text-xs font-bold text-yellow-700 block mb-2 uppercase tracking-wider">
              Kotak Kanan
            </span>
            <input
              type="text"
              value={metric3Num}
              onChange={(e) => setMetric3Num(e.target.value)}
              placeholder="Angka (e.g. 100%)"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm font-bold mb-2 focus:ring-2 focus:ring-ocean-500 text-gray-800"
            />
            <input
              type="text"
              value={metric3Label}
              onChange={(e) => setMetric3Label(e.target.value)}
              placeholder="Label (e.g. Sampah Diambil)"
              className="w-full p-3 border border-gray-300 rounded-lg text-sm text-gray-600 focus:ring-2 focus:ring-ocean-500"
            />
          </div>
        </div>
      </section>

      {/* 5. Gambar Pendukung */}
      <section className="border-t border-sand-200 pt-6">
        <h3 className="font-serif text-lg font-bold text-ocean-800 mb-2">
          📸 Gambar Pendukung (Opsional)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Maks 2 gambar. Posisi & rotasi otomatis: Kiri (-3°) & Kanan (+3°).
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Slot 1 */}
          <div className="flex flex-col gap-2 p-4 border border-sand-200 rounded-xl bg-sand-50/30">
            <label className="block text-xs font-medium text-gray-500">
              Slot Foto 1 (Rotasi Kiri)
            </label>
            <ImageUploader
              key={`proker-extra-0-${formKey}`}
              value={extraImages[0]?.url || ""}
              onChange={(url) => updateExtraImage(0, "url", url)}
              label="Upload Foto 1"
            />
            <input
              type="text"
              value={extraImages[0]?.caption || ""}
              onChange={(e) => updateExtraImage(0, "caption", e.target.value)}
              placeholder="Caption Foto 1 (opsional)"
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-ocean-500 text-gray-700"
            />
          </div>

          {/* Slot 2 */}
          <div className="flex flex-col gap-2 p-4 border border-sand-200 rounded-xl bg-sand-50/30">
            <label className="block text-xs font-medium text-gray-500">
              Slot Foto 2 (Rotasi Kanan)
            </label>
            <ImageUploader
              key={`proker-extra-1-${formKey}`}
              value={extraImages[1]?.url || ""}
              onChange={(url) => updateExtraImage(1, "url", url)}
              label="Upload Foto 2"
            />
            <input
              type="text"
              value={extraImages[1]?.caption || ""}
              onChange={(e) => updateExtraImage(1, "caption", e.target.value)}
              placeholder="Caption Foto 2 (opsional)"
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-ocean-500 text-gray-700"
            />
          </div>
        </div>

        {extraImages.length > 2 && (
          <div className="mt-4 space-y-4">
            {extraImages.slice(2, 6).map((img, i) => {
              const actualIndex = i + 2;
              return (
                <div
                  key={actualIndex}
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-sand-200 rounded-xl bg-sand-50/30 relative"
                >
                  <div className="w-full sm:w-36 shrink-0">
                    <ImageUploader
                      key={`extra-${actualIndex}-${formKey}`}
                      value={img.url}
                      onChange={(url) =>
                        updateExtraImage(actualIndex, "url", url)
                      }
                      label={`Foto ${actualIndex + 1}`}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between pt-1">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Keterangan Gambar tambahan
                      </label>
                      <input
                        type="text"
                        value={img.caption}
                        onChange={(e) =>
                          updateExtraImage(
                            actualIndex,
                            "caption",
                            e.target.value,
                          )
                        }
                        placeholder="Caption tambahan..."
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-ocean-500 text-gray-700"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => removeExtraImage(actualIndex)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Hapus Entry
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={addExtraImage}
            className="text-sm font-medium text-ocean-600 hover:text-ocean-700 transition hover:underline"
          >
            + Tambah Foto Tambahan
          </button>
        </div>
      </section>

      {/* 6. Actions */}
      <div className="flex gap-4 pt-4 border-t border-sand-200">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition disabled:opacity-50 text-sm"
        >
          {loading
            ? "Menyimpan..."
            : isNew
              ? "📤 Publish Program Kerja"
              : "💾 Simpan Perubahan"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition text-sm"
        >
          Batal
        </button>
      </div>

      {/* Toast Pop-up Success */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center gap-2 text-sm font-medium">
          <span>✅</span>
          <span>Program Kerja berhasil {isNew ? "dibuat" : "diperbarui"}!</span>
        </div>
      )}
    </form>
  );
}
