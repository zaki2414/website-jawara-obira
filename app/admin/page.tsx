// app/admin/page.tsx
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import { getAdminDashboardStats } from "@/lib/supabase/queries";
import { ADMIN_MENU_ITEMS, ADMIN_STAT_META } from "@/constants/admin";
import { DashboardHero } from "@/components/admin/dashboard/DashboardHero";
import { StatCard } from "@/components/admin/StatCard";
import { MenuGrid } from "@/components/admin/dashboard/MenuGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboard() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { data: stats, error: statsError } = await getAdminDashboardStats();
  const displayName = user.user_metadata?.full_name || user.email || "Admin";

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <DashboardHero name={displayName} />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Statistik Ringkas */}
        <section className="mb-12">
          <h2 className="mb-4 font-serif text-xl font-black text-on-surface">
            Statistik Ringkas
          </h2>
          {statsError || !stats ? (
            <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
              <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
              Gagal memuat statistik. Muat ulang halaman untuk mencoba lagi.
            </div>
          ) : (
            // lg:grid-cols-3 mengikuti jumlah kartu statistik yang ada
            // (ADMIN_STAT_META). Dulu 4 kolom untuk 4 kartu; sejak kartu
            // "Total Berita" ikut terhapus bersama seksi Berita, kolom
            // keempat tinggal lubang kosong di ujung baris.
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ADMIN_STAT_META.map((stat) => (
                <StatCard
                  key={stat.key}
                  label={stat.label}
                  value={stats[stat.key]}
                  icon={stat.icon}
                  accent={stat.accent}
                  emptyHint={stat.emptyHint}
                />
              ))}
            </div>
          )}
        </section>

        {/* Menu Grid */}
        <section>
          <h2 className="mb-4 font-serif text-xl font-black text-on-surface">
            Menu Administrasi
          </h2>
          <MenuGrid items={ADMIN_MENU_ITEMS} />
        </section>
      </div>
    </main>
  );
}
