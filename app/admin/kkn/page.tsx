// app/admin/kkn/page.tsx
import { redirect } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { getAdminUser } from "@/lib/auth";
import { getKKNHubStats } from "@/lib/supabase/queries";
import { KKN_HUB_MENU_ITEMS, KKN_HUB_STAT_META } from "@/constants/kknAdmin";
import { KKNHubHero } from "@/components/admin/kkn/KKNHubHero";
import { KKNStatCard } from "@/components/admin/kkn/KKNStatCard";
import { KKNMenuGrid } from "@/components/admin/kkn/KKNMenuGrid";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function KKNAdminHub() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { data: stats, error: statsError } = await getKKNHubStats();

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <KKNHubHero />
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
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {KKN_HUB_STAT_META.map((stat) => (
                <KKNStatCard
                  key={stat.key}
                  label={stat.label}
                  value={stats[stat.key]}
                  icon={stat.icon}
                  emptyHint={stat.emptyHint}
                />
              ))}
            </div>
          )}
        </section>

        {/* Menu Pengelolaan */}
        <section>
          <h2 className="mb-4 font-serif text-xl font-black text-on-surface">
            Menu Pengelolaan
          </h2>
          <KKNMenuGrid items={KKN_HUB_MENU_ITEMS} />
        </section>
      </div>
    </main>
  );
}
