// app/admin/budaya/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getAllCulture } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { AlertTriangle, Landmark, Plus } from "lucide-react";
import { BudayaSectionBanner } from "@/components/admin/budaya/BudayaSectionBanner";
import {
  AdminCultureCard,
  type AdminCultureCardData,
} from "@/components/admin/budaya/AdminCultureCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminCultureList() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { data, error } = await getAllCulture();
  const culture = data as unknown as AdminCultureCardData[] | null;

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <BudayaSectionBanner
          crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Budaya" }]}
          title="Manajemen Budaya"
          subtitle="Kelola artikel budaya & kearifan lokal Pulau Obi."
          badgeLabel="Budaya"
          badgeIcon={Landmark}
          action={{ href: "/admin/budaya/new", label: "Tambah Artikel", icon: Plus }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data artikel budaya. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : !culture || culture.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
            <span className="inline-flex rounded-xl border-2 border-on-surface bg-primary-container text-on-primary-container p-3">
              <Landmark className="size-6" aria-hidden="true" />
            </span>
            <p className="font-serif text-lg font-black text-on-surface">
              Belum Ada Artikel Budaya
            </p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Tambahkan artikel budaya &amp; kearifan lokal untuk mulai menampilkannya di
              halaman ini dan situs publik.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {culture.map((item, index) => (
              <AdminCultureCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
