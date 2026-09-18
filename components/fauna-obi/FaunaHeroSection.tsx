import { Bird } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { FaunaFigure } from "@/components/shared/HeroFigures";
import { FAUNA_CONTENT } from "@/constants/fauna";

type FaunaHeroSectionProps = {
  totalCount: number;
  /** Sebaran status IUCN — dipakai sebagai angka ketiga di strip hero. */
  protectedCount?: number;
};

/** Hero Fauna — bidang biru langit, memisahkannya dari teal-dalam UMKM. */
export function FaunaHeroSection({ totalCount, protectedCount }: FaunaHeroSectionProps) {
  const stats = [
    { value: totalCount, label: "Spesies Tercatat" },
    { value: 3, label: "Kelas Takson" },
  ];
  if (typeof protectedCount === "number" && protectedCount > 0) {
    stats.push({ value: protectedCount, label: "Berstatus Rentan+" });
  }

  return (
    <PageHero
      figure={<FaunaFigure />}
      tone="fauna"
      motif={3}
      Icon={Bird}
      label={FAUNA_CONTENT.eyebrow}
      title="Inventarisasi"
      titleAccent="Fauna Obi"
      lead={FAUNA_CONTENT.description}
      stats={stats}
    />
  );
}
