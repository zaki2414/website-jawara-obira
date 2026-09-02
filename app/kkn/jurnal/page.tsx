// app/kkn/jurnal/page.tsx
import { getKKNJournalsByMonth } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import KKNJournalEmptyDay from "@/components/kkn/KKNJournalEmptyDay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";
import { KKNJournalHero } from "@/components/kkn/KKNJournalHero";
import { Button } from "@/components/ui/button";

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
    <div className="relative min-h-screen bg-natural-paper py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <KknPageBackground />

      <main className="relative max-w-6xl mx-auto z-10">

        <KKNJournalHero
          monthLabel={`${monthNames[month - 1]} ${year}`}
          entryCount={Object.values(groupedJournals ?? {}).reduce((sum, arr) => sum + arr.length, 0)}
        />

        {/* TOGGLE NAVIGASI DESA BRUTALIST TAB */}
        <div className="flex justify-end mb-8">
          <div className="inline-flex p-1 bg-surface-container border-2 border-on-surface rounded-xl shrink-0">
            <Link
              href={`?year=${year}&month=${month}&desa=kawasi`}
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                selectedDesa === "kawasi"
                  ? "bg-on-surface text-background border-2 border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Desa Kawasi
            </Link>
            <Link
              href={`?year=${year}&month=${month}&desa=soligi`}
              className={`px-4 py-2 rounded-lg font-serif font-black text-sm uppercase tracking-wider transition-all ${
                selectedDesa === "soligi"
                  ? "bg-on-surface text-background border-2 border-on-surface"
                  : "text-on-surface-variant hover:text-on-surface"
              }`}
            >
              Desa Soligi
            </Link>
          </div>
        </div>

        {/* CALENDAR HEADER NAVIGASI */}
        <div className="mb-8 flex items-center justify-between gap-3 rounded-xl border-2 border-on-surface bg-background p-3 hard-shadow-sm">
          {isPrevDisabled ? (
            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl px-3 py-2 text-label-sm font-black uppercase tracking-wide text-on-surface-variant/40">
              <ChevronLeft className="size-4" aria-hidden="true" /> Sebelumnya
            </span>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link
                href={`?year=${getNavParams(-1).year}&month=${getNavParams(-1).month}&desa=${selectedDesa}`}
              >
                <ChevronLeft className="size-4" aria-hidden="true" /> Sebelumnya
              </Link>
            </Button>
          )}

          <h2 className="font-serif text-xl font-black tracking-tight text-on-surface">
            {monthNames[month - 1]} {year}
          </h2>

          {isNextDisabled ? (
            <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-xl px-3 py-2 text-label-sm font-black uppercase tracking-wide text-on-surface-variant/40">
              Selanjutnya <ChevronRight className="size-4" aria-hidden="true" />
            </span>
          ) : (
            <Button asChild variant="ghost" size="sm">
              <Link
                href={`?year=${getNavParams(1).year}&month=${getNavParams(1).month}&desa=${selectedDesa}`}
              >
                Selanjutnya <ChevronRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          )}
        </div>

        {/* TAMPILAN NAMA HARI LEGER */}
        <div className="mb-2 grid grid-cols-7 gap-1.5 text-center sm:gap-3">
          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
            <div
              key={d}
              className="border-b border-dashed border-outline-variant py-1 text-label-sm font-black uppercase tracking-widest text-on-surface-variant"
            >
              {d}
            </div>
          ))}
        </div>

        {/* GRID KALENDER UTAMA */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {/* Kolom Kosong Awal Bulan */}
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} aria-hidden="true" />
          ))}

          {/* Tanggal Aktif Bulan Ini */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const journals = groupedJournals?.[dateStr] || [];
            const hasEntries = journals.length > 0;
            // Kalau 1 hari punya >1 entri, foto & link yang ditampilkan
            // diselang-seling berdasarkan tanggal (bukan selalu entri
            // pertama) — sama seperti kalender manajemen admin.
            const featured = hasEntries ? journals[day % journals.length] : null;

            return hasEntries && featured ? (
              <Link
                key={day}
                href={`/kkn/jurnal/${featured.slug}`}
                title={featured.title}
                className="group relative flex h-20 flex-col justify-between overflow-hidden rounded-lg border-2 border-on-surface p-2 text-left transition-all duration-150 hard-shadow-sm hover:-translate-y-0.5 hover:hard-shadow-md sm:h-28 sm:rounded-xl sm:p-3"
              >
                {featured.cover_image ? (
                  <Image
                    src={featured.cover_image}
                    alt=""
                    fill
                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                    sizes="(max-width: 640px) 14vw, 12vw"
                  />
                ) : (
                  <div className="absolute inset-0 bg-primary-container" aria-hidden="true" />
                )}
                <div
                  className="absolute inset-0 bg-linear-to-t from-on-surface/90 via-on-surface/25 to-transparent"
                  aria-hidden="true"
                />

                <span className="relative z-10 text-sm font-black text-on-primary">{day}</span>
                <div className="relative z-10 w-full overflow-hidden">
                  <div className="truncate text-label-sm font-black text-on-primary">
                    {featured.title}
                  </div>
                  {journals.length > 1 && (
                    <div className="mt-1 text-right text-label-sm font-black uppercase tracking-wide text-on-primary/85">
                      +{journals.length - 1} Log
                    </div>
                  )}
                </div>
              </Link>
            ) : (
              <KKNJournalEmptyDay key={day} day={day} />
            );
          })}
        </div>

      </main>
    </div>
  );
}