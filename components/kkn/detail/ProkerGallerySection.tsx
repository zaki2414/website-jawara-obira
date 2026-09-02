import { EntityGallerySection } from "@/components/shared/EntityGallerySection";

type ProkerDoc = { url?: string; image_url?: string; caption?: string };

type ProkerGallerySectionProps = {
  docs: ProkerDoc[];
};

// Adapter tipis ke EntityGallerySection (components/shared/) — satu-satunya
// implementasi gallery/dokumentasi dipakai UMKM/Budaya/Fauna/KKN Jurnal/KKN
// Proker. Border SENGAJA di-hardcode cream (bukan ikut rotasi
// primary/tertiary/cream berbasis desa seperti section lain di halaman
// proker), sesuai permintaan eksplisit — hanya border dokumentasi ini yang
// berubah, section lain di halaman tetap pakai aksen per-desa seperti semula.
export function ProkerGallerySection({ docs }: ProkerGallerySectionProps) {
  const images = docs
    .filter((d) => Boolean(d.url || d.image_url))
    .map((d) => ({ url: (d.url || d.image_url) as string, caption: d.caption }));

  return (
    <EntityGallerySection
      images={images}
      title="Berkas Dokumentasi Implementasi"
      borderColorClass="border-cream"
    />
  );
}
