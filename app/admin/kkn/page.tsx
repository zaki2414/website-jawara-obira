// app/admin/kkn/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface KKNAdminMenu {
  title: string;
  description: string;
  href: string;
  color: string;
  action: string;
  icon: string;
}

export default async function KKNAdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Cek validasi role admin
  const { data: admin } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (admin?.role !== "admin") redirect("/login");

  // Fetch data statistik khusus modul KKN secara paralel
  const [journalsCount, prokersCount, membersCount] = await Promise.all([
    supabase.from("kkn_journals").select("id", { count: "exact", head: true }),
    supabase.from("kkn_prokers").select("id", { count: "exact", head: true }),
    supabase.from("kkn_members").select("id", { count: "exact", head: true }),
  ]);

  const kknStats = {
    tim: membersCount.count ?? 0,
    jurnal: journalsCount.count ?? 0,
    proker: prokersCount.count ?? 0,
  };

  const kknAdminMenu: KKNAdminMenu[] = [
    {
      title: "👥 Manajemen Tim",
      description:
        "Perbarui profil anggota, penempatan posko (Kawasi/Soligi), dan struktur role.",
      href: "/admin/kkn/tim",
      color: "bg-indigo-600 hover:bg-indigo-700",
      action: "Atur Anggota",
      icon: "👥",
    },
    {
      title: "📝 Jurnal Kegiatan",
      description:
        "Kelola log harian, progres lapangan, dan kalender kegiatan sub-unit.",
      href: "/admin/kkn/jurnal",
      color: "bg-amber-500 hover:bg-amber-600",
      action: "Kelola Jurnal",
      icon: "📝",
    },
    {
      title: "🚀 Hasil & Luaran Proker",
      description:
        "Input indikator ketercapaian, unggah sistem informasi, dan metrik dampak.",
      href: "/admin/kkn/proker",
      color: "bg-ocean-600 hover:bg-ocean-700",
      action: "Kelola Proker",
      icon: "🚀",
    },
  ];

  return (
    <main className="min-h-screen bg-sand-50 pb-12">
      {/* Sub-Header */}
      <header className="bg-white border-b border-sand-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
            <Link href="/admin" className="hover:text-ocean-600 transition">
              Dashboard
            </Link>
            <span>/</span>
            <span className="text-gray-800 font-medium">KKN Hub</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-ocean-800">
                🎒 KKN Admin Hub
              </h1>
              <p className="text-gray-500 text-sm mt-0.5">
                Kelola konten program kerja, log harian, dan keanggotaan tim
                ekspedisi.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Ringkasan Angka Data KKN */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-sand-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-amber-50 text-amber-600">
              📝
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {kknStats.jurnal}
              </p>
              <p className="text-xs text-gray-500">Total Jurnal</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-sand-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-ocean-50 text-ocean-600">
              🚀
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">
                {kknStats.proker}
              </p>
              <p className="text-xs text-gray-500">Program Kerja</p>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-sand-200 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-indigo-50 text-indigo-600">
              👥
            </div>
            <div>
              <p className="text-xl font-bold text-gray-800">{kknStats.tim}</p>
              <p className="text-xs text-gray-500">Anggota Tim</p>
            </div>
          </div>
        </section>

        {/* Grid Kontrol Menu KKN */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {kknAdminMenu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group block p-5 rounded-xl shadow-sm border border-sand-200 bg-white hover:shadow-md transition-all ${item.color.replace("hover:", "hover:border-transparent")}`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-serif text-lg font-bold text-ocean-800 mb-1 group-hover:opacity-90">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-xs mb-4 max-w-sm">
                    {item.description}
                  </p>
                  <span className="inline-flex items-center px-3 py-1 bg-white/20 text-ocean-700 text-xs font-medium rounded-md backdrop-blur-sm group-hover:bg-white/30 transition">
                    {item.action} →
                  </span>
                </div>
                <div className="text-3xl opacity-40 group-hover:opacity-90 group-hover:scale-110 transition-all duration-200">
                  {item.icon}
                </div>
              </div>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
