// components/admin/ImageUploader.tsx
"use client";

import { useState, useEffect } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import { useCroppedImageUpload } from "@/hooks/useCroppedImageUpload";
import { CropModal } from "./CropModal";

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
  const [preview, setPreview] = useState(value);
  const { cropSrc, loading, error, fileInputRef, selectFile, cancelCrop, confirmCrop } =
    useCroppedImageUpload({
      folder: CLOUDINARY_FOLDERS.thumbnail,
      onUploaded: (url) => {
        setPreview(url);
        onChange(url);
      },
    });

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
  };

  const handleRemove = () => {
    onChange("");
    setPreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">{label}</label>

      {error && (
        <div role="alert" className="rounded-lg border-2 border-error/30 bg-error-container p-2 text-xs font-bold text-error">
          {error}
        </div>
      )}

      {preview ? (
        <div className="relative w-full h-40 bg-surface-container rounded-xl overflow-hidden border-2 border-on-surface group">
          {/* eslint-disable-next-line @next/next/no-img-element -- preview bisa berupa blob: URL lokal sebelum upload selesai */}
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            aria-label="Hapus gambar"
            className="absolute top-2 right-2 p-1.5 bg-error text-on-error rounded-lg border-2 border-on-surface hard-shadow-sm hover:bg-error/90 transition-colors"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
          {loading && (
            <div className="absolute inset-0 bg-on-surface/60 flex items-center justify-center gap-2 text-background text-sm font-bold">
              <Loader2 className="size-4 animate-spin" aria-hidden="true" /> Upload...
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className={`w-full flex flex-col items-center gap-2 border-2 border-dashed ${loading ? "border-outline-variant cursor-wait" : "border-on-surface cursor-pointer hover:border-primary hover:bg-primary/5"} rounded-xl p-6 text-center transition-colors bg-surface-container-low`}
        >
          {loading ? (
            <Loader2 className="size-6 text-on-surface-variant animate-spin" aria-hidden="true" />
          ) : (
            <ImagePlus className="size-6 text-on-surface-variant" aria-hidden="true" />
          )}
          <p className="text-on-surface-variant text-sm font-bold">
            {loading ? "Sedang memproses gambar..." : "Klik untuk pilih gambar"}
          </p>
          <p className="text-on-surface-variant/60 text-xs">
            Bisa di-crop dulu setelah dipilih, lalu otomatis dikompres demi performa web cepat — HEIC dari iPhone juga didukung
          </p>
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        onChange={handleFileSelect}
        disabled={loading}
        className="hidden"
      />

      {cropSrc && (
        <CropModal imageSrc={cropSrc} onCancel={cancelCrop} onCropDone={confirmCrop} />
      )}
    </div>
  );
}
