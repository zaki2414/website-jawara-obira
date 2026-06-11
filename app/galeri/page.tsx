// app/galeri/page.tsx
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import { Camera, Image as ImageIcon } from "lucide-react";

export const revalidate = 3600;

interface GalleryItem {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
  category: string;
}

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: galleries } = await supabase
    .from("galleries")
    .select("*")
    .order("uploaded_at", { ascending: false });

  return (
    <section className="bg-natural-paper py-16 px-6 border-b-4 border-on-surface min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Halaman */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-block bg-primary text-on-primary px-4 py-1.5 font-semibold text-sm uppercase tracking-wider mb-4 hard-shadow-sm">
            Arsip Visual
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-on-surface mb-2">
            Galeri Foto Obi
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">
            Rekam jejak keindahan alam, dokumentasi kebudayaan, dan denyut nadi keseharian masyarakat di Pulau Obi.
          </p>
        </div>

        {/* True Masonry Grid dengan CSS Columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
          {galleries?.map((item: GalleryItem) => (
            <div
              key={item.id}
              className="break-inside-avoid bg-background border-2 border-on-surface rounded-xl overflow-hidden hard-shadow hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 mb-6 group inline-block w-full"
            >
              {/* Wadah Gambar - Rasio dipertahankan menggunakan aspek brutalist */}
              <div 
                className="relative w-full bg-surface-container-high border-b-2 border-on-surface"
                style={{ paddingBottom: `${(400 / 600) * 100}%` }} // Mempertahankan struktur proporsi gambar aman Next.js
              >
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.title || "Galeri Obi"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant/30">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}
              </div>

              {/* Deskripsi & Keterangan Foto */}
              <div className="p-5 space-y-2.5">
                <span className="inline-block px-2.5 py-0.5 bg-surface-container border border-outline-variant text-xs font-bold uppercase tracking-wider rounded-md text-on-surface-variant">
                  {item.category}
                </span>
                
                {item.title && (
                  <h3 className="font-serif text-lg font-bold text-on-surface leading-tight">
                    {item.title}
                  </h3>
                )}
                
                {item.description && (
                  <p className="text-sm font-sans text-on-surface-variant leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Tampilan Jika Data Kosong */}
        {(!galleries || galleries.length === 0) && (
          <div className="text-center bg-background border-2 border-dashed border-outline rounded-xl py-20 max-w-xl mx-auto hard-shadow-sm">
            <Camera className="w-12 h-12 mx-auto text-on-surface-variant opacity-40 mb-4" />
            <p className="font-serif text-xl font-bold text-on-surface mb-1">Belum Ada Koleksi Foto</p>
            <p className="text-sm text-on-surface-variant">Kliping gambar mengenai wilayah belum diunggah ke peladen.</p>
          </div>
        )}
        
      </div>
    </section>
  );
}