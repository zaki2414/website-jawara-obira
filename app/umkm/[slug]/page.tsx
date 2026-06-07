// app/umkm/[slug]/page.tsx
import { getUMKMBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";

export const revalidate = 3600;

export default async function UMKMDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: umkm, error } = await getUMKMBySlug(slug);
  if (error || !umkm) return notFound();

  const productsByCategory: Record<string, { items: string[]; icon?: string }> =
    {};

  umkm.products.forEach((p: any) => {
    const catName = p.category?.name || "Lainnya";
    const catIcon = p.category?.icon || "📋";

    if (!productsByCategory[catName]) {
      productsByCategory[catName] = { items: [], icon: catIcon };
    }
    productsByCategory[catName].items.push(p.item_name);
  });

  return (
    <article className="max-w-6xl mx-auto px-4 py-8 space-y-10">
      {/* Hero Thumbnail */}
      <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-xl">
        {umkm.thumbnail_url ? (
          <Image
            src={umkm.thumbnail_url}
            alt={umkm.name}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-sand-200 flex items-center justify-center text-6xl">
            🏪
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6 md:p-8">
          <div>
            <span className="inline-block px-3 py-1 bg-ocean-600 text-white text-xs font-bold rounded-full mb-2 uppercase tracking-wider">
              {umkm.business_type.replace("_", " ")}
            </span>
            <h1 className="font-serif text-3xl md:text-5xl font-bold text-white mb-2">
              {umkm.name}
            </h1>
            {umkm.location_text && (
              <p className="text-white/90 flex items-center gap-2">
                📍 {umkm.location_text}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          {umkm.full_description && (
            <section>
              <h2 className="font-serif text-2xl font-bold text-ocean-800 mb-3">
                Tentang UMKM
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {umkm.full_description}
              </p>
            </section>
          )}

          {/* Kategori & Produk - ✅ FIXED */}
          {Object.keys(productsByCategory).length > 0 && (
            <section className="bg-white p-6 rounded-xl shadow-sm border border-sand-200">
              <h2 className="font-serif text-2xl font-bold text-ocean-800 mb-4">
                📦 Kategori Barang Tersedia
              </h2>
              <div className="grid sm:grid-cols-2 gap-6">
                {Object.entries(productsByCategory).map(
                  ([catName, data]: [string, any]) => (
                    <div key={catName} className="space-y-2">
                      <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                        {/* ✅ Tampilkan icon + nama kategori */}
                        <span>{data.icon}</span> {catName}
                      </h3>
                      <ul className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                        {data.items.map((item: string, i: number) => (
                          <li key={i} className="flex items-center gap-1">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ),
                )}
              </div>
            </section>
          )}

          {/* Gallery */}
          {umkm.gallery.length > 0 && (
            <section>
              <h2 className="font-serif text-2xl font-bold text-ocean-800 mb-4">
                📸 Galeri
              </h2>
              <div className="columns-1 md:columns-2 gap-4 space-y-4">
                {umkm.gallery.map((img: any) => (
                  <div
                    key={img.id}
                    className="break-inside-avoid bg-white rounded-lg overflow-hidden shadow-sm border border-sand-200"
                  >
                    <div
                      className="relative w-full"
                      style={{ paddingBottom: "75%" }}
                    >
                      <Image
                        src={img.image_url}
                        alt={img.caption || "Galeri UMKM"}
                        fill
                        className="object-cover"
                      />
                    </div>
                    {img.caption && (
                      <p className="p-3 text-xs text-gray-500 text-center">
                        {img.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {umkm.features.length > 0 && (
            <div className="bg-tropic-50 p-5 rounded-xl border border-tropic-200">
              <h3 className="font-semibold text-tropic-800 mb-3">
                ✨ Highlight
              </h3>
              <ul className="space-y-2">
                {umkm.features.map((f: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-tropic-700"
                  >
                    <span className="w-1.5 h-1.5 bg-tropic-500 rounded-full"></span>{" "}
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Maps Placeholder */}
          <div className="bg-gray-100 p-5 rounded-xl border border-gray-200 text-center">
            <h3 className="font-semibold text-gray-800 mb-2">🗺️ Lokasi</h3>
            <div className="w-full h-40 bg-sand-100 rounded-lg flex items-center justify-center text-gray-400 text-sm mb-3">
              Peta akan segera hadir
            </div>
            {umkm.location_text && (
              <p className="text-xs text-gray-500">{umkm.location_text}</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
