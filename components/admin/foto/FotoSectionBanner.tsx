import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminOrnaments } from "../AdminOrnaments";

type Crumb = { label: string; href?: string };

type FotoSectionBannerAction = {
  href: string;
  label: string;
  icon: LucideIcon;
};

type FotoSectionBannerProps = {
  crumbs: Crumb[];
  title: string;
  subtitle: string;
  badgeLabel: string;
  badgeIcon: LucideIcon;
  action?: FotoSectionBannerAction;
};

// Header section Galeri Foto — struktur SAMA PERSIS dengan
// components/admin/budaya/BudayaSectionBanner.tsx, tapi variant ornamen
// "budaya" (tertiary, direuse apa adanya) dan Badge "solid-tertiary" — karena
// kotak menu "Galeri Foto" di dashboard admin berwarna tertiary, satu
// keluarga aksen dengan KKN Hub/Peta Fasilitas. Sengaja file terpisah (bukan
// reuse BudayaSectionBanner) supaya domain foto tidak bergantung ke modul
// bernama domain lain.
export function FotoSectionBanner({
  crumbs,
  title,
  subtitle,
  badgeLabel,
  badgeIcon: BadgeIcon,
  action,
}: FotoSectionBannerProps) {
  return (
    <div className="relative isolate overflow-hidden rounded-2xl border-4 border-on-surface bg-aged-paper px-5 py-7 hard-shadow-lg sm:px-8 sm:py-9 lg:px-10">
      <AdminOrnaments variant="budaya" />

      <div className="relative z-10">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-label-sm font-black uppercase tracking-widest text-on-surface-variant">
            {crumbs.map((crumb, i) => (
              <span key={crumb.label} className="flex items-center gap-2">
                {i > 0 && <ChevronRight className="size-3.5" aria-hidden="true" />}
                {crumb.href ? (
                  <Link prefetch={false} href={crumb.href} className="transition-colors hover:text-on-surface">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-on-surface">{crumb.label}</span>
                )}
              </span>
            ))}
          </div>
          <Badge variant="solid-tertiary">
            <BadgeIcon aria-hidden="true" />
            {badgeLabel}
          </Badge>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="min-w-0">
            <h1 className="font-serif text-3xl font-black leading-tight tracking-tight text-on-surface wrap-break-word sm:text-display-lg">
              {title}
            </h1>
            <p className="mt-2 max-w-xl text-body-md font-medium text-on-surface-variant">
              {subtitle}
            </p>
          </div>

          {action && (
            <Link prefetch={false}
              href={action.href}
              className="inline-flex shrink-0 items-center gap-2 self-start rounded-xl border-2 border-on-surface bg-background px-4 py-2.5 text-label-md font-black uppercase tracking-wide text-on-surface hard-shadow-sm hard-shadow-hover press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <action.icon className="size-4" aria-hidden="true" />
              {action.label}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
