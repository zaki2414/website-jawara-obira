"use client";

import { useState, useEffect } from "react"; // ✅ 1. Tambahkan useEffect di import
import { validateImageFile, generateSlug } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

type UploadFormProps = {
  userType: "gallery" | "news" | "culture" | "kkn";
};

export default function UploadForm({ userType }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [village, setVillage] = useState("kawasi");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // ✅ 2. Tambahkan useEffect ini untuk sinkronisasi state saat mount (fix hydration)
  useEffect(() => {
    // Pastikan state file selalu null saat pertama kali load di client
    // agar sesuai dengan render awal di server
    if (file === undefined) setFile(null);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const validation = validateImageFile(selected);
    if (!validation.valid) {
      setMessage({ type: "error", text: validation.error! });
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setMessage(null);
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName)
      throw new Error(
        "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME belum diisi di .env.local",
      );
    if (!uploadPreset)
      throw new Error(
        "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET belum diisi di .env.local",
      );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "jawara-obi");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("🔴 Cloudinary Response:", data);
      throw new Error(data.error?.message || "Upload ditolak oleh Cloudinary");
    }

    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file)
      return setMessage({
        type: "error",
        text: "Pilih file gambar terlebih dahulu.",
      });

    setLoading(true);
    setMessage(null);

    try {
      // 1. Upload ke Cloudinary
      const imageUrl = await uploadToCloudinary(file);

      // 2. Simpan metadata ke Supabase
      const supabase = createClient();
      const table =
        userType === "gallery"
          ? "galleries"
          : userType === "news"
            ? "news"
            : userType === "culture"
              ? "culture_articles"
              : "kkn_documentations";

      const payload: any = {
        image_url: imageUrl, // ✅ URL Cloudinary
        title: title || null,
        description: description || null,
        category: category || "Umum",
        uploaded_at: new Date().toISOString(),
      };

      if (userType !== "culture")
        payload.village_id = await getVillageId(village);
      if (userType === "news") {
        payload.slug = generateSlug(title);
        payload.author_name = "Admin";
        payload.published_at = new Date().toISOString();
      }

      const { error: dbError } = await supabase.from(table).insert(payload);
      if (dbError) throw dbError;

      setMessage({ type: "success", text: "✅ Upload berhasil!" });
      setFile(null);
      setPreview(null);
      setTitle("");
      setDescription("");
      setCategory("");
    } catch (err: any) {
      setMessage({ type: "error", text: `❌ Gagal: ${err.message}` });
      console.error("Upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-sand-200 space-y-4"
    >
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Gambar (max 5 MB)
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-ocean-50 file:text-ocean-700 hover:file:bg-ocean-100"
        />
        {preview && (
          <div className="mt-3 relative w-full h-40 rounded-lg overflow-hidden bg-sand-100">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Judul
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 focus:border-ocean-500"
          placeholder="Contoh: Festival Bahari 2024"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kategori
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
          >
            <option value="">Pilih kategori</option>
            <option value="Alam">Alam</option>
            <option value="Budaya">Budaya</option>
            <option value="Kegiatan">Kegiatan</option>
            <option value="Keseharian">Keseharian</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Desa
          </label>
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
          >
            <option value="kawasi">Kawasi</option>
            <option value="soligi">Soligi</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
          placeholder="Ceritakan sedikit tentang foto ini..."
        />
      </div>

      {/* ✅ 3. Tombol dengan suppressHydrationWarning */}
      <button
        type="submit"
        disabled={loading || !file}
        suppressHydrationWarning={true}
        className="w-full py-3 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Mengupload..." : "📤 Upload ke Galeri"}
      </button>
    </form>
  );
}

async function getVillageId(slug: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("villages")
    .select("id")
    .eq("slug", slug)
    .single();
  return data?.id;
}
