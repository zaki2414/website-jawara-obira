// app/kkn/jurnal/page.tsx
import { getKKNJournalsByMonth } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import KKNJournalEmptyDay from "@/components/kkn/KKNJournalEmptyDay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";
import { KKNJournalHero } from "@/components/kkn/KKNJournalHero";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ year?: string; month?: string; desa?: string }>;
};

// Warna aktif per desa sama dengan penyaring di /kkn/proker — biru untuk
// Kawasi, emas untuk Soligi — supaya "desa mana yang sedang dilihat" ditandai
// warna yang sama di seluruh bagian KKN.
const VILLAGE_FILTERS = [
  { value: "kawasi", label: "Desa Kawasi", activeClass: "bg-primary text-on-primary" },
  { value: "soligi", label: "Desa Soligi", activeClass: "bg-tertiary text-on-tertiary" },
] as const;

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

  // Entri bulan ini diratakan jadi satu daftar terurut. Kalender bagus untuk
  // melihat SEBARAN tanggal, tapi buruk untuk membaca ISI — dengan satu entri
  // per bulan, seluruh judulnya terpotong di dalam sel selebar 12vw. Daftar di
  // bawahnya yang membuat isinya benar-benar terbaca.
  const monthEntries = Object.entries(groupedJournals ?? {})
    .flatMap(([date, list]) => list.map((entry) => ({ ...entry, date })))
    .sort((a, b) => a.date.localeCompare(b.date));

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay();
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  return (
    <div className="relative min-h-screen bg-cream-container/45 overflow-hidden">
      <KknPageBackground />

      <KKNJournalHero
          monthLabel={`${monthNames[month - 1]} ${year}`}
          entryCount={Object.values(groupedJournals ?? {}).reduce((sum, arr) => sum + arr.length, 0)}
        />

      <main className="relative max-w-7xl mx-auto z-10 px-4 sm:px-6 lg:px-8 py-12">

        {/* PENYARING DESA — bentuk chip yang sama dengan PageFilterBar
            (components/shared/PageFilterBar.tsx) yang dipakai Budaya, Galeri,
            TOGA, Fauna, dan UMKM, serta /kkn/proker: tinggi h-11, rounded-xl,
            border-2 di semua chip (bukan hanya yang aktif), huruf kapital
            tebal, dan warna solid per desa saat aktif.

            Sebelumnya deretan ini punya bentuknya sendiri — kotak abu-abu
            berisi dua tautan rounded-lg tanpa tepi, memakai font serif dan
            rata kanan — sehingga halaman ini dan /kkn/proker jadi dua
            halaman yang filternya terlihat beda sendiri dari sisa situs.

            Tetap <Link> (navigasi ?desa=, disaring di server), bukan tombol
            dengan callback seperti PageFilterBar — karena itu komponennya
            tidak dipakai ulang langsung di sini. year & month ikut dibawa
            supaya berpindah desa tidak melempar pembaca kembali ke bulan
            awal. */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="text-label-sm font-black uppercase tracking-widest text-on-surface-variant">
            Wilayah
          </span>
          <div role="group" aria-label="Saring menurut desa" className="flex flex-wrap gap-2">
            {VILLAGE_FILTERS.map((f) => {
              const isActive = selectedDesa === f.value;
              return (
                <Link
                  key={f.value}
                  href={`?year=${year}&month=${month}&desa=${f.value}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex h-11 shrink-0 items-center rounded-xl border-2 border-on-surface px-4 text-label-sm font-black uppercase tracking-wider transition-colors duration-150 press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive
                      ? `${f.activeClass} hard-shadow-sm`
                      : "bg-background text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}
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

        {/* ── DAFTAR ENTRI BULAN INI ────────────────────────────────
            Kalender menjawab "kapan", daftar ini menjawab "apa". Tanpanya,
            satu-satunya cara tahu isi sebuah jurnal adalah menebak dari judul
            terpotong di dalam sel kalender. */}
        {monthEntries.length > 0 && (
          <section className="mt-14">
            <div className="flex items-baseline justify-between gap-4 border-b-4 border-on-surface pb-3">
              <h2 className="text-label-md font-black uppercase tracking-[0.16em] text-on-surface">
                Catatan {monthNames[month - 1]}
              </h2>
              <span className="text-label-sm font-black tabular text-on-surface-variant">
                {monthEntries.length} entri
              </span>
            </div>

            <ul className="divide-y-2 divide-on-surface/10">
              {monthEntries.map((entry) => (
                <li key={entry.id}>
                  <Link
                    href={`/kkn/jurnal/${entry.slug}`}
                    className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[7rem_1fr_auto] items-center gap-x-5 gap-y-2 rounded-2xl px-3 py-4 transition-colors duration-200 hover:bg-background/70"
                  >
                    <div className="relative hidden h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 border-on-surface bg-surface-container-low sm:block">
                      {entry.cover_image ? (
                        <Image
                          src={entry.cover_image}
                          alt=""
                          aria-hidden="true"
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="112px"
                        />
                      ) : (
                        <div className="grid h-full place-items-center" aria-hidden="true">
                          <span className="text-label-sm font-black uppercase text-on-surface/30">
                            Tanpa foto
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-label-sm font-black uppercase tracking-[0.14em] text-primary tabular">
                        {new Date(entry.date).toLocaleDateString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                        })}
                      </span>
                      <h3 className="mt-1 font-serif text-xl font-black leading-tight text-on-surface text-balance md:text-2xl">
                        {entry.title}
                      </h3>
                    </div>

                    <ChevronRight
                      className="size-5 shrink-0 text-on-surface transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

      </main>
    </div>
  );
}