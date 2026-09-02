import { EntityGallerySection } from "@/components/shared/EntityGallerySection";

type JournalImage = { image_url: string; caption: string | null };

type JournalGallerySectionProps = {
  images: JournalImage[];
};

// Adapter tipis ke EntityGallerySection (components/shared/) — satu-satunya
// implementasi gallery/dokumentasi dipakai UMKM/Budaya/Fauna/KKN Jurnal/KKN
// Proker. Border SENGAJA di-hardcode tertiary (bukan ikut rotasi
// primary/tertiary/cream berbasis desa seperti section lain di halaman
// jurnal), sesuai permintaan eksplisit.
export function JournalGallerySection({ images }: JournalGallerySectionProps) {
  return (
    <EntityGallerySection
      images={images.map((img) => ({ url: img.image_url, caption: img.caption }))}
      title="Album Dokumentasi Lapangan Tambahan"
      borderColorClass="border-tertiary"
    />
  );
}
