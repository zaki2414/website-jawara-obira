// app/admin/berita/page.tsx
import { getAdminUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminNewsList() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: news } = await supabase
    .from("news")
    .select("id, title, slug, villages(name), published_at")
    .order("published_at", { ascending: false });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-serif text-2xl font-bold text-ocean-800">
          📰 Manajemen Berita
        </h1>
        <Link
          href="/admin/berita/new"
          className="px-4 py-2 bg-ocean-600 text-black rounded-lg hover:bg-ocean-700 transition"
        >
          + Tambah Berita
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-sand-50 border-b border-sand-200">
            <tr>
              <th className="p-4 font-medium text-gray-600">Judul</th>
              <th className="p-4 font-medium text-gray-600">Desa</th>
              <th className="p-4 font-medium text-gray-600">Tanggal</th>
              <th className="p-4 font-medium text-gray-600 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand-100">
            {news?.map((item: any) => (
              <tr key={item.id} className="hover:bg-sand-50">
                <td className="p-4">
                  <Link
                    href={`/berita/${item.villages?.slug || "kawasi"}/${item.slug}`}
                    className="text-ocean-600 hover:underline font-medium"
                  >
                    {item.title}
                  </Link>
                </td>
                <td className="p-4 text-gray-600">{item.villages?.name}</td>
                <td className="p-4 text-gray-500 text-sm">
                  {formatDate(item.published_at)}
                </td>
                <td className="p-4 text-right space-x-2">
                  <Link
                    href={`/admin/berita/${item.id}`}
                    className="text-tropic-600 hover:text-tropic-700 text-sm font-medium"
                  >
                    Edit
                  </Link>
                  <DeleteButton table="news" id={item.id} title={item.title} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!news || news.length === 0) && (
          <p className="p-6 text-center text-gray-500">Belum ada berita.</p>
        )}
      </div>
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
