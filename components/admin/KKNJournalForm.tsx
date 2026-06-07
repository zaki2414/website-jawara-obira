// components/admin/KKNJournalForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // ✅ Gunakan browser client untuk mutasi di form
import { generateSlug } from "@/lib/utils";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import ExtraImageUploader from "./ExtraImageUploader";

type KKNJournalFormProps = {
  initialData?: any;
  isNew: boolean;
};

export default function KKNJournalForm({
  initialData,
  isNew,
}: KKNJournalFormProps) {
  const router = useRouter();

  const defaultExtra =
    typeof initialData?.images === "string"
      ? JSON.parse(initialData.images)
      : initialData?.images?.map((img: any) => ({
          url: img.image_url,
          caption: img.caption,
        })) || [];

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [village, setVillage] = useState(
    initialData?.village_slug || initialData?.villages?.slug || "",
  );
  const [activityDate, setActivityDate] = useState(
    initialData?.activity_date ? initialData.activity_date.split("T")[0] : "",
  );
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [villages, setVillages] = useState<any[]>([]);
  const [extraImages, setExtraImages] = useState([
    {
      url: defaultExtra[0]?.url || "",
      caption: defaultExtra[0]?.caption || "",
    },
    {
      url: defaultExtra[1]?.url || "",
      caption: defaultExtra[1]?.caption || "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Fetch villages menggunakan browser client
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
    setContent("");
    setCoverImage("");
    setActivityDate("");
    setVillage("");
    setExtraImages([
      { url: "", caption: "" },
      { url: "", caption: "" },
    ]);
    setFormKey((prev) => prev + 1);
  };

  const handleExtraImageChange = (
    index: number,
    url: string,
    caption: string,
  ) => {
    const newExtra = [...extraImages];
    newExtra[index] = { url, caption };
    setExtraImages(newExtra);
  };

  // ✅ FIX: Pindahkan logika auto-generate slug ke event handler onChange
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Hanya auto-generate jika ini form baru (tidak ada initial slug)
    if (!initialData?.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !activityDate) {
      return setMessage({
        type: "error",
        text: "Judul, tanggal kegiatan, dan isi jurnal wajib diisi.",
      });
    }
    if (!slug) return setMessage({ type: "error", text: "Slug wajib diisi." });

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient(); // ✅ Browser client
      let villageId = null;

      if (village) {
        const { data: villageData } = await supabase
          .from("villages")
          .select("id")
          .eq("slug", village)
          .single();
        villageId = villageData?.id || null;
      }

      const journalPayload = {
        title,
        slug,
        content,
        cover_image: coverImage || null,
        activity_date: activityDate,
        village_id: villageId,
        published: true,
      };

      let journalId = initialData?.id;

      // ✅ Lakukan mutasi langsung menggunakan browser client
      if (isNew) {
        const { data, error } = await supabase
          .from("kkn_journals")
          .insert(journalPayload)
          .select()
          .single();
        if (error) throw error;
        journalId = data.id;
      } else {
        const { error } = await supabase
          .from("kkn_journals")
          .update(journalPayload)
          .eq("id", initialData.id);
        if (error) throw error;
      }

      // Handle extra images di tabel terpisah: kkn_journal_images
      const validExtraImages = extraImages.filter((img) => img.url);

      if (validExtraImages.length > 0) {
        if (!isNew) {
          await supabase
            .from("kkn_journal_images")
            .delete()
            .eq("journal_id", journalId);
        }

        const imagesPayload = validExtraImages.map((img) => ({
          journal_id: journalId,
          image_url: img.url,
          caption: img.caption || null,
        }));

        const { error: imgError } = await supabase
          .from("kkn_journal_images")
          .insert(imagesPayload);

        if (imgError) console.warn("⚠️ Extra images insert warning:", imgError);
      }

      const successText = `Jurnal KKN berhasil ${isNew ? "dibuat" : "diperbarui"}!`;
      setMessage({ type: "success", text: `✅ ${successText}` });
      setShowSuccess(true);

      if (isNew) {
        resetForm();
      } else {
        setTimeout(() => router.push("/admin/kkn/jurnal"), 1500);
      }
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
          🖼️ Cover Utama Jurnal
        </h3>
        <ImageUploader
          key={`journal-cover-${formKey}`}
          value={coverImage}
          onChange={setCoverImage}
          label="Gambar Cover Jurnal"
        />
      </section>

      {/* 2. Metadata Dasar */}
      <section className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Judul *
          </label>
          {/* ✅ Gunakan handleTitleChange di sini */}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
            placeholder="Contoh: Log Harian Hari Ke-14 Pengajaran"
            required
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
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 font-mono text-sm"
            placeholder="log-harian-hari-ke-14"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tanggal Kegiatan *
          </label>
          <input
            type="date"
            value={activityDate}
            onChange={(e) => setActivityDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lokasi Desa *
          </label>
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
          >
            <option value="">Umum / Kedua Desa</option>
            {villages.map((v: any) => (
              <option key={v.id} value={v.slug}>
                {v.name}
              </option>
            ))}
          </select>
          {villages.length === 0 && (
            <p className="text-xs text-gray-400 mt-1">Memuat data desa...</p>
          )}
        </div>
      </section>

      {/* 3. Konten Teks */}
      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          📝 Isi Cerita Jurnal *
        </label>
        <RichTextEditor
          key={`journal-rte-${formKey}`}
          content={content}
          onChange={setContent}
        />
      </section>

      {/* 4. Gambar Pendukung */}
      <section className="border-t border-sand-200 pt-6">
        <h3 className="font-serif text-lg font-bold text-ocean-800 mb-2">
          📸 Gambar Pendukung (Opsional)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Maks 2 gambar. Posisi & rotasi otomatis: Kiri (-3°) & Kanan (+3°).
        </p>
        <div className="grid md:grid-cols-2 gap-6">
          <ExtraImageUploader
            key={`journal-extra-0-${formKey}`}
            slotNumber={1}
            value={extraImages[0].url}
            caption={extraImages[0].caption}
            onChange={(url, caption) => handleExtraImageChange(0, url, caption)}
          />
          <ExtraImageUploader
            key={`journal-extra-1-${formKey}`}
            slotNumber={2}
            value={extraImages[1].url}
            caption={extraImages[1].caption}
            onChange={(url, caption) => handleExtraImageChange(1, url, caption)}
          />
        </div>
      </section>

      {/* 5. Aksi */}
      <div className="flex gap-4 pt-4 border-t border-sand-200">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition disabled:opacity-50"
        >
          {loading
            ? "Menyimpan..."
            : isNew
              ? "📤 Publish Jurnal"
              : "💾 Simpan Perubahan"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Batal
        </button>
      </div>

      {/* Toast Pop-up Success */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center gap-2">
          <span>✅</span>
          <span>Jurnal berhasil {isNew ? "dibuat" : "diperbarui"}!</span>
        </div>
      )}
    </form>
  );
}
