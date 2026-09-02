// app/admin/kkn/jurnal/page.tsx
import { getAllKKNJournalsForAdmin } from "@/lib/supabase/queries";
import { AlertTriangle, NotebookPen, Plus } from "lucide-react";
import { KKNSectionBanner } from "@/components/admin/kkn/KKNSectionBanner";
import {
  KKNJournalCalendar,
  type KKNJournalCalendarEntry,
} from "@/components/admin/kkn/KKNJournalCalendar";

export const dynamic = "force-dynamic";

export default async function AdminKKNJournalList() {
  const { data, error } = await getAllKKNJournalsForAdmin();
  const journals = (data ?? []) as unknown as KKNJournalCalendarEntry[];

  const now = new Date();
  // Default ke bulan entri jurnal PALING BARU (bukan selalu bulan berjalan) —
  // supaya admin tidak mendarat di kalender kosong kalau seluruh data ada di
  // periode lain (mis. arsip KKN yang sudah lewat).
  const latest = journals.length > 0 ? journals[journals.length - 1] : null;
  const [initialYear, initialMonth] = latest
    ? latest.activity_date.split("-").map(Number)
    : [now.getFullYear(), now.getMonth() + 1];

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <KKNSectionBanner
          crumbs={[
            { label: "Dashboard", href: "/admin" },
            { label: "KKN Hub", href: "/admin/kkn" },
            { label: "Jurnal" },
          ]}
          title="Kalender Jurnal KKN"
          subtitle={`${journals.length} log kegiatan terdokumentasi sepanjang program.`}
          badgeLabel="Jurnal KKN"
          badgeIcon={NotebookPen}
          action={{ href: "/admin/kkn/jurnal/new", label: "Tambah Jurnal", icon: Plus }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data jurnal. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : (
          <KKNJournalCalendar
            journals={journals}
            initialYear={initialYear}
            initialMonth={initialMonth}
          />
        )}
      </div>
    </main>
  );
}
