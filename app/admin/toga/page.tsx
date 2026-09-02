// app/admin/toga/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getAllTogaPlants } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { AlertTriangle, Sprout, Plus } from "lucide-react";
import { TogaSectionBanner } from "@/components/admin/toga/TogaSectionBanner";
import { AdminTogaCard } from "@/components/admin/toga/AdminTogaCard";
import type { TogaPlant } from "@/constants/toga";

export const dynamic = "force-dynamic";

export default async function AdminTogaList() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { data, error } = await getAllTogaPlants();
  const plants = (data ?? []) as TogaPlant[];

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <TogaSectionBanner
          crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Toga" }]}
          title="Manajemen TOGA"
          subtitle="Kelola koleksi tanaman obat keluarga Pulau Obi."
          badgeLabel="Toga"
          badgeIcon={Sprout}
          action={{ href: "/admin/toga/new", label: "Tambah Tanaman", icon: Plus }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data tanaman obat. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : plants.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
            <span className="inline-flex rounded-xl border-2 border-on-surface bg-cream-container text-on-cream p-3">
              <Sprout className="size-6" aria-hidden="true" />
            </span>
            <p className="font-serif text-lg font-black text-on-surface">
              Belum Ada Tanaman Obat
            </p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Tambahkan koleksi tanaman obat keluarga untuk mulai menampilkannya di halaman ini
              dan situs publik.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {plants.map((plant, index) => (
              <AdminTogaCard key={plant.id} plant={plant} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
