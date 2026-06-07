//app/berita/[desa]/page.tsx
import { getNewsByVillageSlug } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

export const revalidate = 3600;

export default async function VillageNews({
  params,
}: {
  params: Promise<{ desa: string }>;
}) {
  const { desa } = await params;
  const { data: news, error } = await getNewsByVillageSlug(desa);
  if (error) return notFound();

  const desaName = desa === "kawasi" ? "Kawasi" : "Soligi";

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="font-serif text-3xl font-bold text-ocean-800 mb-2">
        Berita {desaName}
      </h1>
      <p className="text-gray-600 mb-8">Kabar terbaru dari Desa {desaName}.</p>

      <div className="space-y-6">
        {news?.map((item: any) => (
          <Link
            key={item.id}
            href={`/berita/${desa}/${item.slug}`}
            className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-xl border border-sand-200 hover:shadow-md transition"
          >
            <div className="relative w-full md:w-48 h-32 shrink-0 overflow-hidden rounded-lg bg-sand-100">
              {item.thumbnail_url ? (
                <Image
                  src={item.thumbnail_url}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">
                  📰
                </div>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-serif text-xl font-bold text-ocean-800 line-clamp-2">
                {item.title}
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {formatDate(item.published_at)} • Oleh{" "}
                {item.author_name || "Admin"}
              </p>
            </div>
          </Link>
        ))}
      </div>
      {(!news || news.length === 0) && (
        <p className="text-center text-gray-500 py-12">
          Belum ada berita untuk desa ini.
        </p>
      )}
    </div>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
