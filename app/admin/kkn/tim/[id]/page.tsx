// app/admin/kkn/tim/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getKKNTeamMemberById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import KKNTeamForm from "@/components/admin/KKNTeamForm";

export default async function AdminKKNTeamFormPage({
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
    const { data, error } = await getKKNTeamMemberById(id);
    if (error || !data) return notFound();
    initialData = data;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {isNew ? "Tambah Anggota" : "Edit Anggota"}
      </h1>
      <KKNTeamForm initialData={initialData} isNew={isNew} />
    </div>
  );
}
