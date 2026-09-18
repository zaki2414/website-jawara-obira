import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  // ── SECURITY HEADERS ──────────────────────────────────────────────
  // Sebelumnya tidak ada satu pun header keamanan diset. Yang paling
  // konkret hilang: tanpa X-Frame-Options/frame-ancestors, halaman situs
  // ini bisa di-iframe situs lain untuk clickjacking.
  //
  // CSP-nya sengaja BELUM `script-src 'self'` murni, karena dua hal di
  // proyek ini memang butuh kelonggaran dan mematikannya akan memecah
  // situs, bukan mengamankannya:
  //   • Next.js menyuntikkan script inline untuk hydration/RSC payload →
  //     'unsafe-inline' pada script-src. Menggantinya dengan nonce butuh
  //     nonce per-request dari proxy.ts, dan itu memaksa SETIAP halaman
  //     jadi dinamis — menghapus ISR yang jadi alasan halaman publik ini
  //     cepat. Trade-off yang dipilih sadar.
  //   • Tailwind v4 + style inline dari Framer Motion/GSAP →
  //     'unsafe-inline' pada style-src.
  // Sisanya dikunci: img/media hanya dari host yang memang dipakai,
  // connect hanya ke Supabase & Cloudinary, frame-ancestors kosong, dan
  // object-src none.
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "font-src 'self' data:",
      "img-src 'self' data: blob: https://res.cloudinary.com https://*.supabase.co https://cdn.statically.io https://server.arcgisonline.com",
      "media-src 'self' https://res.cloudinary.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.cloudinary.com",
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
          // HSTS hanya bermakna di HTTPS; di dev (http://localhost) header ini
          // diabaikan browser, tapi tetap tidak diset supaya tidak mengunci
          // localhost ke https saat seseorang mengetes di 127.0.0.1.
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
            : []),
          { key: "Content-Security-Policy", value: csp },
        ],
      },
    ];
  },
  images: {
    // Next.js 16 default hanya izinkan quality 75 — HeroSection.tsx (home)
    // sengaja pakai quality={90} untuk foto latar hero, jadi perlu di-whitelist
    // di sini. Satu-satunya pemakaian quality custom di seluruh codebase
    // (grep "quality={" — kalau nambah lagi di masa depan, tambahkan nilainya
    // ke array ini juga).
    qualities: [75, 90],
    remotePatterns: [
      { protocol: 'https', hostname: '*.supabase.co' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'cdn.statically.io' },
    ],
    // Di beberapa mesin dev, res.cloudinary.com ke-resolve ke IP privat
    // (biasanya gara-gara Docker Desktop/VPN/DNS resolver lokal yang
    // nge-override) — Next.js image optimizer MENOLAK fetch ke situ demi
    // proteksi SSRF ("resolved to private ip"), padahal host-nya sendiri
    // sudah eksplisit di-whitelist di remotePatterns di atas. Flag ini cuma
    // skip pengecekan IP-privat itu, BUKAN buka akses ke sembarang URL —
    // tetap dibatasi 3 host di remotePatterns. Sengaja hanya development,
    // supaya production tetap dapat proteksi penuh.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
    // Root cause asli (dikonfirmasi via `dig res.cloudinary.com AAAA` di
    // mesin dev yang kena): ISP resolvernya sendiri (bukan hosts file/VPN/
    // Docker — semua sudah dicek bersih) mengembalikan alamat IPv6 rusak
    // untuk res.cloudinary.com (lewat Fastly), sementara IPv4-nya sehat.
    // dangerouslyAllowLocalIP di atas cuma skip pengecekannya, tapi
    // fetch() sisi server Next.js MASIH bisa nyoba conenct ke IPv6 yang
    // rusak itu dan hang sampai timeout 7 detik (--dns-result-order=
    // ipv4first juga sudah dicoba, tidak cukup). Solusi yang benar-benar
    // manjur: lewati SAMA SEKALI jalur fetch sisi-server Next.js untuk
    // gambar remote di development — <Image> jadi <img src={url asli}>
    // langsung, di-fetch BROWSER (yang punya Happy Eyeballs IPv4/IPv6
    // dual-stack yang jauh lebih matang daripada fetch() Node), bukan
    // server dev. Production TETAP dapat optimasi penuh karena masalah ini
    // spesifik ke jaringan si developer, bukan infrastruktur produksi.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
