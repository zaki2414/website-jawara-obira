// app/admin/fauna-obi/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getFaunaById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import FaunaForm from "@/components/admin/FaunaForm";

export default async function AdminFaunaFormPage({
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
    const { data, error } = await getFaunaById(id);
    if (error || !data) return notFound();
    initialData = data;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-ocean-800 mb-6">
        {isNew ? "Tambah Fauna" : "Edit Fauna"}
      </h1>
      <FaunaForm initialData={initialData} isNew={isNew} />
    </div>
  );
}
