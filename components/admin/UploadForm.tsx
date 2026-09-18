"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Upload, Eye, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/Toast";
import { FOTO_ACCENT_BORDERS } from "@/components/admin/foto/fotoCardStyles";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import { useCroppedImageUpload } from "@/hooks/useCroppedImageUpload";
import { CropModal } from "./CropModal";

type UploadFormProps = {
  userType: "gallery" | "culture" | "kkn";
};

export default function UploadForm({ userType }: UploadFormProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [village, setVillage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Gambar di-crop lalu diupload SAAT dipilih (bukan menunggu submit) — pola
  // sama dengan ImageUploader.tsx/ExtraImageUploader.tsx, jadi admin isi
  // judul/kategori/deskripsi sambil melihat foto yang sudah final.
  const { cropSrc, loading: uploading, error: uploadError, fileInputRef, selectFile, cancelCrop, confirmCrop } =
    useCroppedImageUpload({
      folder: CLOUDINARY_FOLDERS.gallery,
      onUploaded: (url) => {
        setImageUrl(url);
        setMessage(null);
      },
    });

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) selectFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl)
      return setMessage({
        type: "error",
        text: "Pilih file gambar terlebih dahulu.",
      });

    setSubmitting(true);
    setMessage(null);

    try {
      // Simpan metadata ke Supabase (gambar sudah ter-upload sebelumnya)
      const supabase = createClient();
      const table =
        userType === "gallery"
          ? "galleries"
          : userType === "culture"
            ? "culture_articles"
            : "kkn_documentations";

      const payload: Record<string, string | null> = {
        image_url: imageUrl, // URL Cloudinary
        title: title || null,
        description: description || null,
        category: category || "Umum",
        uploaded_at: new Date().toISOString(),
      };

      if (userType !== "culture")
        payload.village_id = (await getVillageId(village)) ?? null;

      // `table` dipilih dinamis dari 3 nama tabel berskema beda-beda —
      // typed client Supabase tidak bisa menyatukan overload .insert() untuk
      // union builder semacam ini (keterbatasan generic yang dikenal luas di
      // ekosistem Supabase untuk dynamic-table-name pattern). `as never`
      // dipakai TEPAT di argumen ini saja (bukan `any` di parameter/return
      // function), sesuai limitasi tipe yang sudah dikonfirmasi, bukan jalan
      // pintas menghindari type-check secara umum.
      const { error: dbError } = await supabase.from(table).insert(payload as never);
      if (dbError) throw dbError;

      setShowSuccess(true);
      setImageUrl(null);
      setTitle("");
      setDescription("");
      setCategory("");
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setMessage({ type: "error", text: `Gagal: ${errMessage}` });
      console.error("Upload error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2"
      >
        {message && (
          <div
            role="alert"
            className="rounded-lg border-2 border-error/30 bg-error-container p-3 text-sm font-bold text-error"
          >
            {message.text}
          </div>
        )}

        {uploadError && (
          <div
            role="alert"
            className="rounded-lg border-2 border-error/30 bg-error-container p-3 text-sm font-bold text-error"
          >
            {uploadError}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Gambar (max 5 MB)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-on-surface-variant file:mr-4 file:rounded-lg file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-primary hover:file:bg-primary/20"
          />
          <p className="mt-1 text-xs text-on-surface-variant/60">
            {uploading
              ? "Sedang memproses gambar..."
              : "Bisa di-crop dulu setelah dipilih, lalu otomatis dikompres (maks 1200px, JPEG 75%) — HEIC dari iPhone juga didukung"}
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Judul
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border-2 border-on-surface bg-background p-2 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Contoh: Festival Bahari 2024"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Kategori
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border-2 border-on-surface bg-background p-2 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Pilih kategori</option>
              <option value="Alam">Alam</option>
              <option value="Budaya">Budaya</option>
              <option value="Kegiatan">Kegiatan</option>
              <option value="Keseharian">Keseharian</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Desa
            </label>
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full rounded-lg border-2 border-on-surface bg-background p-2 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="kawasi">Kawasi</option>
              <option value="soligi">Soligi</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-lg border-2 border-on-surface bg-background p-2 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Ceritakan sedikit tentang foto ini..."
          />
        </div>

        <Button
          type="submit"
          variant="tertiary"
          disabled={!imageUrl || uploading}
          loading={submitting}
          suppressHydrationWarning
          className="w-full"
        >
          {!submitting && <Upload className="size-4" aria-hidden="true" />}
          {submitting ? "Menyimpan..." : "Upload ke Galeri"}
        </Button>
      </form>

      {/* Pratinjau kartu — mencerminkan tampilan galeri publik secara langsung
          sambil admin mengisi form, dibungkus sticky supaya tetap terlihat
          saat scroll (pola sama dengan FaunaForm/CultureForm). */}
      <div className="lg:col-span-1">
        <div
          className={`overflow-hidden rounded-2xl border-4 bg-background hard-shadow-md lg:sticky lg:top-6 ${FOTO_ACCENT_BORDERS[0]}`}
        >
          <div className="flex items-center gap-2 border-b-2 border-on-surface bg-surface-container-low px-4 py-3">
            <Eye className="size-4 text-on-surface-variant" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Pratinjau Kartu
            </span>
          </div>

          <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
            {imageUrl ? (
              <Image src={imageUrl} alt="Pratinjau foto" fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <ImageIcon className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
            <Badge variant="solid-tertiary" className="absolute right-2 top-2">
              {category || "Umum"}
            </Badge>
          </div>

          <div className="space-y-1 p-4">
            <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
              {title || "Judul Foto"}
            </h3>
            <p className="line-clamp-2 text-sm text-on-surface-variant">
              {description || "Deskripsi foto akan tampil di sini."}
            </p>
          </div>
        </div>
      </div>

      <Toast show={showSuccess} message="Foto berhasil diunggah ke galeri!" />

      {cropSrc && (
        <CropModal imageSrc={cropSrc} onCancel={cancelCrop} onCropDone={confirmCrop} />
      )}
    </div>
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
