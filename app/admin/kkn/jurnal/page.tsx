// app/admin/kkn/jurnal/page.tsx
import { getKKNJournalsByMonth } from "@/lib/supabase/queries";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminKKNJournalList({
  searchParams,
}: {
  searchParams: { year?: string; month?: string };
}) {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const year = parseInt(searchParams.year || currentYear.toString());
  const month = parseInt(searchParams.month || currentMonth.toString());

  const { data: groupedJournals } = await getKKNJournalsByMonth(year, month);

  // Flatten grouped data for admin list
  const flatList = Object.values(groupedJournals || {}).flat();

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Manajemen Jurnal KKN</h1>
        <Link
          href="/admin/kkn/jurnal/new"
          className="bg-ocean-600 text-ocean-600 px-4 py-2 rounded text-sm"
        >
          + Tambah Jurnal
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-sand-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-sand-50 border-b">
            <tr>
              <th className="p-4 font-medium">Tanggal</th>
              <th className="p-4 font-medium">Judul</th>
              <th className="p-4 font-medium">Desa</th>
              <th className="p-4 font-medium text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {flatList.map((j: any) => (
              <tr key={j.id} className="hover:bg-sand-50">
                <td className="p-4">{j.activity_date}</td>
                <td className="p-4 font-medium">{j.title}</td>
                {/* ✅ PERBAIKAN: Jika villages?.name kosong/null, tampilkan "Umum / Kedua Desa" */}
                <td className="p-4">
                  {j.villages?.name ? (
                    j.villages.name
                  ) : (
                    <span className="text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded text-xs border border-amber-200">
                      Umum / Kedua Desa
                    </span>
                  )}
                </td>
                <td className="p-4 text-center space-x-2">
                  <Link
                    href={`/admin/kkn/jurnal/${j.id}`}
                    className="text-ocean-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <DeleteButton
                    table="kkn_journals"
                    id={j.id}
                    title={j.title}
                    redirectAfter="/admin/kkn/jurnal"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {flatList.length === 0 && (
          <p className="p-6 text-center text-gray-500">
            Belum ada jurnal bulan ini.
          </p>
        )}
      </div>
    </div>
  );
}
