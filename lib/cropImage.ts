// lib/cropImage.ts
// Dipakai HANYA dari Client Component — canvas API browser.

export type PixelCrop = { x: number; y: number; width: number; height: number };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    // window.Image (bukan Image polos) supaya tidak bentrok dengan komponen
    // next/image yang lazim diimpor dengan nama sama di caller.
    const img = new window.Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", () => reject(new Error("Gagal memuat gambar untuk di-crop.")));
    img.src = src;
  });
}

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.75;

// Motong gambar sesuai area crop (piksel, dari react-easy-crop) SEKALIGUS
// membatasi sisi terpanjang hasil crop ke MAX_DIMENSION dan re-encode JPEG
// q75 — satu proses canvas, bukan crop lalu compress terpisah (dua kali
// lossy re-encode akan menurunkan kualitas tanpa perlu). Ini menggantikan
// compressImage() lama di lib/cloudinary.ts — sekarang SEMUA upload admin
// wajib lewat crop dulu (lihat components/admin/CropModal.tsx), jadi resize
// akhirnya terjadi di sini, bukan di fungsi terpisah.
export async function getCroppedImageBlob(imageSrc: string, cropPixels: PixelCrop): Promise<Blob> {
  const image = await loadImage(imageSrc);

  let width = cropPixels.width;
  let height = cropPixels.height;
  if (width > height) {
    if (width > MAX_DIMENSION) {
      height = Math.round((height * MAX_DIMENSION) / width);
      width = MAX_DIMENSION;
    }
  } else {
    if (height > MAX_DIMENSION) {
      width = Math.round((width * MAX_DIMENSION) / height);
      height = MAX_DIMENSION;
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas tidak didukung di browser ini.");

  ctx.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    width,
    height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Gagal memproses hasil crop."));
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
}
