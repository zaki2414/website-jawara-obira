import type { LucideIcon } from "lucide-react";

// Statistik ringkas sengaja netral (bg-background, senada dengan panel
// header/hero) dengan AKSEN kuning/emas pada icon chip + angka — beda dari
// kartu menu di bawahnya yang solid penuh. Ini memberi jenjang visual: data
// ringkasan tenang & mudah dibaca, kartu aksi (menu) yang tampil mencolok.
type KKNStatCardProps = {
  label: string;
  value: number;
  icon: LucideIcon;
  emptyHint: string;
};

export function KKNStatCard({ label, value, icon: Icon, emptyHint }: KKNStatCardProps) {
  const isEmpty = value === 0;

  return (
    <div className="flex items-center gap-4 rounded-2xl border-2 border-on-surface bg-background p-4 hard-shadow-sm transition-all hover:-translate-y-1 hover:hard-shadow">
      <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-on-surface bg-tertiary text-on-tertiary">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="font-serif text-2xl font-black leading-none text-on-tertiary">{value}</p>
        <p className="mt-1.5 truncate text-sm font-bold text-on-surface-variant">{label}</p>
        {isEmpty && (
          <p className="mt-0.5 text-xs font-bold text-on-surface-variant/70">{emptyHint}</p>
        )}
      </div>
    </div>
  );
}
