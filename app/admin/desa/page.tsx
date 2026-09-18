// app/admin/desa/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getAllVillages } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { AlertTriangle, Compass } from "lucide-react";
import { DesaSectionBanner } from "@/components/admin/desa/DesaSectionBanner";
import { AdminVillageCard } from "@/components/admin/desa/AdminVillageCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDesaList() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { data, error } = await getAllVillages();

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <DesaSectionBanner
          crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Desa" }]}
          title="Profil Desa"
          subtitle="Kelola deskripsi, statistik, dan foto Desa Kawasi & Desa Soligi yang tampil di halaman Profil."
          badgeLabel="Desa"
          badgeIcon={Compass}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error || !data ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data desa. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {data.map((village) => (
              <AdminVillageCard key={village.id} village={village} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
