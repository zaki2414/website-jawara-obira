import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
