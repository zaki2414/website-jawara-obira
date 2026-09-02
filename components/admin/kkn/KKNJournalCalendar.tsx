"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  NotebookPen,
  Pencil,
  Plus,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/admin/DeleteButton";
import { getJournalVillageTags } from "./kknCardStyles";

export type KKNJournalCalendarEntry = {
  id: string;
  title: string;
  activity_date: string; // "YYYY-MM-DD"
  cover_image: string | null;
  villages: { name: string } | null;
};

type KKNJournalCalendarProps = {
  journals: KKNJournalCalendarEntry[];
  initialYear: number;
  initialMonth: number; // 1-12
};

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];
const WEEKDAY_NAMES = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

// Semua data diambil SEKALI di server (getAllKKNJournalsForAdmin, tanpa
// filter bulan) lalu dikelompokkan & dinavigasi sepenuhnya di client —
// pindah bulan jadi instan tanpa round-trip ke server, beda dari halaman
// publik (app/kkn/jurnal/page.tsx) yang fetch ulang tiap ganti bulan.
export function KKNJournalCalendar({
  journals,
  initialYear,
  initialMonth,
}: KKNJournalCalendarProps) {
  const [year, setYear] = useState(initialYear);
  const [month, setMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const byDate = useMemo(() => {
    const map: Record<string, KKNJournalCalendarEntry[]> = {};
    for (const j of journals) {
      (map[j.activity_date] ??= []).push(j);
    }
    return map;
  }, [journals]);

  const monthsWithEntries = useMemo(() => {
    const map = new Map<string, { year: number; month: number; count: number }>();
    for (const j of journals) {
      const [y, m] = j.activity_date.split("-").map(Number);
      const key = `${y}-${m}`;
      const existing = map.get(key);
      if (existing) existing.count += 1;
      else map.set(key, { year: y, month: m, count: 1 });
    }
    return [...map.values()].sort((a, b) => a.year - b.year || a.month - b.month);
  }, [journals]);

  const shiftMonth = (delta: number) => {
    let newMonth = month + delta;
    let newYear = year;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setYear(newYear);
    setMonth(newMonth);
  };

  const daysInMonth = new Date(year, month, 0).getDate();
  const firstWeekday = new Date(year, month - 1, 1).getDay();

  // Escape untuk menutup modal detail hari.
  useEffect(() => {
    if (!selectedDate) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedDate(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [selectedDate]);

  const selectedEntries = selectedDate ? byDate[selectedDate] || [] : [];

  return (
    <div>
      {/* Chip bulan yang punya data — lompat langsung, tidak perlu klik prev/next
          berkali-kali kalau data berjarak jauh (mis. arsip lintas tahun). */}
      {monthsWithEntries.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {monthsWithEntries.map((m) => {
            const active = m.year === year && m.month === month;
            return (
              <button
                key={`${m.year}-${m.month}`}
                type="button"
                onClick={() => {
                  setYear(m.year);
                  setMonth(m.month);
                }}
                className={`shrink-0 rounded-full border-2 border-on-surface px-3.5 py-1.5 text-label-sm font-black uppercase tracking-wide transition-all press-effect ${
                  active
                    ? "bg-tertiary text-on-tertiary hard-shadow-sm"
                    : "bg-background text-on-surface-variant hover:bg-surface-container-low"
                }`}
              >
                {MONTH_NAMES[m.month - 1].slice(0, 3)} {m.year} · {m.count}
              </button>
            );
          })}
        </div>
      )}

      {/* Navigasi bulan — bebas, tidak dikunci ke rentang tertentu, supaya
          admin bisa menelusuri seluruh arsip jurnal yang pernah dibuat. */}
      <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border-2 border-on-surface bg-background p-3 hard-shadow-sm">
        <Button type="button" variant="ghost" size="sm" onClick={() => shiftMonth(-1)}>
          <ChevronLeft className="size-4" aria-hidden="true" />
          Sebelumnya
        </Button>
        <h2 className="font-serif text-xl font-black tracking-tight text-on-surface">
          {MONTH_NAMES[month - 1]} {year}
        </h2>
        <Button type="button" variant="ghost" size="sm" onClick={() => shiftMonth(1)}>
          Selanjutnya
          <ChevronRight className="size-4" aria-hidden="true" />
        </Button>
      </div>

      {/* Nama hari */}
      <div className="mb-2 grid grid-cols-7 gap-1.5 text-center sm:gap-3">
        {WEEKDAY_NAMES.map((d) => (
          <div
            key={d}
            className="border-b border-dashed border-outline-variant py-1 text-label-sm font-black uppercase tracking-widest text-on-surface-variant"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid kalender */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} aria-hidden="true" />
        ))}

        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${pad(month)}-${pad(day)}`;
          const entries = byDate[dateStr] || [];
          const hasEntries = entries.length > 0;
          // Kalau 1 hari punya >1 entri, foto yang ditampilkan diselang-seling
          // berdasarkan tanggal (bukan selalu entri pertama) — supaya hari-hari
          // beruntun dengan banyak entri tidak menampilkan foto yang itu-itu
          // saja, mis. hari ini thumbnail Kawasi, besok Soligi, lusa Kawasi lagi.
          const featured = hasEntries ? entries[day % entries.length] : null;

          return (
            <button
              key={day}
              type="button"
              onClick={() => setSelectedDate(dateStr)}
              className={`group relative flex h-20 flex-col justify-between overflow-hidden rounded-lg border-2 p-2 text-left transition-all duration-150 sm:h-28 sm:p-3 sm:rounded-xl ${
                hasEntries
                  ? "border-on-surface hard-shadow-sm hover:-translate-y-0.5 hover:-translate-x-0.5 hover:hard-shadow-md cursor-pointer"
                  : "border-dashed border-outline-variant bg-surface-container-low/40 hover:border-on-surface hover:bg-surface-container-low"
              }`}
            >
              {hasEntries && (
                <>
                  {featured?.cover_image ? (
                    <Image
                      src={featured.cover_image}
                      alt=""
                      fill
                      className="object-cover transition-transform duration-200 group-hover:scale-105"
                      sizes="(max-width: 640px) 14vw, 12vw"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-tertiary-container" aria-hidden="true" />
                  )}
                  <div
                    className="absolute inset-0 bg-linear-to-t from-on-surface/90 via-on-surface/25 to-transparent"
                    aria-hidden="true"
                  />
                </>
              )}

              <span
                className={`relative z-10 text-sm font-black ${hasEntries ? "text-on-primary" : "text-on-surface-variant/50"}`}
              >
                {day}
              </span>
              {hasEntries ? (
                <div className="relative z-10 w-full overflow-hidden">
                  <div className="truncate text-label-sm font-black text-on-primary">
                    {featured!.title}
                  </div>
                  {entries.length > 1 && (
                    <div className="mt-1 text-right text-label-sm font-black uppercase tracking-wide text-on-primary/85">
                      +{entries.length - 1} log
                    </div>
                  )}
                </div>
              ) : (
                <span className="hidden text-right text-label-sm font-black uppercase tracking-wide text-on-surface-variant/30 sm:block">
                  Kosong
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Modal detail hari — edit/hapus entri yang ada, atau tambah baru. */}
      {selectedDate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedDate(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl border-4 border-on-surface bg-background hard-shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-2 border-on-surface bg-background px-5 py-4">
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-on-surface-variant" aria-hidden="true" />
                <h3 className="font-serif text-lg font-black text-on-surface">
                  {new Date(`${selectedDate}T00:00:00`).toLocaleDateString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDate(null)}
                aria-label="Tutup"
                className="inline-flex size-8 items-center justify-center rounded-lg border-2 border-on-surface text-on-surface transition-colors hover:bg-surface-container-low"
              >
                <X className="size-4" aria-hidden="true" />
              </button>
            </div>

            <div className="space-y-3 p-5">
              {selectedEntries.length === 0 ? (
                <p className="py-4 text-center text-sm text-on-surface-variant">
                  Belum ada jurnal untuk tanggal ini.
                </p>
              ) : (
                selectedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 rounded-xl border-2 border-on-surface bg-background p-3 hard-shadow-sm"
                  >
                    <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border-2 border-on-surface bg-surface-container-high">
                      {entry.cover_image ? (
                        <Image
                          src={entry.cover_image}
                          alt={entry.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                          <NotebookPen className="size-6" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-serif text-sm font-black text-on-surface">
                        {entry.title}
                      </p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {getJournalVillageTags(entry.villages?.name).map((tag) => (
                          <Badge key={tag} variant="solid-outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                      <Button asChild variant="ghost" size="icon" aria-label="Edit jurnal">
                        <Link href={`/admin/kkn/jurnal/${entry.id}`}>
                          <Pencil className="size-4" aria-hidden="true" />
                        </Link>
                      </Button>
                      <DeleteButton table="kkn_journals" id={entry.id} title={entry.title} />
                    </div>
                  </div>
                ))
              )}

              <Button asChild variant="outline" className="w-full">
                <Link href={`/admin/kkn/jurnal/new?date=${selectedDate}`}>
                  <Plus className="size-4" aria-hidden="true" />
                  Tambah Jurnal untuk Tanggal Ini
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
