// app/admin/berita/[id]/page.tsx
import { getAdminUser } from "@/lib/auth";
import { getNewsById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, PenSquare, PlusCircle } from "lucide-react";
import { BeritaSectionBanner } from "@/components/admin/berita/BeritaSectionBanner";
import NewsForm, { type NewsRecord } from "@/components/admin/NewsForm";

export default async function AdminNewsFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const isNew = id === "new";

  let initialData: NewsRecord | null = null;
  if (!isNew) {
    const { data, error } = await getNewsById(id);
    if (error || !data) return notFound();

    initialData = data as unknown as NewsRecord;
  }

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <BeritaSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "Berita", href: "/admin/berita" },
            { label: isNew ? "Tambah" : "Edit" },
          ]}
          title={isNew ? "Tambah Artikel Berita" : "Edit Artikel Berita"}
          subtitle={
            isNew
              ? "Publikasikan kabar terbaru dari desa Kawasi & Soligi."
              : `Perbarui detail artikel "${initialData?.title ?? "ini"}".`
          }
          badgeLabel="Berita"
          badgeIcon={isNew ? PlusCircle : PenSquare}
          action={{ href: "/admin/berita", label: "Berita", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <NewsForm initialData={initialData} isNew={isNew} />
      </div>
    </main>
  );
}
