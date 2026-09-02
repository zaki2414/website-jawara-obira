"use client";

import { useRef, useState } from "react";
import { validateImageFile, isHeicFile } from "@/lib/utils";
import { uploadImageToCloudinary, type CloudinaryFolder } from "@/lib/cloudinary";
import { convertHeicToJpeg } from "@/lib/heic";

type UseCroppedImageUploadOptions = {
  folder: CloudinaryFolder;
  onUploaded: (url: string) => void;
};

// State + alur "pilih file -> (konversi HEIC kalau perlu) -> crop -> upload"
// dipakai ImageUploader.tsx, ExtraImageUploader.tsx, dan UploadForm.tsx —
// sebelumnya tiap komponen itu mengelola state loading/preview/fileInputRef
// sendiri-sendiri hampir identik; sekarang state pipeline-nya disatukan di
// sini, tiap komponen cuma render UI-nya masing-masing (kotak upload
// beda-beda per konteks) mengikuti apa yang dikembalikan hook ini.
export function useCroppedImageUpload({ folder, onUploaded }: UseCroppedImageUploadOptions) {
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  // `loading` dipakai buat DUA fase (konversi HEIC, lalu upload) — caller
  // cukup satu flag buat disable input/tombol, tidak perlu tahu fase mana
  // yang sedang jalan.
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectFile = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error ?? "File tidak valid.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }
    setError(null);

    // HEIC/HEIF (default kamera iPhone) tidak bisa dibaca <img>/Canvas di
    // Chrome/Firefox/Edge — wajib dikonversi ke JPEG dulu di browser SEBELUM
    // masuk modal crop, supaya cropper-nya bisa menampilkan gambarnya sama
    // sekali (bukan cuma soal ukuran file).
    let workingFile = file;
    if (isHeicFile(file)) {
      setLoading(true);
      try {
        workingFile = await convertHeicToJpeg(file);
      } catch {
        setError("Gagal membaca file HEIC ini. Coba ekspor sebagai JPEG dulu dari galeri HP-mu.");
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setLoading(false);
    }

    setFileName(workingFile.name);
    setCropSrc(URL.createObjectURL(workingFile));
  };

  const cancelCrop = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const confirmCrop = async (blob: Blob) => {
    setLoading(true);
    setError(null);
    try {
      const url = await uploadImageToCloudinary(blob, fileName, folder);
      onUploaded(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload gagal.");
    } finally {
      setLoading(false);
      cancelCrop();
    }
  };

  return { cropSrc, loading, error, fileInputRef, selectFile, cancelCrop, confirmCrop };
}
