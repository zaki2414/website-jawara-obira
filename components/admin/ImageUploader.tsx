// components/admin/ImageUploader.tsx
"use client";

import { useState, useRef, useEffect } from "react";

type ImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

export default function ImageUploader({
  value,
  onChange,
  label = "Gambar",
}: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  // Fungsi utilitas untuk mengompres gambar menggunakan Canvas HTML5
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Batasi resolusi maksimal lebar/tinggi ke 1200px (Sangat cukup untuk web)
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);

          // Kompres kualitas gambar ke 75% (0.75) dengan format JPEG baku
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Gagal melakukan kompresi gambar."));
              }
            },
            "image/jpeg",
            0.75
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const uploadToCloudinary = async (fileBlob: Blob, originalName: string): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cloudName || !uploadPreset)
      throw new Error("Konfigurasi Cloudinary belum lengkap");

    const formData = new FormData();
    // Konversi Blob kembali menjadi File agar dikenali oleh API Cloudinary
    const compressedFile = new File([fileBlob], originalName.replace(/\.[^/.]+$/, "") + ".jpg", {
      type: "image/jpeg",
    });

    formData.append("file", compressedFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "jawara-obi/thumbnails");

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.error?.message || "Upload gagal");
    return data.secure_url;
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/"))
      return alert("File harus berupa gambar");

    setLoading(true);
    setPreview(URL.createObjectURL(file)); // Preview instan lokal

    try {
      // 1. Jalankan fungsi kompresi gambar
      const compressedBlob = await compressImage(file);
      // 2. Upload blob hasil kompresi ke Cloudinary
      const url = await uploadToCloudinary(compressedBlob, file.name);
      onChange(url); 
    } catch (err: any) {
      alert(`Upload gagal: ${err.message}`);
      setPreview(value); // Revert preview jika gagal
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("");
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>

      {preview ? (
        <div className="relative w-full h-40 bg-sand-100 rounded-lg overflow-hidden border border-sand-200 group">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-ocean-600 text-xs rounded hover:bg-red-700"
          >
            Hapus
          </button>
          {loading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-ocean-600 text-sm">
              ⏳ Upload...
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => !loading && fileInputRef.current?.click()}
          className={`border-2 border-dashed ${loading ? "border-gray-200 cursor-wait" : "border-gray-300 cursor-pointer hover:border-ocean-400"} rounded-lg p-6 text-center transition bg-gray-50`}
        >
          <p className="text-gray-500 text-sm">
            {loading ? "Sedang mengupload & mengompres..." : "Klik untuk pilih gambar"}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Gambar akan otomatis dikompres demi performa web cepat
          </p>
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileSelect}
        disabled={loading}
        className="hidden"
      />
    </div>
  );
}