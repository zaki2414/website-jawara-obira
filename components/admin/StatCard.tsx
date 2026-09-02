import type { LucideIcon } from "lucide-react";
import type { AdminAccentTone } from "@/constants/admin";
import { ADMIN_ACCENT_STYLES } from "./adminAccent";

// Dipakai bersama oleh dashboard admin (app/admin/page.tsx) dan KKN hub
// (app/admin/kkn/page.tsx) — kartu statistik solid-color generik.
type StatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  accent: AdminAccentTone;
  emptyHint: string;
};

export function StatCard({ label, value, icon: Icon, accent, emptyHint }: StatCardProps) {
  const a = ADMIN_ACCENT_STYLES[accent];
  const isEmpty = value === 0;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border-2 border-on-surface p-5 hard-shadow-md transition-all hover:-translate-y-1 hover:hard-shadow ${a.solidBg}`}
    >
      <Icon
        className={`pointer-events-none absolute -bottom-3 -right-3 size-20 opacity-10 ${a.text}`}
        aria-hidden="true"
      />
      <span className="relative inline-flex size-11 items-center justify-center rounded-xl border-2 border-on-surface bg-background text-on-surface">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <p className={`relative mt-4 font-serif text-3xl font-black leading-none ${a.text}`}>
        {value}
      </p>
      <p className={`relative mt-1.5 text-sm font-bold ${a.subtext}`}>{label}</p>
      {isEmpty && (
        <p className={`relative mt-1 text-xs font-bold ${a.subtext}`}>{emptyHint}</p>
      )}
    </div>
  );
}
