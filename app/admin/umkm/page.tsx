import { getAdminUser } from "@/lib/auth";
import { getAllUMKM } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { AlertTriangle, Store, Plus } from "lucide-react";
import { UMKMSectionBanner } from "@/components/admin/umkm/UMKMSectionBanner";
import { AdminUMKMCard, type AdminUMKMCardData } from "@/components/admin/umkm/AdminUMKMCard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUMKMList() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { data, error } = await getAllUMKM();
  const umkms = data as unknown as AdminUMKMCardData[] | null;

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <UMKMSectionBanner
          crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "UMKM" }]}
          title="Manajemen UMKM"
          subtitle="Kelola usaha mikro, kecil, dan menengah lokal Pulau Obi."
          badgeLabel="UMKM"
          badgeIcon={Store}
          action={{ href: "/admin/umkm/new", label: "Tambah UMKM", icon: Plus }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data UMKM. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : !umkms || umkms.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
            <span className="inline-flex rounded-xl border-2 border-on-surface bg-cream-container text-on-cream p-3">
              <Store className="size-6" aria-hidden="true" />
            </span>
            <p className="font-serif text-lg font-black text-on-surface">Belum Ada Data UMKM</p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Daftarkan usaha mikro, kecil, atau menengah untuk mulai menampilkannya di halaman
              ini dan direktori publik.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {umkms.map((item, index) => (
              <AdminUMKMCard key={item.id} item={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
