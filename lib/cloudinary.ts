// lib/cloudinary.ts
// Dipakai HANYA dari Client Component ("use client") — uploadImageToCloudinary
// panggil endpoint /api/cloudinary/sign lewat fetch(). Resize/kompresi
// gambar sekarang jadi bagian dari alur crop (lihat lib/cropImage.ts +
// components/admin/CropModal.tsx + hooks/useCroppedImageUpload.ts) —
// fungsi ini cuma urus upload blob yang SUDAH diproses ke Cloudinary.

export const CLOUDINARY_FOLDERS = {
  thumbnail: "jawara-obi/thumbnails",
  extraImage: "jawara-obi/extra-images",
  gallery: "jawara-obi",
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

// Signed upload — minta signature dari server dulu (wajib login admin,
// lihat app/api/cloudinary/sign/route.ts), baru upload LANGSUNG dari
// browser ke Cloudinary pakai signature itu (bukan proxy lewat server kita
// — jadi bandwidth file besar tidak numpang lewat server sendiri).
export async function uploadImageToCloudinary(
  fileBlob: Blob,
  originalName: string,
  folder: CloudinaryFolder,
): Promise<string> {
  const signRes = await fetch("/api/cloudinary/sign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });
  const signData = await signRes.json();
  if (!signRes.ok) throw new Error(signData.error || "Gagal membuat izin upload.");

  const { signature, timestamp, apiKey, cloudName } = signData as {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
  };

  const compressedFile = new File(
    [fileBlob],
    originalName.replace(/\.[^/.]+$/, "") + ".jpg",
    { type: "image/jpeg" },
  );

  const formData = new FormData();
  formData.append("file", compressedFile);
  formData.append("api_key", apiKey);
  formData.append("timestamp", String(timestamp));
  formData.append("signature", signature);
  formData.append("folder", folder);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || "Upload ditolak oleh Cloudinary");
  return data.secure_url;
}
