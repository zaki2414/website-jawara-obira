// components/admin/ExtraImageUploader.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type ExtraImageUploaderProps = {
  value: string;
  caption: string;
  onChange: (url: string, caption: string) => void;
  slotNumber: number;
};

export default function ExtraImageUploader({
  value,
  caption,
  onChange,
  slotNumber,
}: ExtraImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(value);
  const [captionInput, setCaptionInput] = useState(caption);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPreview(value);
    setCaptionInput(caption);
  }, [value, caption]);

  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        // ✅ PERBAIKAN: Gunakan window.Image agar tidak konflik dengan komponen Next.js
        const img = new window.Image(); 
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

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

          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error("Gagal mengompresi gambar tambahan."));
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
    const compressedFile = new File([fileBlob], originalName.replace(/\.[^/.]+$/, "") + ".jpg", {
      type: "image/jpeg",
    });

    formData.append("file", compressedFile);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", "jawara-obi/extra-images");

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

    if (!file.type.startsWith("image/")) {
      alert("File harus berupa gambar");
      return;
    }

    setLoading(true);
    // Menggunakan URL blob untuk preview instan
    const localPreviewUrl = URL.createObjectURL(file);
    setPreview(localPreviewUrl);

    try {
      const compressedBlob = await compressImage(file);
      const url = await uploadToCloudinary(compressedBlob, file.name);
      onChange(url, captionInput);
      setPreview(url);
    } catch (err: any) {
      alert(`Upload gagal: ${err.message}`);
      setPreview(value);
    } finally {
      setLoading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    onChange("", "");
    setPreview("");
    setCaptionInput("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCaptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCaption = e.target.value;
    setCaptionInput(newCaption);
    onChange(value, newCaption);
  };

  return (
    <div className="border border-sand-200 rounded-xl p-4 bg-sand-50">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-700">
          Gambar Pendukung {slotNumber}
        </h4>
      </div>

      {preview ? (
        <div className="relative">
          {/* ✅ PERBAIKAN: Container harus relative agar 'fill' bekerja tanpa error width */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-white shadow-sm border border-sand-200">
            <Image
              src={preview}
              alt={`Preview pendukung ${slotNumber}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
              unoptimized={preview.startsWith('blob:')} // Opsional: bypass optimasi jika masih blob lokal
            />
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 px-2 py-1 bg-red-600 text-white text-xs rounded-md shadow-sm hover:bg-red-700 transition-colors"
          >
            Hapus
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-ocean-400 hover:bg-white transition group"
        >
          <p className="text-gray-500 text-sm group-hover:text-ocean-600">Klik untuk upload gambar</p>
          <p className="text-gray-400 text-xs mt-1">Otomatis kompresi JPEG 75%</p>
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

      {preview && (
        <div className="mt-3">
          <input
            type="text"
            value={captionInput}
            onChange={handleCaptionChange}
            placeholder="Keterangan gambar (opsional)"
            className="w-full p-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 outline-none transition-all"
          />
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-3 h-3 border-2 border-ocean-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-ocean-600 font-medium">Mengompres & mengupload...</p>
        </div>
      )}
    </div>
  );
}