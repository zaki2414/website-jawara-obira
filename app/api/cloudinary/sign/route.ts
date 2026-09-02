// app/api/cloudinary/sign/route.ts
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { getAdminUser } from "@/lib/auth";

// Cuma 3 folder yang pernah dipakai uploader admin (lihat lib/cloudinary.ts)
// — di-allowlist supaya endpoint ini tidak bisa dipakai men-tanda-tangani
// upload ke folder sembarang, meski sudah di belakang guard admin.
const ALLOWED_FOLDERS = new Set(["jawara-obi", "jawara-obi/thumbnails", "jawara-obi/extra-images"]);

// Signed upload — sebelumnya semua uploader admin pakai unsigned upload
// preset (nama cloud + preset kebaca siapa saja dari bundle JS browser,
// jadi endpoint Cloudinary bisa di-hit langsung dari luar aplikasi ini,
// skip login admin sama sekali). Endpoint ini SATU-SATUNYA yang boleh
// generate signature (butuh CLOUDINARY_API_SECRET, tidak boleh ada di
// browser) — jadi upload cuma bisa berhasil kalau lewat aplikasi kita
// DAN admin sedang login.
export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!apiKey || !apiSecret || !cloudName) {
    return NextResponse.json(
      { error: "CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET belum diisi di .env.local" },
      { status: 500 },
    );
  }

  const { folder } = await request.json().catch(() => ({ folder: null }));
  if (typeof folder !== "string" || !ALLOWED_FOLDERS.has(folder)) {
    return NextResponse.json({ error: "Folder upload tidak valid." }, { status: 400 });
  }

  // Algoritma signature resmi Cloudinary: urutkan semua parameter yang akan
  // dikirim (selain file/cloud_name/resource_type/api_key) alfabetis,
  // gabung "key=value&key=value", tempel api_secret LANGSUNG di belakang
  // (tanpa separator), lalu SHA-1 hex digest hasilnya.
  const timestamp = Math.round(Date.now() / 1000);
  const paramsToSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = createHash("sha1").update(paramsToSign + apiSecret).digest("hex");

  return NextResponse.json({ signature, timestamp, apiKey, cloudName, folder });
}
