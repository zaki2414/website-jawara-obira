// app/kkn/jurnal/page.tsx
import { getKKNJournalsByMonth } from "@/lib/supabase/queries";
import Link from "next/link";
import KKNJournalEmptyDay from "@/components/kkn/KKNJournalEmptyDay";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

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
      <div className="min-h-screen bg-natural-paper p-8 flex items-center justify-center">
        <div className="bg-background p-6 border-2 border-error rounded-xl max-w-md hard-shadow-sm text-center">
          <p className="font-serif font-black text-error text-lg mb-2">Gagal Memuat Jurnal</p>
          <p className="text-sm text-on-surface-variant font-medium">{String(error)}</p>
        </div>
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
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="min-h-screen bg-natural-paper py-12 px-4 sm:px-6 lg:px-8">
      <main className="max-w-6xl mx-auto">
        
        {/* JUDUL UTAMA */}
        <header className="border-b-4 border-on-surface pb-6 mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-serif text-4xl font-black text-on-surface tracking-tight flex items-center gap-3">
              <Calendar className="w-8 h-8 text-primary stroke-2" /> Jurnal Berkas Kegiatan KKN
            </h1>
            <p className="text-on-surface-variant font-medium mt-1">
              Catatan garis depan, arsip aktivitas harian, dan log perkembangan program kerja wilayah Obira.
            </p>
          </div>

          {/* TOGGLE NAVIGASI DESA BRUTALIST TAB */}
          <div className="inline-flex p-1 bg-surface-container border-2 border-on-surface rounded-xl shrink-0">
            <Link
              href={`?year=${year}&month=${month}&desa=kawasi`}
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                selectedDesa === "kawasi"
                  ? "bg-on-surface text-background border border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Desa Kawasi
            </Link>
            <Link
              href={`?year=${year}&month=${month}&desa=soligi`}
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                selectedDesa === "soligi"
                  ? "bg-on-surface text-background border border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Desa Soligi
            </Link>
          </div>
        </header>

        {/* CALENDAR HEADER NAVIGASI */}
        <div className="flex justify-between items-center mb-8 bg-background p-4 border-4 border-on-surface rounded-xl hard-shadow-sm">
          {isPrevDisabled ? (
            <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-surface-container border-2 border-outline-variant text-on-surface-variant/40 rounded-lg cursor-not-allowed inline-flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </span>
          ) : (
            <Link
              href={`?year=${getNavParams(-1).year}&month=${getNavParams(-1).month}&desa=${selectedDesa}`}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-background hover:bg-surface-container-low text-on-surface border-2 border-on-surface rounded-lg transition-all inline-flex items-center gap-1 active:translate-y-0.5"
            >
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </Link>
          )}

          <h2 className="font-serif text-2xl font-black text-on-surface tracking-tight">
            {monthNames[month - 1]} {year}
          </h2>

          {isNextDisabled ? (
            <span className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-surface-container border-2 border-outline-variant text-on-surface-variant/40 rounded-lg cursor-not-allowed inline-flex items-center gap-1">
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </span>
          ) : (
            <Link
              href={`?year=${getNavParams(1).year}&month=${getNavParams(1).month}&desa=${selectedDesa}`}
              className="px-4 py-2 text-xs font-black uppercase tracking-wider bg-background hover:bg-surface-container-low text-on-surface border-2 border-on-surface rounded-lg transition-all inline-flex items-center gap-1 active:translate-y-0.5"
            >
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>

        {/* TAMPILAN NAMA HARI LEGER */}
        <div className="grid grid-cols-7 gap-3 text-center mb-3">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
            <div
              key={d}
              className="text-xs font-black text-on-surface-variant uppercase tracking-widest py-1 border-b border-dashed border-outline-variant"
            >
              {d}
            </div>
          ))}
        </div>

        {/* GRID KALENDER UTAMA */}
        <div className="grid grid-cols-7 gap-3">
          {/* Kolom Kosong Awal Bulan */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="h-28 bg-surface-container/10 rounded-xl border border-dashed border-outline-variant/40"
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
                  <Link
                    href={`/kkn/jurnal/${journals[0].slug}`}
                    className="h-28 border-2 border-on-surface p-3 bg-background hover:bg-surface-container-lowest rounded-xl flex flex-col justify-between transition-all duration-150 hard-shadow-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:hard-shadow-md"
                    title={journals[0].title}
                  >
                    <div className="w-full overflow-hidden">
                      <span className="text-sm font-black text-on-surface block mb-1">
                        {day}
                      </span>
                      <div className="text-[10px] bg-secondary text-on-secondary border border-on-surface px-1.5 py-0.5 rounded font-bold truncate">
                        {journals[0].title}
                      </div>
                    </div>

                    {journals.length > 1 && (
                      <div className="text-right">
                        <span className="inline-block text-[9px] bg-[#f97316] text-white border border-on-surface font-black px-1.5 py-0.5 rounded shadow-sm uppercase tracking-wide">
                          +{journals.length - 1} Log
                        </span>
                      </div>
                    )}
                  </Link>
                ) : (
                  <KKNJournalEmptyDay day={day} />
                )}
              </div>
            );
          })}
        </div>
        
      </main>
    </div>
  );
}