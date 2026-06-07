import { getAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import UMKMForm from "@/components/admin/UMKMForm";

export default async function AdminUMKMFormPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const isNew = id === "new";

  let initialData: any = null;
  if (!isNew) {
    const supabase = await createClient();
    // Fetch main data
    const { data: umkm } = await supabase
      .from("umkm")
      .select("*")
      .eq("id", id)
      .single();
    if (!umkm) return notFound();

    // Fetch relations
    const { data: gallery } = await supabase
      .from("umkm_gallery")
      .select("*")
      .eq("umkm_id", id);
    const { data: features } = await supabase
      .from("umkm_features")
      .select("feature")
      .eq("umkm_id", id);
    const { data: categories } = await supabase
      .from("umkm_category_items")
      .select("category_id")
      .eq("umkm_id", id);
    const { data: products } = await supabase
      .from("umkm_products")
      .select("item_name, category_id")
      .eq("umkm_id", id);

    initialData = {
      ...umkm,
      gallery,
      features: features?.map((f) => f.feature) || [],
      categories,
      products,
    };
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-ocean-800 mb-6">
        {isNew ? " Tambah UMKM Baru" : "✏️ Edit UMKM"}
      </h1>
      <UMKMForm initialData={initialData} isNew={isNew} />
    </div>
  );
}
