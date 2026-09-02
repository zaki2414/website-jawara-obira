// app/api/gmaps/resolve/route.ts
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/auth";
import { parseGmapsLocation } from "@/lib/utils";

// Link share Google Maps dari HP ("maps.app.goo.gl/...") TIDAK menyimpan
// koordinat di URL-nya sendiri — cuma ada setelah redirect ke URL panjang
// (maps.google.com/.../@lat,lng,...). Browser tidak bisa follow redirect
// cross-origin ini dari client-side fetch (kena CORS), jadi resolusinya
// wajib lewat server. Endpoint ini SENGAJA dibatasi hanya menerima hostname
// domain Google Maps (allowlist) — tanpa ini, endpoint jadi open proxy yang
// bisa dipakai fetch ke URL sembarang dari server (SSRF).
const ALLOWED_HOSTS = new Set(["maps.app.goo.gl", "goo.gl", "www.google.com", "google.com", "maps.google.com"]);

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { url } = await request.json().catch(() => ({ url: null }));
  if (typeof url !== "string" || !url.trim()) {
    return NextResponse.json({ error: "URL wajib diisi." }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url.trim());
  } catch {
    return NextResponse.json({ error: "URL tidak valid." }, { status: 400 });
  }

  if (parsedUrl.protocol !== "https:" || !ALLOWED_HOSTS.has(parsedUrl.hostname)) {
    return NextResponse.json({ error: "Hanya link Google Maps yang didukung." }, { status: 400 });
  }

  try {
    const res = await fetch(parsedUrl.toString(), { redirect: "follow", signal: AbortSignal.timeout(8000) });
    const resolvedUrl = res.url;

    const location = parseGmapsLocation(resolvedUrl);
    if (!location) {
      return NextResponse.json(
        { error: "Link berhasil dibuka tapi koordinatnya tidak ditemukan." },
        { status: 422 },
      );
    }
    return NextResponse.json(location);
  } catch {
    return NextResponse.json({ error: "Gagal membuka link." }, { status: 502 });
  }
}
