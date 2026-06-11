// app/umkm/[slug]/page.tsx
import { getUMKMBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Box, Camera, Sparkles, Store, Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const revalidate = 3600;

interface ExtraGalleryImage {
  id: string;
  image_url: string;
  caption?: string;
}

export default async function UMKMDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: umkm, error } = await getUMKMBySlug(slug);
  if (error || !umkm) return notFound();

  const productsByCategory: Record<string, { items: string[]; icon?: string }> = {};

  umkm.products?.forEach((p: any) => {
    const catName = p.category?.name || "Lainnya";
    const catIcon = p.category?.icon || "📋";

    if (!productsByCategory[catName]) {
      productsByCategory[catName] = { items: [], icon: catIcon };
    }
    productsByCategory[catName].items.push(p.item_name);
  });

  return (
    <article className="bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen">
      <div className="max-w-6xl mx-auto px-6 space-y-10">
        
        {/* Tombol Navigasi Samping */}
        <Link href="/umkm" className="inline-flex items-center gap-1.5 text-sm font-bold text-on-surface-variant hover:text-primary group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Kembali ke Direktori Usaha
        </Link>

        {/* Poster Papan Nama Toko (Hero Container) */}
        <div className="relative w-full h-64 md:h-[400px] border-4 border-on-surface rounded-xl overflow-hidden hard-shadow-lg bg-surface-container-high">
          {umkm.thumbnail_url ? (
            <Image
              src={umkm.thumbnail_url}
              alt={umkm.name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant/20">
              <Store className="w-24 h-24" />
            </div>
          )}
          
          {/* Label Blok Informasi Brutalist di Dalam Gambar */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent flex items-end p-6 md:p-8">
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 bg-tertiary text-on-tertiary text-xs font-black rounded border border-on-surface uppercase tracking-widest">
                {umkm.business_type.replace("_", " ")}
              </span>
              <h1 className="font-serif text-3xl md:text-5xl font-bold text-white drop-shadow-sm">
                {umkm.name}
              </h1>
              {umkm.location_text && (
                <p className="text-white/90 flex items-center gap-1.5 text-sm font-medium">
                  <MapPin className="w-4 h-4 text-primary shrink-0" /> {umkm.location_text}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Distribusi Kolom Grid Informasi */}
        <div className="grid md:grid-cols-3 gap-10 items-start">
          
          {/* Kolom Kiri Utama */}
          <div className="md:col-span-2 space-y-10">
            
            {/* Profil Narasi */}
            {umkm.full_description && (
              <section className="bg-background p-6 border-2 border-on-surface rounded-xl hard-shadow-sm space-y-3">
                <h2 className="font-serif text-2xl font-bold text-on-surface flex items-center gap-2">
                  <Store className="w-5 h-5 text-primary" /> Profil Singkat Usaha
                </h2>
                <p className="text-on-surface-variant leading-relaxed font-sans whitespace-pre-line">
                  {umkm.full_description}
                </p>
              </section>
            )}

            {/* Katalog Komoditas Barang/Jasa */}
            {Object.keys(productsByCategory).length > 0 && (
              <section className="bg-background p-6 border-2 border-on-surface rounded-xl hard-shadow-sm space-y-4">
                <h2 className="font-serif text-2xl font-bold text-on-surface flex items-center gap-2">
                  <Box className="w-5 h-5 text-tertiary" /> Inventaris Dagang & Layanan
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-6 pt-2">
                  {Object.entries(productsByCategory).map(([catName, data]) => (
                    <div key={catName} className="p-4 border border-outline rounded-lg bg-surface-container-low space-y-3">
                      <h3 className="font-bold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wide border-b border-dashed border-outline-variant pb-2">
                        <span className="text-base">{data.icon}</span> {catName}
                      </h3>
                      <ul className="space-y-1.5">
                        {data.items.map((item: string, i: number) => (
                          <li key={i} className="text-sm font-medium text-on-surface-variant flex items-start gap-1.5">
                            <span className="text-primary font-black">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Dokumentasi Visual Galeri Internal */}
            {umkm.gallery && umkm.gallery.length > 0 && (
              <section className="space-y-4">
                <h2 className="font-serif text-2xl font-bold text-on-surface flex items-center gap-2">
                  <Camera className="w-5 h-5 text-tropic-700" /> Galeri Lapak Usaha
                </h2>
                <div className="columns-1 sm:columns-2 gap-4 space-y-4 [column-fill:_balance]">
                  {umkm.gallery.map((img: ExtraGalleryImage) => (
                    <div
                      key={img.id}
                      className="break-inside-avoid bg-background border-2 border-on-surface rounded-lg overflow-hidden hard-shadow-sm inline-block w-full"
                    >
                      <div className="relative w-full aspect-[4/3] bg-surface-container-high border-b border-on-surface/20">
                        <Image
                          src={img.image_url}
                          alt={img.caption || "Dokumentasi Usaha"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {img.caption && (
                        <p className="p-3 text-xs font-medium text-on-surface-variant text-center italic">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Kolom Kanan / Sidebar Panel */}
          <div className="space-y-6 md:sticky md:top-24">
            
            {/* Fitur Keunggulan / Highlight */}
            {umkm.features && umkm.features.length > 0 && (
              <div className="bg-tropic-50 p-6 border-2 border-tropic-700 rounded-xl hard-shadow-sm space-y-3">
                <h3 className="font-bold text-tropic-900 flex items-center gap-1.5 text-sm uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-tropic-600" /> Atribut Layanan
                </h3>
                <ul className="space-y-2.5">
                  {umkm.features.map((f: string, i: number) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm font-semibold text-tropic-800"
                    >
                      <span className="w-1.5 h-1.5 bg-tropic-600 rounded-full mt-1.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Panel Informasi Peta / Penunjuk Arah */}
            <div className="bg-background p-5 border-2 border-on-surface rounded-xl hard-shadow-sm text-center space-y-4">
              <h3 className="font-serif text-lg font-bold text-on-surface flex items-center justify-center gap-1.5">
                <Layers className="w-4 h-4 text-primary" /> Informasi Pemetaan
              </h3>
              
              {/* Ornamen Grafis Pengganti Sementara Grid Peta */}
              <div className="w-full h-36 bg-surface-container border-2 border-dashed border-outline rounded-lg flex flex-col items-center justify-center text-on-surface-variant p-4">
                <MapPin className="w-8 h-8 text-on-surface-variant/40 animate-pulse mb-1" />
                <span className="text-xs font-bold uppercase tracking-wide">Peta Kartografi Desa</span>
                <span className="text-[10px] text-on-surface-variant/60 italic">Dalam Sinkronisasi Sistem</span>
              </div>
              
              {umkm.location_text && (
                <p className="text-xs font-medium text-on-surface-variant bg-surface-container-low p-2 rounded border border-outline-variant">
                  {umkm.location_text}
                </p>
              )}
            </div>

          </div>
        </div>
      </div>
    </article>
  );
}