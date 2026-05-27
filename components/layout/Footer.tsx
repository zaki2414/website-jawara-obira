import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-ocean-700 text-black mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-serif text-xl font-bold mb-3">🌴 Jawara Obira</h3>
            <p className="text-ocean-100 text-sm leading-relaxed">
              Platform informasi digital Desa Kawasi & Soligi, Pulau Obi. Mendokumentasikan budaya, potensi, dan keindahan alam untuk generasi mendatang.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-ocean-100 mb-4 uppercase tracking-wider text-xs">Navigasi</h4>
            <ul className="space-y-2 text-sm text-ocean-200">
              <li><Link href="/berita" className="hover:text-white transition">Berita Desa</Link></li>
              <li><Link href="/budaya" className="hover:text-white transition">Budaya Obi</Link></li>
              <li><Link href="/galeri" className="hover:text-white transition">Galeri Foto</Link></li>
              <li><Link href="/kkn" className="hover:text-white transition">Tim Kami</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-ocean-100 mb-4 uppercase tracking-wider text-xs">Informasi</h4>
            <ul className="space-y-2 text-sm text-ocean-200">
              <li>📍 Pulau Obi, Halmahera Selatan</li>
              <li>🤝 Kolaborasi KKN UGM & Masyarakat</li>
              <li>📦 Arsip Digital Jangka Panjang</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-ocean-600 mt-8 pt-6 text-center text-sm text-ocean-200">
          © {new Date().getFullYear()} Jawara Obira. Dibuat dengan ❤️ untuk Kawasi.
        </div>
      </div>
    </footer>
  )
}