// components/admin/ExtraImageUploader.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { CLOUDINARY_FOLDERS } from "@/lib/cloudinary";
import { useCroppedImageUpload } from "@/hooks/useCroppedImageUpload";
import { CropModal } from "./CropModal";

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
  const [preview, setPreview] = useState(value);
  const [captionInput, setCaptionInput] = useState(caption);
  const { cropSrc, loading, error, fileInputRef, selectFile, cancelCrop, confirmCrop } =
    useCroppedImageUpload({
      folder: CLOUDINARY_FOLDERS.extraImage,
      onUploaded: (url) => {
        setPreview(url);
        onChange(url, captionInput);
      },
    });

  useEffect(() => {
    setPreview(value);
    setCaptionInput(caption);
  }, [value, caption]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) selectFile(file);
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
    <div className="border-2 border-on-surface rounded-xl p-4 bg-surface-container-low">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-black text-on-surface text-label-sm uppercase tracking-wide">
          Gambar Pendukung {slotNumber}
        </h4>
      </div>

      {error && (
        <div role="alert" className="mb-3 rounded-lg border-2 border-error/30 bg-error-container p-2 text-xs font-bold text-error">
          {error}
        </div>
      )}

      {preview ? (
        <div className="relative">
          {/* Container harus relative agar 'fill' bekerja tanpa error width */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden bg-background hard-shadow-sm border-2 border-on-surface">
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
            aria-label="Hapus gambar pendukung"
            className="absolute top-2 right-2 p-1.5 bg-error text-on-error rounded-lg border-2 border-on-surface hard-shadow-sm hover:bg-error/90 transition-colors"
          >
            <X className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex flex-col items-center gap-2 border-2 border-dashed border-on-surface rounded-lg p-6 text-center cursor-pointer hover:border-primary hover:bg-background transition-colors group"
        >
          <ImagePlus className="size-5 text-on-surface-variant group-hover:text-primary" aria-hidden="true" />
          <p className="text-on-surface-variant text-sm font-bold group-hover:text-primary">Klik untuk upload gambar</p>
          <p className="text-on-surface-variant/60 text-xs">Bisa di-crop dulu, otomatis kompresi JPEG 75% — HEIC dari iPhone juga didukung</p>
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

      {preview && (
        <div className="mt-3">
          <input
            type="text"
            value={captionInput}
            onChange={handleCaptionChange}
            placeholder="Keterangan gambar (opsional)"
            className="w-full p-2 text-sm border-2 border-on-surface rounded-lg bg-background text-on-surface focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all"
          />
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 mt-2">
          <Loader2 className="size-3.5 text-primary animate-spin" aria-hidden="true" />
          <p className="text-xs text-primary font-bold">Memproses gambar...</p>
        </div>
      )}

      {cropSrc && (
        <CropModal imageSrc={cropSrc} onCancel={cancelCrop} onCropDone={confirmCrop} />
      )}
    </div>
  );
}
