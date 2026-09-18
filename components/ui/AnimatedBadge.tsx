"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AnimatedBadgeProps = {
  label: string;
  className?: string;
  icon?: LucideIcon;
  animated?: boolean;
};

export function AnimatedBadge({
  label,
  className,
  icon: Icon,
  animated = true,
}: AnimatedBadgeProps) {
  return (
    <motion.div
      // cn()/twMerge (BUKAN template literal biasa) — supaya className dari
      // caller yang override border/warna dasar (mis. border-primary/20)
      // benar-benar MENGGANTI kelas default, bukan cuma ditambah di belakang
      // string (dua class border-* yang "rebutan" menang secara implisit
      // tergantung urutan di CSS terkompilasi, bukan urutan di JSX — lihat
      // catatan bug yang sama di lib/utils.ts).
      className={cn(
        "inline-flex items-center gap-3 border-2 border-on-surface px-6 py-3 rounded-full w-fit",
        className,
      )}
      whileHover={
        animated ? { scale: 1.03, boxShadow: "3px 3px 0px rgb(29 28 24 / 0.9)" } : undefined
      }
    >
      {Icon && animated && (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-3 h-3 bg-primary rounded-full"
        />
      )}
      {Icon && !animated && <Icon className="w-4 h-4" />}
      <span className="text-sm font-semibold text-on-surface tracking-widest uppercase">
        {label}
      </span>
    </motion.div>
  );
}