// app/admin/fauna-obi/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getAllFauna } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { AlertTriangle, Bird, Plus } from "lucide-react";
import { FaunaSectionBanner } from "@/components/admin/fauna-obi/FaunaSectionBanner";
import { AdminFaunaCard } from "@/components/admin/fauna-obi/AdminFaunaCard";
import type { Fauna } from "@/constants/fauna";

export const dynamic = "force-dynamic";

export default async function AdminFaunaList() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { data, error } = await getAllFauna();
  const faunas = (data ?? []) as Fauna[];

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <FaunaSectionBanner
          crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Fauna Obi" }]}
          title="Manajemen Fauna Obi"
          subtitle="Kelola data satwa endemik Pulau Obi."
          badgeLabel="Fauna Obi"
          badgeIcon={Bird}
          action={{ href: "/admin/fauna-obi/new", label: "Tambah Fauna", icon: Plus }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data fauna. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : faunas.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
            <span className="inline-flex rounded-xl border-2 border-on-surface bg-cream-container text-on-cream p-3">
              <Bird className="size-6" aria-hidden="true" />
            </span>
            <p className="font-serif text-lg font-black text-on-surface">Belum Ada Data Fauna</p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Tambahkan data satwa endemik untuk mulai menampilkannya di halaman ini dan situs
              publik.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {faunas.map((fauna, index) => (
              <AdminFaunaCard key={fauna.id} fauna={fauna} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
