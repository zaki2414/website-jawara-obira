// app/admin/kkn/proker/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getKKNProkerBySlug } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import KKNProkerForm from "@/components/admin/KKNProkerForm";

export default async function AdminKKNProkerFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const isNew = id === "new";

  let initialData = null;
  if (!isNew) {
    const { data, error } = await getKKNProkerBySlug(id);
    if (error || !data) return notFound();
    initialData = data;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {isNew ? "Tambah Program Kerja" : "Edit Program Kerja"}
      </h1>
      <KKNProkerForm initialData={initialData} isNew={isNew} />
    </div>
  );
}
