// lib/heic.ts
// Dipakai HANYA dari Client Component — decode HEIC pakai WASM di browser.

// import("heic2any") DINAMIS (bukan import statis di atas file) — pustaka
// ini bundling decoder WASM libheif yang lumayan besar, jadi HANYA dimuat
// saat benar-benar ada file HEIC yang diupload (kasus khusus, biasanya foto
// iPhone), tidak menambah berat bundle untuk upload JPEG/PNG/WebP biasa
// yang jadi mayoritas kasus.
export async function convertHeicToJpeg(file: File): Promise<File> {
  const heic2any = (await import("heic2any")).default;
  const result = await heic2any({ blob: file, toType: "image/jpeg", quality: 0.9 });
  const blob = Array.isArray(result) ? result[0] : result;
  return new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
    type: "image/jpeg",
  });
}
