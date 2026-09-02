// app/admin/budaya/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getCultureById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, PenSquare, PlusCircle } from "lucide-react";
import { BudayaSectionBanner } from "@/components/admin/budaya/BudayaSectionBanner";
import CultureForm, { type CultureRecord } from "@/components/admin/CultureForm";

export default async function AdminCultureFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const isNew = id === "new";

  let initialData: CultureRecord | null = null;
  if (!isNew) {
    const { data, error } = await getCultureById(id);
    if (error || !data) return notFound();

    const record = data as unknown as CultureRecord;
    initialData = {
      ...record,
      village_slug: record.villages?.slug || "",
    };
  }

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <BudayaSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Budaya", href: "/admin/budaya" },
            { label: isNew ? "Tambah" : "Edit" },
          ]}
          title={isNew ? "Tambah Artikel Budaya" : "Edit Artikel Budaya"}
          subtitle={
            isNew
              ? "Dokumentasikan tradisi, kuliner, atau kearifan lokal baru Pulau Obi."
              : `Perbarui detail artikel "${initialData?.title ?? "ini"}".`
          }
          badgeLabel="Budaya"
          badgeIcon={isNew ? PlusCircle : PenSquare}
          action={{ href: "/admin/budaya", label: "Budaya", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <CultureForm initialData={initialData} isNew={isNew} />
      </div>
    </main>
  );
}
