// app/kkn/page.tsx
import Link from "next/link";

export const dynamic = "force-dynamic";

interface KKNMenuPublic {
  title: string;
  description: string;
  href: string;
  icon: string;
  badge?: string;
}

export default function KKNPublicHub() {
  const publicMenu: KKNMenuPublic[] = [
    {
      title: "👥 Anggota Tim KKN",
      description:
        "Kenali lebih dekat para mahasiswa yang mengabdi dan pembagian penempatan wilayah tugas mereka.",
      href: "/kkn/tim",
      icon: "👥",
    },
    {
      title: "📖 Jurnal Harian",
      description:
        "Ikuti catatan aktivitas, kalender kegiatan, dan cerita harian kami selama pelaksanaan KKN.",
      href: "/kkn/jurnal",
      icon: "📖",
    },
    {
      title: "🚀 Hasil Program Kerja",
      description:
        "Lihat luaran, metrik dampak, serta sistem informasi yang telah diimplementasikan untuk desa.",
      href: "/kkn/proker",
      icon: "🚀",
      badge: "Impact",
    },
  ];

  return (
    <main className="min-h-screen bg-sand-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <span className="text-tropic-600 font-semibold tracking-wide uppercase text-sm">
          KKN-PPM UGM Periode II 2026
        </span>
        <h1 className="mt-2 text-4xl font-serif font-bold text-ocean-800 tracking-tight sm:text-5xl">
          Jawara Obira
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
          Gerbang informasi terintegrasi pelaksanaan Kuliah Kerja Nyata.
          Eksplorasi jurnal, dokumentasi, dan dampak proker kami.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {publicMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative bg-white p-6 rounded-2xl border border-sand-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{item.icon}</span>
                {item.badge && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-tropic-50 text-tropic-700 border border-tropic-200">
                    {item.badge}
                  </span>
                )}
              </div>
              <h3 className="text-xl font-serif font-bold text-ocean-800 group-hover:text-ocean-600 transition-colors">
                {item.title.substring(3)}{" "}
                {/* Memotong emoji di text agar tidak double */}
              </h3>
              <p className="mt-2 text-gray-500 text-sm leading-relaxed">
                {item.description}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-sand-100 flex items-center text-sm font-medium text-ocean-600 group-hover:text-ocean-700">
              Lihat Selengkapnya{" "}
              <span className="ml-1 transform group-hover:translate-x-1 transition-transform">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
