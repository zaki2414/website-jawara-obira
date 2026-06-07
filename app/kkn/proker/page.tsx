// app/kkn/proker/page.tsx
import { getAllKKNProkers } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";

export default async function KKNProkersPage({
  searchParams,
}: {
  searchParams: { desa?: string };
}) {
  const params = await searchParams;
  const selectedDesa = params.desa;
  const { data: prokers, error } = await getAllKKNProkers(selectedDesa);

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error: {String(error)}</p>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Program Utama</h1>

      {/* Toggle Desa */}
      <div className="flex gap-4 mb-6">
        <a
          href="?"
          className={`px-4 py-2 rounded-full font-medium transition ${!selectedDesa ? "bg-ocean-600 text-ocean-600 border" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Semua
        </a>
        <a
          href="?desa=kawasi"
          className={`px-4 py-2 rounded-full font-medium transition ${selectedDesa === "kawasi" ? "bg-ocean-600 text-ocean-600 border" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Desa Kawasi
        </a>
        <a
          href="?desa=soligi"
          className={`px-4 py-2 rounded-full font-medium transition ${selectedDesa === "soligi" ? "bg-ocean-600 text-ocean-600 border" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Desa Soligi
        </a>
      </div>

      {/* Grid Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {prokers?.map((proker: any) => {
          const thumb = proker.image_url;
          const metrics = proker.impact_metrics || {};

          return (
            <Link
              key={proker.id}
              href={`/kkn/proker/${proker.slug}`}
              className="group block bg-white rounded-xl shadow-sm border border-sand-200 overflow-hidden hover:shadow-md transition"
            >
              {/* Thumbnail */}
              <div className="relative h-40 bg-gray-200">
                {thumb ? (
                  <Image
                    src={thumb}
                    alt={proker.title}
                    fill
                    className="object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl bg-linear-to-br from-ocean-100 to-tropic-100">
                    🎯
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-serif text-lg font-bold text-ocean-800 mb-2 group-hover:text-ocean-600 line-clamp-2">
                  {proker.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {proker.short_description}
                </p>

                {/* Impact Metrics Preview - hanya tampilkan yang ada value */}
                {Object.keys(metrics).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(metrics)
                      .filter(
                        ([key, value]) =>
                          value && value !== "" && key.includes("_num"),
                      )
                      .slice(0, 2)
                      .map(([key, value]: [string, any]) => {
                        const labelKey = key.replace("_num", "_label");
                        const label = metrics[labelKey] || key;
                        return (
                          <span
                            key={key}
                            className="text-xs bg-tropic-50 text-tropic-700 px-2 py-1 rounded"
                          >
                            {label}: {value}
                          </span>
                        );
                      })}
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {(!prokers || prokers.length === 0) && (
        <p className="text-center text-gray-500 py-12">
          Belum ada program dampak.
        </p>
      )}
    </main>
  );
}
