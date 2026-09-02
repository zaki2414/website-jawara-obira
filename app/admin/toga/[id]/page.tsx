// app/admin/toga/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getTogaPlantById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, PenSquare, PlusCircle } from "lucide-react";
import { TogaSectionBanner } from "@/components/admin/toga/TogaSectionBanner";
import TogaPlantForm from "@/components/admin/TogaPlantForm";
import type { TogaPlant } from "@/constants/toga";

export default async function AdminTogaFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const isNew = id === "new";

  let initialData: TogaPlant | null = null;
  if (!isNew) {
    const { data, error } = await getTogaPlantById(id);
    if (error || !data) return notFound();
    initialData = data as TogaPlant;
  }

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <TogaSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Toga", href: "/admin/toga" },
            { label: isNew ? "Tambah" : "Edit" },
          ]}
          title={isNew ? "Tambah Tanaman Obat" : "Edit Tanaman Obat"}
          subtitle={
            isNew
              ? "Dokumentasikan tanaman obat keluarga baru Pulau Obi."
              : `Perbarui detail tanaman "${initialData?.name_id ?? "ini"}".`
          }
          badgeLabel="Toga"
          badgeIcon={isNew ? PlusCircle : PenSquare}
          action={{ href: "/admin/toga", label: "Toga", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <TogaPlantForm initialData={initialData} isNew={isNew} />
      </div>
    </main>
  );
}
