// app/admin/berita/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getAllNews } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { AlertTriangle, Newspaper, Plus } from "lucide-react";
import { BeritaSectionBanner } from "@/components/admin/berita/BeritaSectionBanner";
import { AdminBeritaCard, type AdminBeritaCardData } from "@/components/admin/berita/AdminBeritaCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminNewsList() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { data, error } = await getAllNews();
  const news = data as unknown as AdminBeritaCardData[] | null;

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <BeritaSectionBanner
          crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Berita" }]}
          title="Manajemen Berita"
          subtitle="Kelola artikel berita desa Kawasi & Soligi."
          badgeLabel="Berita"
          badgeIcon={Newspaper}
          action={{ href: "/admin/berita/new", label: "Tambah Berita", icon: Plus }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data berita. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : !news || news.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
            <span className="inline-flex rounded-xl border-2 border-on-surface bg-cream-container text-on-cream p-3">
              <Newspaper className="size-6" aria-hidden="true" />
            </span>
            <p className="font-serif text-lg font-black text-on-surface">Belum Ada Berita</p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Tambahkan artikel berita untuk mulai menampilkannya di halaman ini dan situs
              publik.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item, index) => (
              <AdminBeritaCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
