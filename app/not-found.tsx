import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <span className="text-6xl mb-4">🌊</span>
      <h1 className="font-serif text-3xl font-bold text-ocean-800 mb-2">Halaman Tidak Ditemukan</h1>
      <p className="text-gray-600 mb-6">Konten yang Anda cari mungkin telah dipindahkan atau belum tersedia.</p>
      <Link href="/" className="px-6 py-3 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition">Kembali ke Beranda</Link>
    </div>
  )
}