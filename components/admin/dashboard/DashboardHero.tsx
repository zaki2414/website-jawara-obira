import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminOrnaments } from "../AdminOrnaments";

type DashboardHeroProps = {
  name: string;
};

export function DashboardHero({ name }: DashboardHeroProps) {
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="relative isolate overflow-hidden rounded-2xl border-4 border-on-surface bg-aged-paper px-5 py-7 hard-shadow-lg sm:px-8 sm:py-9 lg:px-10">
      <AdminOrnaments variant="dashboard" />

      <div className="relative z-10">
        {/* Tanpa label kicker di atas judul. "Panel Kendali Arsip" dulu duduk
            di sini sebagai eyebrow — pengulangan yang tidak menambah apa pun:
            admin sudah tahu ia di panel admin, dan Badge di kanan sudah
            menandainya. Judulnya menanggung bobotnya sendiri. */}
        <div className="mb-3 flex justify-end">
          <Badge variant="solid-tertiary">
            <Sparkles aria-hidden="true" />
            Admin
          </Badge>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-serif text-3xl font-black leading-tight tracking-tight text-on-surface wrap-break-word sm:text-display-lg">
              Selamat Datang, {name}
            </h1>
            <p className="mt-2 text-body-md font-medium capitalize text-on-surface-variant">
              {today}
            </p>
          </div>

          <Link prefetch={false}
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border-2 border-on-surface bg-background px-4 py-2.5 text-label-md font-black uppercase tracking-wide text-on-surface hard-shadow-sm hard-shadow-hover press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Lihat Situs Publik
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
