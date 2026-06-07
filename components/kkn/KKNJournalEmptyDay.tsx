// components/kkn/KKNJournalEmptyDay.tsx
"use client";

type KKNJournalEmptyDayProps = {
  day: number;
};

export default function KKNJournalEmptyDay({ day }: KKNJournalEmptyDayProps) {
  const handleClick = () => {
    alert("Belum ada data entri");
  };

  return (
    <button
      onClick={handleClick}
      className="w-full text-left h-28 border border-gray-600 p-2 bg-gray-50/70 rounded-xl hover:bg-gray-100 transition-colors"
    >
      <span className="text-sm font-medium text-gray-400 block">{day}</span>
    </button>
  );
}
