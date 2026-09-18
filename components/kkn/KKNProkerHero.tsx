import { Rocket } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

type KKNProkerHeroProps = {
  totalCount: number;
};

/** Hero direktori Program Kerja — bidang teal, sewarna landing /kkn. */
export function KKNProkerHero({ totalCount }: KKNProkerHeroProps) {
  return (
    <PageHero
      tone="kkn"
      motif={4}
      Icon={Rocket}
      label="KKN-PPM UGM · Realisasi"
      title="Program"
      titleAccent="Kerja"
      lead="Luaran, metrik dampak, dan dokumentasi dari program-program pilihan yang paling berdampak bagi warga Desa Kawasi dan Soligi."
      stats={[
        { value: totalCount, label: "Program Terbit" },
        { value: 2, label: "Desa Sasaran" },
      ]}
    />
  );
}
