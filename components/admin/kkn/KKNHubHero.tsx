import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminOrnaments } from "../AdminOrnaments";

// Hero KKN hub — struktur sama dengan DashboardHero (eyebrow + badge + judul +
// CTA di atas panel aged-paper + ornamen), tapi variant ornamen "kkn" dan CTA
// mengarah kembali ke Dashboard (bukan ke situs publik) supaya tidak terasa
// seperti kartu yang di-copy identik dari halaman dashboard.
export function KKNHubHero() {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border-4 border-on-surface bg-aged-paper px-5 py-7 hard-shadow-lg sm:px-8 sm:py-9 lg:px-10">
      <AdminOrnaments variant="budaya" />

      <div className="relative z-10">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-1.5 text-label-sm font-black uppercase tracking-widest text-on-surface-variant">
            <span className="size-1.5 rounded-full bg-tertiary" aria-hidden="true" />
            Ekspedisi Kawasi &amp; Soligi
          </span>
          <Badge variant="solid-tertiary" aria-hidden="true">
            <Compass aria-hidden="true" />
            KKN Hub
          </Badge>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-serif text-3xl font-black leading-tight tracking-tight text-on-surface wrap-break-word sm:text-display-lg">
              Pusat Kendali Program KKN
            </h1>
            <p className="mt-2 max-w-xl text-body-md font-medium text-on-surface-variant">
              Kelola keanggotaan tim, log harian lapangan, dan capaian program kerja
              dalam satu tempat.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border-2 border-on-surface bg-background px-4 py-2.5 text-label-md font-black uppercase tracking-wide text-on-surface hard-shadow-sm hard-shadow-hover press-effect transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
