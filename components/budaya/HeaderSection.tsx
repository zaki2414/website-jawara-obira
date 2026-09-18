import { Landmark } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";
import { BudayaFigure } from "@/components/shared/HeroFigures";
import { BUDAYA_CONTENT } from "@/constants/budaya";

type HeaderSectionProps = {
  cultureCount: number;
  categoryCounts: Record<string, number>;
};

/**
 * Hero Budaya — bidang emas upacara. Dua kotak bersebelahan (judul | statistik)
 * diganti satu aliran vertikal; lihat catatan lengkap di
 * components/shared/PageHero.tsx.
 */
export function HeaderSection({ cultureCount, categoryCounts }: HeaderSectionProps) {
  const activeCategories = Object.entries(categoryCounts).filter(
    ([name, count]) => name !== "Semua" && count > 0,
  ).length;

  return (
    <PageHero
      figure={<BudayaFigure />}
      tone="budaya"
      motif={5}
      Icon={Landmark}
      label={BUDAYA_CONTENT.heroEyebrow}
      title="Arsip"
      titleAccent="Kebudayaan"
      lead={BUDAYA_CONTENT.heroDescription}
      stats={[
        { value: cultureCount, label: "Dokumentasi" },
        { value: activeCategories, label: "Kategori Terisi" },
        { value: 2, label: "Desa Tercakup" },
      ]}
    />
  );
}
