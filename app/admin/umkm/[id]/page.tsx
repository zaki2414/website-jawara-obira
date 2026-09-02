import { getAdminUser } from "@/lib/auth";
import { getUMKMById } from "@/lib/supabase/queries";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft, PenSquare, PlusCircle } from "lucide-react";
import { UMKMSectionBanner } from "@/components/admin/umkm/UMKMSectionBanner";
import UMKMForm, { type UMKMFormInitialData } from "@/components/admin/UMKMForm";

export default async function AdminUMKMFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const isNew = id === "new";

  let initialData: UMKMFormInitialData | null = null;
  if (!isNew) {
    const { data, error } = await getUMKMById(id);
    if (error || !data) return notFound();

    initialData = data as unknown as UMKMFormInitialData;
  }

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <UMKMSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "UMKM", href: "/admin/umkm" },
            { label: isNew ? "Tambah" : "Edit" },
          ]}
          title={isNew ? "Tambah UMKM Baru" : "Edit UMKM"}
          subtitle={
            isNew
              ? "Daftarkan usaha mikro, kecil, atau menengah baru ke direktori."
              : `Perbarui detail, galeri, dan daftar produk "${initialData?.name ?? "usaha ini"}".`
          }
          badgeLabel="UMKM"
          badgeIcon={isNew ? PlusCircle : PenSquare}
          action={{ href: "/admin/umkm", label: "UMKM", icon: ArrowLeft }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <UMKMForm initialData={initialData} isNew={isNew} />
      </div>
    </main>
  );
}
