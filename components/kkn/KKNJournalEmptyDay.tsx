// components/kkn/KKNJournalEmptyDay.tsx
"use client";

type KKNJournalEmptyDayProps = {
  day: number;
};

export default function KKNJournalEmptyDay({ day }: KKNJournalEmptyDayProps) {
  const handleClick = () => {
    alert("Entri log aktivitas belum dicatatkan untuk tanggal ini.");
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left h-28 border border-dashed border-outline-variant p-3 bg-surface-container/20 rounded-xl hover:bg-surface-container-low transition-colors duration-150 flex flex-col justify-between group"
    >
      <span className="text-sm font-bold text-on-surface-variant/40 group-hover:text-on-surface-variant transition-colors">
        {day}
      </span>
      <span className="text-[9px] uppercase tracking-wider font-black text-on-surface-variant/20 block text-right w-full group-hover:text-on-surface-variant/40 transition-colors">
        Kosong
      </span>
    </button>
  );
}