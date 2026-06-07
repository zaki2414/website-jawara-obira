// app/admin/kkn/proker/page.tsx
import { getAllKKNProkers } from "@/lib/supabase/queries";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminKKNProkerList() {
  const { data: prokers, error } = await getAllKKNProkers();
  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error: {String(error)}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Manajemen Program Dampak</h1>
        <Link
          href="/admin/kkn/proker/new"
          className="bg-ocean-600 text-ocean-600 px-4 py-2 rounded text-sm"
        >
          + Tambah Program
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 border-b">
            <tr>
              <th className="p-4 font-medium">Judul</th>
              <th className="p-4 font-medium">Desa</th>
              <th className="p-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {prokers?.map((p: any) => (
              <tr key={p.id} className="hover:bg-sand-50">
                <td className="p-4 font-medium">{p.title}</td>
                <td className="p-4">{p.villages?.name || "Umum"}</td>
                <td className="p-4 text-center space-x-2">
                  <Link
                    href={`/admin/kkn/proker/${p.id}`}
                    className="text-ocean-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    table="kkn_prokers"
                    id={p.id}
                    title={p.title}
                    redirectAfter="/admin/kkn/proker"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!prokers || prokers.length === 0) && (
          <p className="p-6 text-center text-gray-500">Belum ada program.</p>
        )}
      </div>
    </div>
  );
}
