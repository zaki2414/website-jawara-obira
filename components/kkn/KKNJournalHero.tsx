import { BookOpen } from "lucide-react";
import { PageHero } from "@/components/shared/PageHero";

type KKNJournalHeroProps = {
  monthLabel: string;
  entryCount: number;
};

/** Hero direktori Jurnal — bidang kuning muda, nada ketiga di keluarga KKN. */
export function KKNJournalHero({ monthLabel, entryCount }: KKNJournalHeroProps) {
  return (
    <PageHero
      tone="kkn-jurnal"
      motif={3}
      Icon={BookOpen}
      label={`KKN-PPM UGM · ${monthLabel}`}
      title="Jurnal"
      titleAccent="Harian"
      lead="Catatan kegiatan harian selama masa pengabdian, tersusun menurut tanggal pelaksanaannya."
      stats={[{ value: entryCount, label: `Entri ${monthLabel}` }]}
    />
  );
}
