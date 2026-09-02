"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Users, NotebookPen, Rocket } from "lucide-react";
import { scaleIn } from "@/lib/animations";
import type { KKNHubIconKey, KKNHubMenuItem, KKNHubTone } from "@/constants/kknAdmin";

// Resolve string key -> komponen ikon DI DALAM client component ini (bukan
// diterima lewat props) — lihat catatan KKNHubIconKey di constants/kknAdmin.ts.
const ICONS: Record<KKNHubIconKey, typeof Users> = {
  users: Users,
  "notebook-pen": NotebookPen,
  rocket: Rocket,
};

// 3 shade kuning/emas yang benar-benar berbeda nilainya (bukan rotasi
// primary/tertiary/cream seperti dashboard utama, tapi tetap satu keluarga
// warna — lihat komentar KKNHubTone di constants/kknAdmin.ts), konsisten
// dengan kotak menu "KKN Hub" yang sekarang tertiary. Dulu keluarga biru,
// diganti tertiary — pasangan on-tertiary/tertiary-container sebagai
// "gelap"/"terang" dipakai sesuai kontras yang sudah tervalidasi WCAG di
// budayaCardStyles.ts (tertiary-container+on-tertiary ≈ 8.6:1, simetris).
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
    bg: "bg-on-tertiary",
    text: "text-tertiary-container",
    subtext: "text-tertiary-container/75",
    iconChip: "bg-tertiary-container text-on-tertiary",
  },
  light: {
    bg: "bg-tertiary-container",
    text: "text-on-tertiary",
    subtext: "text-on-tertiary/75",
    iconChip: "bg-tertiary text-on-tertiary",
  },
};

export function KKNMenuCard({ item }: { item: KKNHubMenuItem }) {
  const Icon = ICONS[item.icon];
  const tone = TONE_STYLES[item.tone];
  const isFeature = item.size === "feature";

  return (
    <motion.div
      variants={scaleIn}
      className={
        isFeature
          ? "h-full md:col-span-2 md:row-span-2"
          : "h-full md:col-span-1 md:row-span-1"
      }
    >
      <Link
        href={item.href}
        className={`group relative flex h-full min-h-56 flex-col overflow-hidden rounded-2xl border-2 border-on-surface p-6 hard-shadow transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:hard-shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary-container focus-visible:ring-offset-2 focus-visible:ring-offset-background ${tone.bg} ${isFeature ? "" : "md:min-h-0"}`}
      >
        <Icon
          className={`pointer-events-none absolute -bottom-6 -right-6 opacity-20 ${tone.text} ${isFeature ? "size-36" : "size-24"}`}
          aria-hidden="true"
        />

        <span
          className={`relative inline-flex shrink-0 items-center justify-center rounded-xl border-2 border-on-surface ${tone.iconChip} ${isFeature ? "size-14" : "size-11"}`}
        >
          <Icon className={isFeature ? "size-6" : "size-5"} aria-hidden="true" />
        </span>

        <h3
          className={`relative mt-5 font-serif font-black tracking-tight ${tone.text} ${isFeature ? "text-2xl" : "text-lg"}`}
        >
          {item.title}
        </h3>

        {isFeature && (
          <p className={`relative mt-2 text-sm font-medium leading-relaxed ${tone.subtext}`}>
            {item.description}
          </p>
        )}

        <span
          className={`relative mt-auto inline-flex w-fit items-center gap-1.5 pt-6 font-black uppercase tracking-wide ${tone.text} ${isFeature ? "text-label-md" : "text-label-sm"}`}
        >
          {item.action}
          <ArrowRight
            className="size-4 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </span>
      </Link>
    </motion.div>
  );
}
