// app/admin/fauna-obi/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getFaunaById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, PenSquare, PlusCircle } from "lucide-react";
import { FaunaSectionBanner } from "@/components/admin/fauna-obi/FaunaSectionBanner";
import FaunaForm from "@/components/admin/FaunaForm";
import type { Fauna } from "@/constants/fauna";

export default async function AdminFaunaFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const isNew = id === "new";

  let initialData: Fauna | null = null;
  if (!isNew) {
    const { data, error } = await getFaunaById(id);
    if (error || !data) return notFound();
    initialData = data as Fauna;
  }

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <FaunaSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Fauna Obi", href: "/admin/fauna-obi" },
            { label: isNew ? "Tambah" : "Edit" },
          ]}
          title={isNew ? "Tambah Fauna" : "Edit Fauna"}
          subtitle={
            isNew
              ? "Dokumentasikan satwa endemik baru Pulau Obi."
              : `Perbarui profil "${initialData?.name_local ?? "satwa ini"}".`
          }
          badgeLabel="Fauna Obi"
          badgeIcon={isNew ? PlusCircle : PenSquare}
          action={{ href: "/admin/fauna-obi", label: "Fauna Obi", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <FaunaForm initialData={initialData} isNew={isNew} />
      </div>
    </main>
  );
}
