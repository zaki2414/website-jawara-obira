import Link from "next/link";
import { ArrowRight, Users, NotebookPen, Rocket } from "lucide-react";
import type { KKNHubIconKey, KKNHubMenuItem, KKNHubTone } from "@/constants/kknAdmin";

// Resolve string key -> komponen ikon di sini, bukan diterima lewat props —
// lihat catatan KKNHubIconKey di constants/kknAdmin.ts.
const ICONS: Record<KKNHubIconKey, typeof Users> = {
  users: Users,
  "notebook-pen": NotebookPen,
  rocket: Rocket,
};

// 3 nilai terang-gelap dalam satu keluarga emas, konsisten dengan kotak menu
// "KKN Hub" yang tertiary di dashboard utama.
//
// `dark` dulu memakai bg-on-tertiary. Itu token TEKS (warna tulisan di atas
// emas), dipakai sebagai permukaan — hasilnya kotak cokelat-zaitun yang tidak
// ada di palet manapun dan terbaca seperti kartu rusak di antara dua kartu
// emas. Sekarang memakai bg-on-surface: permukaan gelap yang memang sudah
// jadi bagian sistem (halaman publik /galeri memakai bidang yang sama dengan
// aksen tertiary), jadi kontrasnya tinggi dan warnanya masih satu cerita.
const TONE_STYLES: Record<
  KKNHubTone,
  { bg: string; text: string; subtext: string; iconChip: string }
> = {
  medium: {
    bg: "bg-tertiary",
    text: "text-on-tertiary",
    subtext: "text-on-tertiary/75",
    iconChip: "bg-tertiary-container text-on-tertiary",
  },
  dark: {
    bg: "bg-on-surface",
    text: "text-background",
    subtext: "text-background/75",
    iconChip: "bg-tertiary text-on-tertiary",
  },
  light: {
    bg: "bg-tertiary-container",
    text: "text-on-tertiary",
    subtext: "text-on-tertiary/75",
    iconChip: "bg-tertiary text-on-tertiary",
  },
};

// Tiga tile setara, bukan bento 2x2 + dua 1x1. Dengan hanya tiga menu, tile
// "feature" yang dipaksa setinggi dua baris menyisakan lubang kosong besar di
// tengahnya, dan dua tile kecil di sebelahnya menyembunyikan deskripsinya
// supaya muat — dua kompromi untuk susunan yang tidak memberi apa-apa. Tiga
// kartu sama besar lebih cepat dipindai dan semua deskripsinya terbaca.
export function KKNMenuCard({ item }: { item: KKNHubMenuItem }) {
  const Icon = ICONS[item.icon];
  const tone = TONE_STYLES[item.tone];

  return (
    <Link
      prefetch={false}
      href={item.href}
      className={`group relative flex h-full min-h-56 flex-col overflow-hidden rounded-2xl border-2 border-on-surface p-6 hard-shadow hard-shadow-hover press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary-container focus-visible:ring-offset-2 focus-visible:ring-offset-background ${tone.bg}`}
    >
      <Icon
        className={`pointer-events-none absolute -bottom-6 -right-6 size-28 opacity-20 ${tone.text}`}
        aria-hidden="true"
      />

      <span
        className={`relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-on-surface ${tone.iconChip}`}
      >
        <Icon className="size-5" aria-hidden="true" />
      </span>

      <h3 className={`relative mt-5 font-serif text-lg font-black tracking-tight ${tone.text}`}>
        {item.title}
      </h3>

      <p className={`relative mt-2 text-sm font-medium leading-relaxed ${tone.subtext}`}>
        {item.description}
      </p>

      <span
        className={`relative mt-auto inline-flex w-fit items-center gap-1.5 pt-6 text-label-sm font-black uppercase tracking-wide ${tone.text}`}
      >
        {item.action}
        <ArrowRight
          className="size-4 transition-transform duration-150 ease-[--ease-out] group-hover:translate-x-1"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
