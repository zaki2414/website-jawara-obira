// app/admin/kkn/jurnal/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getKKNJournalById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import KKNJournalForm from "@/components/admin/KKNJournalForm";

export default async function AdminKKNJournalFormPage({
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
    const { data, error } = await getKKNJournalById(id);
    if (error || !data) return notFound();
    initialData = data;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {isNew ? "Tambah Jurnal" : "Edit Jurnal"}
      </h1>
      <KKNJournalForm initialData={initialData} isNew={isNew} />
    </div>
  );
}
