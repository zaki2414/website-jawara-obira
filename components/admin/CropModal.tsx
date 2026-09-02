"use client";

import { useCallback, useState } from "react";
import Cropper, { type Area, type Point } from "react-easy-crop";
import { Check, X, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCroppedImageBlob } from "@/lib/cropImage";

type CropModalProps = {
  imageSrc: string;
  /** Rasio lebar/tinggi kotak crop — default 4:3, sesuai rasio yang paling
   *  umum dipakai kartu/thumbnail di situs ini. */
  aspect?: number;
  onCancel: () => void;
  onCropDone: (blob: Blob) => void;
};

// Modal crop dipakai SEMUA uploader admin (ImageUploader/ExtraImageUploader/
// UploadForm) lewat hooks/useCroppedImageUpload.ts — supaya admin bisa
// pas-kan framing foto langsung di form, tidak perlu edit manual di
// aplikasi lain dulu sebelum upload.
export function CropModal({ imageSrc, aspect = 4 / 3, onCancel, onCropDone }: CropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCropComplete = useCallback((_croppedArea: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setProcessing(true);
    setError(null);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onCropDone(blob);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses hasil crop.");
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/80 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Sesuaikan crop gambar"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border-4 border-on-surface bg-background hard-shadow-lg">
        <div className="flex items-center justify-between border-b-2 border-on-surface px-5 py-3">
          <h3 className="font-serif text-lg font-black text-on-surface">Sesuaikan Crop</h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Tutup tanpa menyimpan"
            disabled={processing}
            className="rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container-low disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative h-80 bg-surface-container-high">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>

        <div className="space-y-4 p-5">
          {error && (
            <div role="alert" className="rounded-lg border-2 border-error/30 bg-error-container p-2 text-xs font-bold text-error">
              {error}
            </div>
          )}

          <div className="flex items-center gap-3">
            <ZoomIn className="size-4 shrink-0 text-on-surface-variant" aria-hidden="true" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              aria-label="Perbesar atau perkecil gambar"
              className="w-full accent-tertiary cursor-pointer"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="primary"
              onClick={handleConfirm}
              loading={processing}
              className="flex-1"
            >
              {!processing && <Check className="size-4" aria-hidden="true" />}
              Crop Foto
            </Button>
            <Button type="button" variant="secondary" onClick={onCancel} disabled={processing}>
              Batal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
