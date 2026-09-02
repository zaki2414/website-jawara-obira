// app/admin/kkn/proker/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getKKNProkerById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, PenSquare, PlusCircle } from "lucide-react";
import { KKNSectionBanner } from "@/components/admin/kkn/KKNSectionBanner";
import KKNProkerForm, { type KKNProkerData } from "@/components/admin/KKNProkerForm";

export default async function AdminKKNProkerFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const isNew = id === "new";

  let initialData: KKNProkerData | null = null;
  if (!isNew) {
    const { data, error } = await getKKNProkerById(id);
    if (error || !data) return notFound();
    initialData = data as KKNProkerData;
  }

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <KKNSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "KKN Hub", href: "/admin/kkn" },
            { label: "Program Kerja", href: "/admin/kkn/proker" },
            { label: isNew ? "Tambah" : "Edit" },
          ]}
          title={isNew ? "Tambah Program Kerja" : "Edit Program Kerja"}
          subtitle={
            isNew
              ? "Dokumentasikan program kerja baru beserta capaian dampaknya."
              : `Perbarui detail program "${initialData?.title ?? "ini"}".`
          }
          badgeLabel="Proker KKN"
          badgeIcon={isNew ? PlusCircle : PenSquare}
          action={{ href: "/admin/kkn/proker", label: "Proker", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <KKNProkerForm initialData={initialData} isNew={isNew} />
      </div>
    </main>
  );
}
