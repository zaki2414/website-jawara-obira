// app/admin/desa/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getVillageById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, PenSquare } from "lucide-react";
import { DesaSectionBanner } from "@/components/admin/desa/DesaSectionBanner";
import VillageForm, { type VillageFormInitialData } from "@/components/admin/VillageForm";

export default async function AdminVillageFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const { data, error } = await getVillageById(id);
  if (error || !data) return notFound();

  const village = data as unknown as VillageFormInitialData;

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <DesaSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Desa", href: "/admin/desa" },
            { label: "Edit" },
          ]}
          title="Edit Profil Desa"
          subtitle={`Perbarui deskripsi, statistik, dan foto "${village.name}".`}
          badgeLabel="Desa"
          badgeIcon={PenSquare}
          action={{ href: "/admin/desa", label: "Desa", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <VillageForm initialData={village} />
      </div>
    </main>
  );
}
