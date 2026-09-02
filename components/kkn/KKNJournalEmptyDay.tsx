// components/kkn/KKNJournalEmptyDay.tsx

type KKNJournalEmptyDayProps = {
  day: number;
};

// Sel kalender tanpa entri jurnal — murni informatif, tidak ada aksi untuk hari ini,
// jadi sengaja bukan <button> (sebelumnya berupa button dengan alert() browser saat
// diklik, yang mengganggu dan tidak menambah informasi baru).
export default function KKNJournalEmptyDay({ day }: KKNJournalEmptyDayProps) {
  return (
    <div className="flex h-20 flex-col justify-between rounded-lg border-2 border-dashed border-outline-variant bg-surface-container-low/40 p-2 transition-colors duration-150 hover:border-on-surface hover:bg-surface-container-low sm:h-28 sm:rounded-xl sm:p-3">
      <span className="text-sm font-black text-on-surface-variant/50">{day}</span>
      <span className="hidden text-right text-label-sm font-black uppercase tracking-wide text-on-surface-variant/30 sm:block">
        Kosong
      </span>
    </div>
  );
}