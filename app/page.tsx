import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[65vh] text-center px-4">
      <div className="bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-lg max-w-3xl w-full border border-sand-200">
        <span className="text-5xl mb-4 block">🌴🌊</span>
        <h1 className="font-serif text-3xl md:text-5xl font-bold text-ocean-800 mb-4 leading-tight">
          Selamat Datang di Jawara Obira
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto mb-8 text-lg">
          Portal informasi digital Desa Kawasi & Soligi, Pulau Obi. Jelajahi budaya, berita, dan keindahan alam tropis kami.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/berita" className="px-6 py-3 bg-white text-ocean-700 border border-ocean-200 font-semibold rounded-lg hover:bg-ocean-50 transition">Baca Berita</Link>
          <Link href="/budaya" className="px-6 py-3 bg-white text-ocean-700 border border-ocean-200 font-semibold rounded-lg hover:bg-ocean-50 transition">Eksplor Budaya</Link>
          <Link href="/galeri" className="px-6 py-3 bg-white text-ocean-700 border border-ocean-200 font-semibold rounded-lg hover:bg-ocean-50 transition">Lihat Galeri</Link>
        </div>
      </div>
    </div>
  )
}