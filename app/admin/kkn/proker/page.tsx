// app/admin/kkn/proker/page.tsx
import { getAllKKNProkersAdmin } from "@/lib/supabase/queries";
import { AlertTriangle, Plus, Image as ImageIcon } from "lucide-react";
import { KKNSectionBanner } from "@/components/admin/kkn/KKNSectionBanner";
import { KKNProkerCard, type KKNProkerCardData } from "@/components/admin/kkn/KKNProkerCard";

export const dynamic = "force-dynamic";

export default async function AdminKKNProkerList() {
  const { data, error } = await getAllKKNProkersAdmin();
  const prokers = data as unknown as KKNProkerCardData[] | null;

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <KKNSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "KKN Hub", href: "/admin/kkn" },
            { label: "Program Kerja" },
          ]}
          title="Manajemen Program Dampak"
          subtitle="Kelola program kerja unggulan dan capaian dampaknya."
          badgeLabel="Proker KKN"
          badgeIcon={ImageIcon}
          action={{ href: "/admin/kkn/proker/new", label: "Tambah Program", icon: Plus }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data program kerja. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : !prokers || prokers.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
            <span className="inline-flex rounded-xl border-2 border-on-surface bg-primary-container p-3 text-on-primary-container">
              <ImageIcon className="size-6" aria-hidden="true" />
            </span>
            <p className="font-serif text-lg font-black text-on-surface">
              Belum Ada Program Kerja
            </p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Tambahkan program kerja unggulan untuk mulai menampilkan capaian dampaknya di
              halaman ini dan situs publik.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {prokers.map((proker, index) => (
              <KKNProkerCard key={proker.id} proker={proker} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
