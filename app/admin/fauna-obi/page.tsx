// app/admin/fauna-obi/page.tsx
import { getAllFauna } from "@/lib/supabase/queries";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminFaunaList() {
  const { data: faunas, error } = await getAllFauna();
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
        <h1 className="text-2xl font-bold text-ocean-800">
          Manajemen Fauna Obi
        </h1>
        <Link
          href="/admin/fauna-obi/new"
          className="bg-ocean-600 text-ocean-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition"
        >
          + Tambah Fauna
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 border-b border-sand-200">
            <tr>
              <th className="p-4 font-medium text-gray-700">Nama Lokal</th>
              <th className="p-4 font-medium text-gray-700">Nama Ilmiah</th>
              <th className="p-4 font-medium text-gray-700">Kelas</th>
              <th className="p-4 font-medium text-gray-700">Status IUCN</th>
              <th className="p-4 font-medium text-gray-700 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {faunas?.map((f: any) => (
              <tr key={f.id} className="hover:bg-sand-50">
                <td className="p-4 font-medium text-gray-800">
                  {f.name_local}
                </td>
                <td className="p-4 text-gray-600 italic">
                  {f.name_scientific}
                </td>
                <td className="p-4">{f.class}</td>
                <td className="p-4">
                  {f.iucn_status && (
                    <span className="px-2 py-1 bg-ocean-50 text-ocean-700 text-xs rounded-full font-bold">
                      {f.iucn_status}
                    </span>
                  )}
                </td>
                <td className="p-4 text-center space-x-2">
                  <Link
                    href={`/admin/fauna-obi/${f.id}`}
                    className="text-ocean-600 hover:text-ocean-700 font-medium"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    table="fauna_obi"
                    id={f.id}
                    title={f.name_local}
                    redirectAfter="/admin/fauna-obi"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!faunas || faunas.length === 0) && (
          <p className="p-6 text-center text-gray-500">Belum ada data fauna.</p>
        )}
      </div>
    </div>
  );
}
