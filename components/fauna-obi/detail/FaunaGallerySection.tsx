import { EntityGallerySection } from "@/components/shared/EntityGallerySection";
import { FAUNA_DETAIL_CONTENT, type FaunaImage } from "@/constants/fauna";

type FaunaGallerySectionProps = {
  gallery: FaunaImage[];
  faunaName: string;
};

// Adapter tipis ke EntityGallerySection (components/shared/) — satu-satunya
// implementasi gallery/dokumentasi dipakai UMKM/Budaya/Fauna/KKN Jurnal/KKN
// Proker, supaya border/shadow/lightbox-nya seragam di semua domain.
export function FaunaGallerySection({ gallery, faunaName }: FaunaGallerySectionProps) {
  return (
    <EntityGallerySection
      images={gallery.map((img) => ({ url: img.url, caption: img.caption }))}
      title={FAUNA_DETAIL_CONTENT.galleryTitle}
      entityName={faunaName}
    />
  );
}
