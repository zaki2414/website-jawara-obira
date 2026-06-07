// app/kkn/jurnal/page.tsx
import { getKKNJournalsByMonth } from "@/lib/supabase/queries";
import Link from "next/link";
import KKNJournalEmptyDay from "@/components/kkn/KKNJournalEmptyDay";

type PageProps = {
  searchParams: Promise<{ year?: string; month?: string; desa?: string }>;
};

export default async function KKNJournalCalendar({ searchParams }: PageProps) {
  const DEFAULT_YEAR = 2026;
  const DEFAULT_MONTH = 6;

  const params = await searchParams;
  const year = parseInt(params.year || DEFAULT_YEAR.toString());
  const month = parseInt(params.month || DEFAULT_MONTH.toString());

  const selectedDesa = params.desa || "kawasi";

  const VILLAGE_IDS: Record<string, string> = {
    kawasi: "56c05d7b-7bf5-4fa3-b8c0-153ac9cac05a",
    soligi: "c9766e51-b96d-4aa6-bfd2-5a9fce469b5d",
  };

  const filterId =
    selectedDesa && selectedDesa !== "all"
      ? VILLAGE_IDS[selectedDesa]
      : undefined;

  const { data: groupedJournals, error } = await getKKNJournalsByMonth(
    year,
    month,
    filterId,
  );

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error: {String(error)}</p>
      </div>
    );
  }

  const isPrevDisabled = year === 2026 && month === 6;
  const isNextDisabled = year === 2026 && month === 8;

  const getNavParams = (offset: number) => {
    let newMonth = month + offset;
    let newYear = year;
    if (newMonth < 6) {
      newMonth = 6;
      newYear = 2026;
    }
    if (newMonth > 8) {
      newMonth = 8;
      newYear = 2026;
    }
    return { year: newYear, month: newMonth };
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
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

  return (
    <main className="max-w-6xl mx-auto p-4 py-8">
      <h1 className="font-serif text-3xl font-bold text-ocean-800 mb-6">
        📖 Jurnal Kegiatan KKN
      </h1>

      {/* ✅ Toggle Navigasi Desa (Menggunakan Next.js Link & Desain Pil Pill Bulat) */}
      <div className="flex gap-4 mb-6">
        {/* Tombol Desa Kawasi */}
        <Link
          href={`?year=${year}&month=${month}&desa=kawasi`}
          className={`px-4 py-2 rounded-full font-medium transition text-sm ${selectedDesa === "kawasi" ? "bg-amber-600 text-ocean" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Desa Kawasi
        </Link>
        {/* Tombol Desa Soligi */}
        <Link
          href={`?year=${year}&month=${month}&desa=soligi`}
          className={`px-4 py-2 rounded-full font-medium transition text-sm ${selectedDesa === "soligi" ? "bg-amber-600 text-ocean" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
        >
          Desa Soligi
        </Link>
      </div>

      {/* Calendar Header Navigasi */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-sand-200 shadow-sm">
        {isPrevDisabled ? (
          <span className="px-4 py-2 text-sm bg-gray-50 text-gray-400 rounded-lg cursor-not-allowed border border-gray-100">
            ← Sebelumnya
          </span>
        ) : (
          <Link
            href={`?year=${getNavParams(-1).year}&month=${getNavParams(-1).month}&desa=${selectedDesa}`}
            className="px-4 py-2 text-sm bg-sand-50 hover:bg-sand-100 text-gray-700 rounded-lg transition border border-sand-200 font-medium"
          >
            ← Sebelumnya
          </Link>
        )}

        <h2 className="font-serif text-xl font-bold text-ocean-800">
          {monthNames[month - 1]} {year}
        </h2>

        {isNextDisabled ? (
          <span className="px-4 py-2 text-sm bg-gray-50 text-gray-400 rounded-lg cursor-not-allowed border border-gray-100">
            Selanjutnya →
          </span>
        ) : (
          <Link
            href={`?year=${getNavParams(1).year}&month=${getNavParams(1).month}&desa=${selectedDesa}`}
            className="px-4 py-2 text-sm bg-sand-50 hover:bg-sand-100 text-gray-700 rounded-lg transition border border-sand-200 font-medium"
          >
            Selanjutnya →
          </Link>
        )}
      </div>

      {/* Tampilan Nama Hari */}
      <div className="grid grid-cols-7 gap-2 text-center mb-2">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div
            key={d}
            className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid Kalender Utama */}
      <div className="grid grid-cols-7 gap-2">
        {/* 1. Kolom Kosong Awal Bulan (Bulan lalu/belum mulai) */}
        {Array.from({ length: firstDay }).map((_, i) => (
          <div
            key={`empty-${i}`}
            className="h-28 bg-gray-100 rounded-xl border border-dashed border-gray-200/60"
          ></div>
        ))}

        {/* Tanggal Aktif Bulan Ini */}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const journals = groupedJournals?.[dateStr] || [];

          return (
            <div key={day} className="relative group">
              {journals.length > 0 ? (
                /* 🌟 ADA JURNAL: Dibuat kontras (Putih Bersih + Efek Hover Berwarna) */
                <Link
                  href={`/kkn/jurnal/${journals[0].slug}`}
                  className="h-28 border-2 border-sand-200 p-2 bg-white hover:border-ocean-500 hover:shadow-md rounded-xl flex flex-col justify-between transition-all duration-200 transform hover:-translate-y-0.5"
                  title={journals[0].title}
                >
                  <div className="w-full">
                    <span className="text-sm font-bold text-gray-800 group-hover:text-ocean-600 block mb-1">
                      {day}
                    </span>
                    <div className="text-[10px] bg-ocean-50 text-ocean-700 border border-ocean-100 px-1.5 py-1 rounded-md truncate font-semibold">
                      {journals[0].title}
                    </div>
                  </div>

                  {journals.length > 1 && (
                    <div className="text-right">
                      <span className="inline-block text-[9px] bg-tropic-500 text-white font-medium px-1.5 py-0.5 rounded-md shadow-sm">
                        +{journals.length - 1} Jurnal
                      </span>
                    </div>
                  )}
                </Link>
              ) : (
                /* 💤 KOTAK TANGGAL KOSONG (No Journal) */
                <KKNJournalEmptyDay day={day} />
              )}
            </div>
          );
        })}
      </div>
    </main>
  );
}
