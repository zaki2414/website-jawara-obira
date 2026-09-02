// app/admin/peta/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getMapFacilityById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, PenSquare } from "lucide-react";
import { PetaSectionBanner } from "@/components/admin/peta/PetaSectionBanner";
import PetaFacilityForm from "@/components/admin/PetaFacilityForm";
import type { MapFacility } from "@/constants/peta";

export default async function AdminFacilityFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const { data, error } = await getMapFacilityById(id);
  if (error || !data) return notFound();

  const facility = data as MapFacility;

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <PetaSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Peta", href: "/admin/peta" },
            { label: "Edit" },
          ]}
          title="Edit Fasilitas Umum"
          subtitle={`Perbarui deskripsi & foto "${facility.name}".`}
          badgeLabel="Peta"
          badgeIcon={PenSquare}
          action={{ href: "/admin/peta", label: "Peta", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <PetaFacilityForm initialData={facility} />
      </div>
    </main>
  );
}
