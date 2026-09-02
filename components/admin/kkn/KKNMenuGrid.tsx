"use client";

import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer } from "@/lib/animations";
import type { KKNHubMenuItem } from "@/constants/kknAdmin";
import { KKNMenuCard } from "./KKNMenuCard";

export function KKNMenuGrid({ items }: { items: KKNHubMenuItem[] }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      variants={staggerContainer}
      initial={shouldReduceMotion ? undefined : "hidden"}
      whileInView={shouldReduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      className="grid grid-cols-1 gap-6 md:grid-cols-3 md:auto-rows-[minmax(170px,auto)] md:grid-flow-dense"
    >
      {items.map((item) => (
        <KKNMenuCard key={item.href} item={item} />
      ))}
    </motion.div>
  );
}
