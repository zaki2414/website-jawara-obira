// app/admin/kkn/tim/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getKKNTeamMemberById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, Users } from "lucide-react";
import { KKNSectionBanner } from "@/components/admin/kkn/KKNSectionBanner";
import KKNTeamForm, { type KKNTeamMemberData } from "@/components/admin/KKNTeamForm";

export default async function AdminKKNTeamFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const isNew = id === "new";

  let initialData: KKNTeamMemberData | null = null;
  if (!isNew) {
    const { data, error } = await getKKNTeamMemberById(id);
    if (error || !data) return notFound();
    initialData = data as KKNTeamMemberData;
  }

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <KKNSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "KKN Hub", href: "/admin/kkn" },
            { label: "Tim", href: "/admin/kkn/tim" },
            { label: isNew ? "Tambah" : "Edit" },
          ]}
          title={isNew ? "Tambah Anggota" : "Edit Anggota"}
          subtitle={
            isNew
              ? "Lengkapi profil anggota baru untuk ditampilkan di roster tim."
              : `Perbarui profil ${initialData?.name ?? "anggota"}.`
          }
          badgeLabel="Tim KKN"
          badgeIcon={Users}
          action={{ href: "/admin/kkn/tim", label: "Tim", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <KKNTeamForm initialData={initialData} isNew={isNew} />
      </div>
    </main>
  );
}
