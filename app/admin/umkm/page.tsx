import { getAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminUMKMList() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: umkms } = await supabase
    .from("umkm")
    .select("id, name, slug, business_type, villages(name)")
    .order("name");

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-ocean-800">
          🏪 Manajemen UMKM
        </h1>
        <Link
          href="/admin/umkm/new"
          className="px-4 py-2 bg-ocean-600 text-ocean-700 rounded-lg hover:bg-ocean-700 transition"
        >
          + Tambah UMKM
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sand-50 border-b border-sand-200">
            <tr>
              <th className="p-4 font-medium text-gray-600">Nama</th>
              <th className="p-4 font-medium text-gray-600">Jenis</th>
              <th className="p-4 font-medium text-gray-600">Desa</th>
              <th className="p-4 font-medium text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {umkms?.map((item: any) => (
              <tr key={item.id} className="hover:bg-sand-50">
                <td className="p-4 font-medium text-gray-800">{item.name}</td>
                <td className="p-4 text-gray-600 capitalize">
                  {item.business_type?.replace("_", " ")}
                </td>
                <td className="p-4 text-gray-500">{item.villages?.name}</td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/admin/umkm/${item.id}`}
                    className="text-tropic-600 hover:text-tropic-700 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    table={"umkm" as any}
                    id={item.id}
                    title={item.name}
                    redirectAfter="/admin/umkm"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!umkms || umkms.length === 0) && (
          <p className="p-6 text-center text-gray-500">Belum ada data UMKM.</p>
        )}
      </div>
    </div>
  );
}
