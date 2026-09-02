// app/admin/kkn/jurnal/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getKKNJournalById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, PenSquare, PlusCircle } from "lucide-react";
import { KKNSectionBanner } from "@/components/admin/kkn/KKNSectionBanner";
import KKNJournalForm, { type KKNJournalData } from "@/components/admin/KKNJournalForm";

export default async function AdminKKNJournalFormPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const { date: defaultDate } = await searchParams;
  const isNew = id === "new";

  let initialData: KKNJournalData | null = null;
  if (!isNew) {
    const { data, error } = await getKKNJournalById(id);
    if (error || !data) return notFound();
    initialData = data as KKNJournalData;
  }

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <KKNSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "KKN Hub", href: "/admin/kkn" },
            { label: "Jurnal", href: "/admin/kkn/jurnal" },
            { label: isNew ? "Tambah" : "Edit" },
          ]}
          title={isNew ? "Tambah Jurnal" : "Edit Jurnal"}
          subtitle={
            isNew
              ? "Tulis log kegiatan harian baru untuk didokumentasikan di roster jurnal."
              : `Perbarui log kegiatan "${initialData?.title ?? "jurnal ini"}".`
          }
          badgeLabel="Jurnal KKN"
          badgeIcon={isNew ? PlusCircle : PenSquare}
          action={{ href: "/admin/kkn/jurnal", label: "Jurnal", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <KKNJournalForm initialData={initialData} isNew={isNew} defaultDate={defaultDate} />
      </div>
    </main>
  );
}
