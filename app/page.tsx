// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">🌴 Jawara Obira</h1>
        <p className="text-gray-600">
          Portal Informasi Digital Desa Kawasi & Soligi
        </p>
      </div>

      {/* Profil Desa */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-ocean-600 pb-2">
          🏘️ Profil Desa
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/profil"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">Desa Kawasi dan Soligi</div>
            <div className="text-sm text-gray-600">
              Profil dan informasi Desa
            </div>
          </Link>
        </div>
      </section>

      {/* Berita & Budaya */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-ocean-600 pb-2">
          📰 Berita & Budaya
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/berita"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">📰 Semua Berita</div>
            <div className="text-sm text-gray-600">
              Berita terkini dari kedua desa
            </div>
          </Link>
          <Link
            href="/berita/kawasi"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">Berita Desa Kawasi</div>
            <div className="text-sm text-gray-600">
              Khusus berita dari Kawasi
            </div>
          </Link>
          <Link
            href="/berita/soligi"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">Berita Desa Soligi</div>
            <div className="text-sm text-gray-600">
              Khusus berita dari Soligi
            </div>
          </Link>
          <Link
            href="/budaya"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">🎭 Budaya & Tradisi</div>
            <div className="text-sm text-gray-600">
              Kearifan lokal, tradisi, dan seni
            </div>
          </Link>
        </div>
      </section>

      {/* UMKM & Ekonomi */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-ocean-600 pb-2">
          🏪 UMKM & Ekonomi Lokal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/umkm"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">🏪 Daftar UMKM</div>
            <div className="text-sm text-gray-600">
              Usaha mikro, kecil, dan menengah
            </div>
          </Link>

        </div>
      </section>

      {/* Alam & Lingkungan */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-ocean-600 pb-2">
          🦜 Alam & Lingkungan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/fauna-obi"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">🦜 Fauna Obi</div>
            <div className="text-sm text-gray-600">
              Keanekaragaman hewan di Pulau Obi
            </div>
          </Link>          
          <Link
            href="/toga"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">🌿 Tanaman Obat (TOGA)</div>
            <div className="text-sm text-gray-600">
              Tanaman obat keluarga & resep tradisional
            </div>
          </Link>
          <Link
            href="/galeri"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">📸 Galeri Foto</div>
            <div className="text-sm text-gray-600">
              Dokumentasi keindahan alam & budaya
            </div>
          </Link>
        </div>
      </section>

      {/* KKN */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 border-b-2 border-ocean-600 pb-2">
          🎓 Program KKN
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/kkn"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">🎓 Tentang KKN</div>
            <div className="text-sm text-gray-600">
              Informasi program KKN di Obi
            </div>
          </Link>
          <Link
            href="/kkn/tim"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">👥 Tim KKN</div>
            <div className="text-sm text-gray-600">Anggota tim KKN</div>
          </Link>
          <Link
            href="/kkn/jurnal"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">📔 Jurnal KKN</div>
            <div className="text-sm text-gray-600">
              Catatan harian kegiatan KKN
            </div>
          </Link>
          <Link
            href="/kkn/proker"
            className="p-4 border rounded-lg hover:bg-ocean-50 transition"
          >
            <div className="font-semibold">📋 Program Kerja</div>
            <div className="text-sm text-gray-600">
              Daftar program kerja KKN
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
