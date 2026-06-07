// app/kkn/proker/[slug]/page.tsx
import { getKKNProkerBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function KKNProkerDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: proker, error } = await getKKNProkerBySlug(slug);

  if (error || !proker) return notFound();

  const metrics = proker.impact_metrics || {};
  const achievements = proker.key_achievements || [];

  const docs = Array.isArray(proker.documentation) ? proker.documentation : [];

  const coverImage = proker.image_url;

  return (
    <article className="max-w-4xl mx-auto p-4">
      <Link
        href="/kkn/proker"
        className="text-sm text-ocean-600 hover:underline mb-4 inline-block"
      >
        ← Kembali ke Daftar Program
      </Link>

      <h1 className="text-3xl font-bold mb-2">{proker.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        📍 {proker.villages?.name || "Umum"}
      </p>

      {/* Cover Image */}
      {coverImage && (
        <div className="relative w-full h-64 md:h-96 mb-8 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={coverImage}
            alt={proker.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Short Description */}
      {proker.short_description && (
        <p className="text-lg text-gray-700 mb-6">{proker.short_description}</p>
      )}

      {/* Goals */}
      {proker.goals && (
        <section className="mb-8">
          <h3 className="font-bold text-xl mb-3">🎯 Tujuan</h3>
          <div
            className="prose prose-sm"
            dangerouslySetInnerHTML={{ __html: proker.goals }}
          />
        </section>
      )}

      {/* Results */}
      {proker.results && (
        <section className="mb-8">
          <h3 className="font-bold text-xl mb-3">✅ Hasil</h3>
          <div
            className="prose prose-sm"
            dangerouslySetInnerHTML={{ __html: proker.results }}
          />
        </section>
      )}

      {/* Impact Metrics - Filter yang ada value */}
      {Object.keys(metrics).length > 0 && (
        <section className="mb-8 p-4 bg-tropic-50 rounded-lg">
          <h3 className="font-bold text-xl mb-4">📊 Dampak</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(metrics)
              .filter(
                ([key, value]) => value && value !== "" && key.includes("_num"),
              )
              .map(([key, value]: [string, any]) => {
                const labelKey = key.replace("_num", "_label");
                const label =
                  metrics[labelKey] ||
                  key.replace("_num", "").replace("_", " ");

                return (
                  <div key={key} className="text-center p-3 bg-white rounded">
                    <div className="text-2xl font-bold text-tropic-600">
                      {value}
                    </div>
                    <div className="text-sm text-gray-600">{label}</div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Key Achievements */}
      {achievements.length > 0 && (
        <section className="mb-8">
          <h3 className="font-bold text-xl mb-3">🏆 Pencapaian Utama</h3>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {achievements.map((item: string, i: number) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Documentation Gallery - FIX: akses img.url bukan img.image_url */}
      {docs.length > 0 && (
        <section>
          <h3 className="font-bold text-xl mb-4">📸 Dokumentasi</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {docs.map((img: any, i: number) => {
              const imageUrl = img.url || img.image_url;
              if (!imageUrl) return null;

              return (
                <div
                  key={i}
                  className="relative h-32 bg-gray-200 rounded overflow-hidden"
                >
                  <Image
                    src={imageUrl}
                    alt={img.caption || `Dokumentasi ${i + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {img.caption && (
                    <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate">
                      {img.caption}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}
    </article>
  );
}
