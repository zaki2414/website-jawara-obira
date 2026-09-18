import { Sprout } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { TogaFigure } from "@/components/shared/HeroFigures";
import { TOGA_CONTENT } from "@/constants/toga";

type TogaHeroSectionProps = {
  totalCount: number;
  /** Jumlah khasiat tercatat di seluruh koleksi. */
  benefitCount?: number;
};

/** Hero TOGA — bidang hijau herbal, satu-satunya domain bersubjek tumbuhan. */
export function TogaHeroSection({ totalCount, benefitCount }: TogaHeroSectionProps) {
  const stats = [
    { value: totalCount, label: "Spesimen" },
    ...(benefitCount ? [{ value: benefitCount, label: "Khasiat Tercatat" }] : []),
  ];

  return (
    <PageHero
      figure={<TogaFigure />}
      tone="toga"
      motif={1}
      Icon={Sprout}
      label={TOGA_CONTENT.eyebrow}
      title="Ensiklopedia"
      titleAccent="Tanaman Obat"
      lead={TOGA_CONTENT.description}
      stats={stats}
    />
  );
}
