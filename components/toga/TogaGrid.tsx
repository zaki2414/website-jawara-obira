"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type TogaPlant } from "@/constants/toga";
import { TogaCard } from "./TogaCard";

type TogaGridProps = {
  items: TogaPlant[];
  isBento?: boolean;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.08 },
  },
};

// Animasi MASUK memakai kurva ease-out halus, BUKAN spring.
//
// Spring (stiffness 260 / damping 22) punya letupan awal dan sedikit
// overshoot di ujungnya. Untuk gestur yang bisa diinterupsi itu tepat, tapi
// untuk elemen yang muncul saat digulir efeknya persis seperti "dilempar" ke
// tempatnya — sensasi kaget yang sama dengan ease expo. Kartu tidak sedang
// merespons sentuhan siapa pun; ia hanya perlu hadir dengan tenang.
//
// Jarak geraknya juga diperkecil (y 40 -> 24, scale 0.94 -> 0.98): makin jauh
// lompatannya, makin terasa menyentak pada durasi yang sama.
const cardWrapperVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 12,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
};

export function TogaGrid({ items, isBento = false }: TogaGridProps) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 md:grid-flow-dense"
    >
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => {
          // Pola bento berulang setiap 4 kartu (bukan cuma kartu pertama) supaya
          // ukuran kartu bervariasi teratur tanpa terasa acak — nonaktif saat
          // pencarian aktif (isBento false) supaya hasil tetap seragam.
          const large = isBento && index % 4 === 0;
          return (
            <motion.div
              key={item.id}
              variants={cardWrapperVariants}
              layout
              className={`w-full ${large ? "md:col-span-2" : ""}`}
              whileHover={{
                y: -8,
                scale: 1.01,
                transition: { type: "spring" as const, stiffness: 400, damping: 20 },
              }}
            >
              <TogaCard item={item} index={index} large={large} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
