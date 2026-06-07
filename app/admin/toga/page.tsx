// app/admin/toga/page.tsx
import { getAllTogaPlants } from "@/lib/supabase/queries";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminTogaList() {
  const { data: plants, error } = await getAllTogaPlants();

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
        <h1 className="text-2xl font-bold text-ocean-800">Manajemen TOGA</h1>
        <Link
          href="/admin/toga/new"
          className="bg-ocean-600 text-ocean-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-ocean-700 transition"
        >
          + Tambah Tanaman
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 border-b border-sand-200">
            <tr>
              <th className="p-4 font-medium text-gray-700">Nama Tanaman</th>
              <th className="p-4 font-medium text-gray-700 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {plants?.map((plant: any) => (
              <tr key={plant.id} className="hover:bg-sand-50">
                <td className="p-4">
                  <div className="font-medium text-gray-800">
                    {plant.name_id}
                  </div>
                </td>
                <td className="p-4 text-center space-x-2">
                  <Link
                    href={`/admin/toga/${plant.id}`}
                    className="text-ocean-600 hover:text-ocean-700 font-medium"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    table="toga_plants"
                    id={plant.id}
                    title={plant.name_id}
                    redirectAfter="/admin/toga"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!plants || plants.length === 0) && (
          <p className="p-6 text-center text-gray-500">
            Belum ada tanaman obat.
          </p>
        )}
      </div>
    </div>
  );
}
