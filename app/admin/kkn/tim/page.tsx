// app/admin/kkn/tim/page.tsx
import { getAllKKNTeamMembers } from "@/lib/supabase/queries";
import { AlertTriangle, Plus, Users } from "lucide-react";
import { KKNSectionBanner } from "@/components/admin/kkn/KKNSectionBanner";
import { KKNTeamMemberCard, type KKNTeamMemberCardData } from "@/components/admin/kkn/KKNTeamMemberCard";

export const dynamic = "force-dynamic";

export default async function AdminKKNTeamList() {
  const { data, error } = await getAllKKNTeamMembers();
  const members = data as KKNTeamMemberCardData[] | null;

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <KKNSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "KKN Hub", href: "/admin/kkn" },
            { label: "Tim" },
          ]}
          title="Manajemen Tim KKN"
          subtitle="Kelola profil anggota, penempatan posko, dan struktur peran."
          badgeLabel="Tim KKN"
          badgeIcon={Users}
          action={{ href: "/admin/kkn/tim/new", label: "Tambah Anggota", icon: Plus }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data tim. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : !members || members.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
            <span className="inline-flex rounded-xl border-2 border-on-surface bg-primary-container p-3 text-on-primary-container">
              <Users className="size-6" aria-hidden="true" />
            </span>
            <p className="font-serif text-lg font-black text-on-surface">
              Belum Ada Anggota Tim
            </p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Tambahkan profil anggota tim KKN untuk mulai menampilkan roster di halaman ini
              dan situs publik.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member, index) => (
              <KKNTeamMemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
