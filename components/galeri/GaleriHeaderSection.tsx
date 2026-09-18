import { Camera } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { GaleriFigure } from "@/components/shared/HeroFigures";
import { GALERI_CONTENT } from "@/constants/galeri";

type GaleriHeaderSectionProps = {
  totalCount: number;
  categoryCounts: Record<string, number>;
};

/** Hero Galeri — bidang tinta gelap supaya fotonya yang berwarna. */
export function GaleriHeaderSection({ totalCount, categoryCounts }: GaleriHeaderSectionProps) {
  const activeCategories = Object.values(categoryCounts).filter((n) => n > 0).length;

  return (
    <PageHero
      figure={<GaleriFigure />}
      tone="galeri"
      motif={4}
      Icon={Camera}
      label={GALERI_CONTENT.heroEyebrow}
      title="Galeri"
      titleAccent="Pulau Obi"
      lead={GALERI_CONTENT.heroDescription}
      stats={[
        { value: totalCount, label: "Foto Terdokumentasi" },
        { value: activeCategories, label: "Kategori Terisi" },
      ]}
    />
  );
}
