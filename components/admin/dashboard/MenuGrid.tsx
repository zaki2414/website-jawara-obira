"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import type { AdminMenuItem } from "@/constants/admin";
import { MenuCard } from "./MenuCard";

// Grid bento: dasar 1 kolom (mobile, semua tile 1x1 supaya tidak overflow),
// lalu jadi mosaic 2/4 kolom dengan tinggi baris tetap dari sm: ke atas —
// lihat SIZE_SPAN di MenuCard.tsx untuk span per ukuran tile.
export function MenuGrid({ items }: { items: AdminMenuItem[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={staggerContainer}
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:auto-rows-[minmax(150px,auto)] sm:grid-flow-dense lg:grid-cols-4"
    >
      {items.map((item) => (
        <MenuCard key={item.href} item={item} />
      ))}
    </motion.div>
  );
}
