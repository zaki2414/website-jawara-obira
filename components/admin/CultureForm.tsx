// components/admin/CultureForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client"; // ✅ Gunakan browser client
import { generateSlug } from "@/lib/utils";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import ExtraImageUploader from "./ExtraImageUploader";

type CultureFormProps = {
  initialData?: any;
  isNew: boolean;
};

export default function CultureForm({ initialData, isNew }: CultureFormProps) {
  const router = useRouter();
  const defaultExtra =
    typeof initialData?.extra_images === "string"
      ? JSON.parse(initialData.extra_images)
      : initialData?.extra_images || [];

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [village, setVillage] = useState(initialData?.village_slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail_url || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [extraImages, setExtraImages] = useState([
    { url: defaultExtra[0]?.url || "", caption: defaultExtra[0]?.caption || "" },
    { url: defaultExtra[1]?.url || "", caption: defaultExtra[1]?.caption || "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ✅ FIX: Pindahkan auto-generate slug ke event handler
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (isNew && !initialData?.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setCategory("");
    setVillage("");
    setContent("");
    setThumbnail("");
    setExtraImages([{ url: "", caption: "" }, { url: "", caption: "" }]);
    setFormKey((prev) => prev + 1);
  };

  const handleExtraImageChange = (index: number, url: string, caption: string) => {
    const newExtra = [...extraImages];
    newExtra[index] = { url, caption };
    setExtraImages(newExtra);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) return setMessage({ type: "error", text: "Judul, Kategori, dan Konten wajib diisi." });
    if (!slug) return setMessage({ type: "error", text: "Slug wajib diisi." });
    
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient(); // ✅ Browser client
      let villageId = null;
      if (village) {
        const { data: villageData } = await supabase.from("villages").select("id").eq("slug", village).single();
        villageId = villageData?.id || null;
      }

      const payload = {
        title,
        slug,
        category,
        content,
        thumbnail_url: thumbnail || null, 
        village_id: villageId,
        extra_images: extraImages.filter((img) => img.url),
        published_at: initialData?.published_at || new Date().toISOString(),
      };

      // ✅ Lakukan mutasi langsung menggunakan browser client
      const { error } = isNew
        ? await supabase.from("culture_articles").insert(payload)
        : await supabase.from("culture_articles").update(payload).eq("id", initialData.id);

      if (error) throw error;

      setShowSuccess(true);
      setMessage({ type: "success", text: `✅ Artikel budaya ${isNew ? "dibuat" : "diperbarui"}!` });

      resetForm();

      setTimeout(() => {
        router.refresh(); // ✅ Auto refresh list halaman admin
        if (!isNew) {
          router.push("/admin/budaya");
        }
      }, 1500);
    } catch (err: any) {
      setMessage({ type: "error", text: `❌ Gagal: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-sand-200 space-y-8">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          {message.text}
        </div>
      )}

      <section>
        <h3 className="font-serif text-lg font-bold text-ocean-800 mb-3">🖼️ Thumbnail Utama</h3>
        <ImageUploader key={`thumb-${formKey}`} value={thumbnail} onChange={setThumbnail} label="Gambar Cover Budaya" />
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Judul *</label>
          {/* ✅ Gunakan handleTitleChange di sini */}
          <input type="text" value={title} onChange={handleTitleChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500" placeholder="Contoh: Tari Cakalele Obi" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
          <input type="text" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 font-mono text-sm" placeholder="tari-cakalele-obi" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500" required>
            <option value="">Pilih kategori</option>
            <option value="Tradisi">Tradisi & Adat</option>
            <option value="Kuliner">Kuliner Khas</option>
            <option value="Bahari">Kearifan Bahari</option>
            <option value="Kerajinan">Kerajinan Tangan</option>
            <option value="Cerita Rakyat">Cerita Rakyat</option>
            <option value="Seni">Seni & Musik</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Asal Desa (Opsional)</label>
          <select value={village} onChange={(e) => setVillage(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500">
            <option value="">Umum / Seluruh Pulau Obi</option>
            <option value="kawasi">Desa Kawasi</option>
            <option value="soligi">Desa Soligi</option>
          </select>
        </div>
      </section>

      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">📝 Isi Artikel *</label>
        <RichTextEditor key={`rte-${formKey}`} content={content} onChange={setContent} placeholder="Tulis detail sejarah, makna, atau deskripsi budaya..." />
      </section>

      <section className="border-t border-sand-200 pt-6">
        <h3 className="font-serif text-lg font-bold text-ocean-800 mb-2">📸 Gambar Pendukung (Opsional)</h3>
        <p className="text-sm text-gray-500 mb-4">Maks 2 gambar. Posisi & rotasi otomatis: Kiri (-3°) & Kanan (+3°).</p>
        <div className="grid md:grid-cols-2 gap-6">
          <ExtraImageUploader key={`extra-0-${formKey}`} slotNumber={1} value={extraImages[0].url} caption={extraImages[0].caption} onChange={(url, caption) => handleExtraImageChange(0, url, caption)} />
          <ExtraImageUploader key={`extra-1-${formKey}`} slotNumber={2} value={extraImages[1].url} caption={extraImages[1].caption} onChange={(url, caption) => handleExtraImageChange(1, url, caption)} />
        </div>
      </section>

      <div className="flex gap-4 pt-4 border-t border-sand-200">
        <button type="submit" disabled={loading} className="px-6 py-3 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition disabled:opacity-50">
          {loading ? "Menyimpan..." : isNew ? "📤 Publish Budaya" : "💾 Simpan Perubahan"}
        </button>
        <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition">
          Batal
        </button>
      </div>

      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center gap-2">
          <span>✅</span>
          <span>Artikel berhasil {isNew ? "dibuat" : "diperbarui"}!</span>
        </div>
      )}
    </form>
  );
}