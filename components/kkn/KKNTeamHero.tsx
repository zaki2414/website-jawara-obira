import { Users } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

type KKNTeamHeroProps = {
  totalCount: number;
};

/** Hero direktori Tim — bidang krem, memisahkannya dari teal Proker. */
export function KKNTeamHero({ totalCount }: KKNTeamHeroProps) {
  return (
    <PageHero
      tone="kkn-tim"
      motif={2}
      Icon={Users}
      label="KKN-PPM UGM · Personel"
      title="Anggota"
      titleAccent="Tim KKN"
      lead="Mahasiswa lintas klaster keilmuan yang mengabdi di Pulau Obi, beserta pembagian penempatan wilayah tugasnya."
      stats={[
        { value: totalCount, label: "Mahasiswa" },
        { value: 2, label: "Desa Penempatan" },
      ]}
    />
  );
}
