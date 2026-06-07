// app/admin/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Cek role admin
  const { data: admin } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (admin?.role !== "admin") redirect("/login");

  // (Opsional) Fetch hitungan data untuk statistik dashboard
  const [newsCount, cultureCount, galleryCount, umkmCount] = await Promise.all([
    supabase.from("news").select("id", { count: "exact", head: true }),
    supabase
      .from("culture_articles")
      .select("id", { count: "exact", head: true }),
    supabase.from("galleries").select("id", { count: "exact", head: true }),
    supabase.from("umkm").select("id", { count: "exact", head: true }),
  ]);

  const stats = {
    berita: newsCount.count ?? 0,
    budaya: cultureCount.count ?? 0,
    galeri: galleryCount.count ?? 0,
    umkm: umkmCount.count ?? 0,
  };

  // Definisi Menu Admin
  const menuItems = [
    {
      title: "📰 Manajemen Berita",
      description: "Tambah, edit, atau hapus berita desa Kawasi & Soligi.",
      href: "/admin/berita",
      color: "bg-ocean-600 hover:bg-ocean-700",
      action: "Kelola Berita",
    },
    {
      title: "🎭 Manajemen Budaya",
      description: "Kelola artikel budaya & kearifan lokal Pulau Obi.",
      href: "/admin/budaya",
      color: "bg-tropic-500 hover:bg-tropic-600",
      action: "Kelola Budaya",
    },
    {
      title: "📸 Galeri Foto",
      description: "Upload & atur foto kegiatan, alam, dan dokumentasi.",
      href: "/admin/galeri",
      color: "bg-indigo-600 hover:bg-indigo-700",
      action: "Upload Foto",
    },
    {
      title: "🛒 Manajemen UMKM",
      description: "Kelola usaha mikro, kecil, dan menengah lokal.",
      href: "/admin/umkm",
      color: "bg-emerald-600 hover:bg-emerald-700",
      action: "Kelola UMKM",
    },
    {
      title: "🪱 Manajemen Fauna",
      description: "Kelola data fauna Obi",
      href: "/admin/fauna-obi",
      color: "bg-emerald-600 hover:bg-emerald-700",
      action: "Kelola Fauna Obi",
    },
    {
      title: "🪴 Manajemen Library Toga",
      description: "Kelola koleksi tanaman toga.",
      href: "/admin/toga",
      color: "bg-emerald-600 hover:bg-emerald-700",
      action: "Kelola Toga",
    },
    {
      title: "�🎒 KKN Hub",
      description: "Kelola profil anggota, jurnal harian, dan proker tim.",
      href: "/admin/kkn",
      color: "bg-amber-500 hover:bg-amber-600",
      action: "Kelola KKN",
    },
  ];

  return (
    <main className="min-h-screen bg-sand-50 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-sand-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl font-bold text-ocean-800">
                🛡️ Dashboard Admin
              </h1>
              <p className="text-gray-500 mt-1">
                Selamat datang,{" "}
                <span className="font-medium text-gray-700">
                  {user.user_metadata.full_name}
                </span>
              </p>
            </div>
            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium text-sm flex items-center gap-2"
              >
                <span>🚪</span> Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistik Ringkas */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
          <StatCard
            label="Total Berita"
            value={stats.berita}
            icon="📰"
            color="text-ocean-600 bg-ocean-50"
          />
          <StatCard
            label="Artikel Budaya"
            value={stats.budaya}
            icon="🎭"
            color="text-tropic-600 bg-tropic-50"
          />
          <StatCard
            label="Foto Galeri"
            value={stats.galeri}
            icon="📸"
            color="text-indigo-600 bg-indigo-50"
          />
          <StatCard
            label="Data UMKM"
            value={stats.umkm}
            icon="🏪"
            color="text-emerald-600 bg-emerald-50"
          />
        </section>

        {/* Menu Grid */}
        <section>
          <h2 className="font-serif text-xl font-bold text-ocean-800 mb-6">
            Menu Administrasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group block p-6 rounded-xl shadow-sm border border-sand-200 bg-white hover:shadow-md transition-all ${item.color.replace("hover:", "hover:border-transparent")}`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-ocean-700 mb-2 group-hover:opacity-90">
                      {item.title}
                    </h3>
                    <p className="text-ocean-600 text-sm mb-4">
                      {item.description}
                    </p>
                    <span className="inline-flex items-center px-3 py-1.5 bg-white/20 text-ocean-700 text-xs font-medium rounded-lg backdrop-blur-sm group-hover:bg-white/30 transition">
                      {item.action} →
                    </span>
                  </div>
                  <div className="text-4xl opacity-80 group-hover:scale-110 transition-transform">
                    {item.title.split(" ")[0]}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

// Komponen Kecil untuk Statistik
function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-sand-200 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}
