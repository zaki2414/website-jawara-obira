// components/kkn/CalendarGrid.tsx
"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type CalendarGridProps = {
  year: number;
  month: number;
  selectedDesa: string;
  groupedJournals: Record<string, any[]>;
  firstDay: number;
  daysInMonth: number;
  isPrevDisabled: boolean;
  isNextDisabled: boolean;
  calendarConfig: {
    startYear: number;
    startMonth: number;
    endYear: number;
    endMonth: number;
  };
};

export default function CalendarGrid({
  year,
  month,
  selectedDesa,
  groupedJournals,
  firstDay,
  daysInMonth,
  isPrevDisabled,
  isNextDisabled,
  calendarConfig,
}: CalendarGridProps) {
  const [showPopup, setShowPopup] = useState(false);
  const [popupDate, setPopupDate] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const monthNames = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  const handleNav = (offset: number) => {
    let newMonth = month + offset;
    let newYear = year;

    if (newMonth < calendarConfig.startMonth) {
      newMonth = calendarConfig.startMonth;
      newYear = calendarConfig.startYear;
    }
    if (newMonth > calendarConfig.endMonth) {
      newMonth = calendarConfig.endMonth;
      newYear = calendarConfig.endYear;
    }

    const currentDesa = searchParams.get("desa") || selectedDesa;
    const newUrl = `?year=${newYear}&month=${newMonth}&desa=${currentDesa}`;
    router.push(newUrl);
  };

  const handleDateClick = (dateStr: string, hasData: boolean) => {
    if (!hasData) {
      setPopupDate(dateStr);
      setShowPopup(true);
    }
  };

  return (
    <>
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          disabled={isPrevDisabled}
          onClick={() => handleNav(-1)}
          className={`px-3 py-1 rounded transition ${isPrevDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
        >
          ← Prev
        </button>
        <h2 className="text-lg font-semibold">
          {monthNames[month - 1]} {year}
        </h2>
        <button
          disabled={isNextDisabled}
          onClick={() => handleNav(1)}
          className={`px-3 py-1 rounded transition ${isNextDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-gray-200 hover:bg-gray-300 text-gray-800"}`}
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="text-xs font-medium text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 border bg-gray-50"></div>
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const journals = groupedJournals[dateStr] || [];
          const hasData = journals.length > 0;

          return (
            <div
              key={day}
              onClick={() => handleDateClick(dateStr, hasData)}
              className={`h-24 border p-1 relative bg-white hover:bg-gray-50 cursor-pointer transition ${hasData ? "border-ocean-200" : "border-gray-200"}`}
            >
              <span className="text-xs font-medium block mb-1">{day}</span>
              {hasData && (
                <div className="space-y-1 overflow-y-auto max-h-16">
                  {journals.map((j: any) => (
                    <Link
                      key={j.id}
                      href={`/kkn/jurnal/${j.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="block text-[10px] bg-ocean-100 text-ocean-800 px-1 py-0.5 rounded truncate hover:bg-ocean-200"
                      title={j.title}
                    >
                      {j.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pop-up Empty Date */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <div className="text-4xl mb-3">📅</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Belum Ada Data
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Tidak ada entri jurnal untuk tanggal{" "}
              <span className="font-semibold text-ocean-600">{popupDate}</span>.
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-4 py-2 bg-ocean-600 text-white rounded-lg hover:bg-ocean-700 transition text-sm"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
