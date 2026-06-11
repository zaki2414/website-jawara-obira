// app/kkn/page.tsx
import Link from "next/link";
import { Users, BookOpen, Rocket, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface KKNMenuPublic {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

export default function KKNPublicHub() {
  const publicMenu: KKNMenuPublic[] = [
    {
      title: "Anggota Tim KKN",
      description:
        "Kenali lebih dekat para mahasiswa yang mengabdi dan pembagian penempatan wilayah tugas mereka.",
      href: "/kkn/tim",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Jurnal Harian",
      description:
        "Ikuti catatan aktivitas, kalender kegiatan, dan cerita harian kami selama pelaksanaan KKN.",
      href: "/kkn/jurnal",
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: "Hasil Program Kerja",
      description:
        "Lihat luaran, metrik dampak, serta sistem informasi yang telah diimplementasikan untuk desa.",
      href: "/kkn/proker",
      icon: <Rocket className="w-6 h-6" />,
    },
  ];

  return (
    <main className="min-h-screen bg-natural-paper py-16 px-4 sm:px-6 lg:px-8">
      {/* HEADER SECTION */}
      <div className="max-w-3xl mx-auto text-center mb-16">
        <span className="inline-flex items-center bg-secondary text-on-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider border border-on-surface hard-shadow-sm mb-4">
          KKN-PPM UGM Periode II 2026
        </span>
        <h1 className="text-4xl sm:text-6xl font-serif font-black text-on-surface tracking-tight mb-4">
          Jawara Obira
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-on-surface-variant font-medium leading-relaxed">
          Gerbang informasi terintegrasi pelaksanaan Kuliah Kerja Nyata.
          Eksplorasi jurnal, dokumentasi, dan realisasi dampak program kerja kami di Pulau Obi.
        </p>
      </div>

      {/* NAVIGATION CARDS GRID */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {publicMenu.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group relative bg-background p-6 rounded-2xl border-2 border-on-surface hard-shadow-sm hover:-translate-x-1 hover:-translate-y-1 hover:hard-shadow-lg transition-all duration-150 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="p-3 bg-surface-container border-2 border-on-surface rounded-xl text-on-surface group-hover:bg-on-surface group-hover:text-background transition-colors duration-150">
                  {item.icon}
                </div>
                {item.badge && (
                  <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest bg-[#ef4444] text-white border-2 border-on-surface hard-shadow-sm">
                    {item.badge}
                  </span>
                )}
              </div>
              
              <h3 className="text-2xl font-serif font-black text-on-surface tracking-tight mb-2">
                {item.title}
              </h3>
              <p className="text-on-surface-variant text-sm font-medium leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-dashed border-outline-variant flex items-center justify-between text-sm font-bold text-on-surface">
              <span>Lihat Selengkapnya</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform duration-150" />
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}