import { Store } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { UMKMFigure } from "@/components/shared/HeroFigures";
import { UMKM_CONTENT } from "@/constants/umkm";

type UMKMHeaderProps = {
  businessTypeCounts: Record<string, number>;
};

/** Hero UMKM — bidang teal niaga. */
export function UMKMHeader({ businessTypeCounts }: UMKMHeaderProps) {
  const total = Object.values(businessTypeCounts).reduce((a, b) => a + b, 0);
  const kinds = Object.values(businessTypeCounts).filter((n) => n > 0).length;

  return (
    <PageHero
      figure={<UMKMFigure />}
      tone="umkm"
      motif={2}
      Icon={Store}
      label={UMKM_CONTENT.eyebrow}
      title="Direktori"
      titleAccent="Usaha Warga"
      lead={UMKM_CONTENT.description}
      stats={[
        { value: total, label: "Mitra Usaha" },
        { value: kinds, label: "Jenis Usaha" },
        { value: 2, label: "Desa" },
      ]}
    />
  );
}
