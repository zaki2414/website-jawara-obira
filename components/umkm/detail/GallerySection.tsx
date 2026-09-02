import { EntityGallerySection } from "@/components/shared/EntityGallerySection";
import { UMKM_DETAIL_CONTENT, type ExtraGalleryImage } from "@/constants/umkm";

type GallerySectionProps = {
  gallery: ExtraGalleryImage[];
};

// Adapter tipis ke EntityGallerySection (components/shared/) — satu-satunya
// implementasi gallery/dokumentasi dipakai UMKM/Budaya/Fauna/KKN Jurnal/KKN
// Proker, supaya border/shadow/lightbox-nya seragam di semua domain.
export function GallerySection({ gallery }: GallerySectionProps) {
  return (
    <EntityGallerySection
      images={gallery.map((img) => ({ url: img.image_url, caption: img.caption }))}
      title={UMKM_DETAIL_CONTENT.galleryTitle}
    />
  );
}
