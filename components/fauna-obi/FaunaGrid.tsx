"use client";

import { motion, AnimatePresence } from "framer-motion";
import { type Fauna } from "@/constants/fauna";
import { FaunaCard } from "./FaunaCard";

type FaunaGridProps = {
  items: Fauna[];
  isBento?: boolean;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

const cardWrapperVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 22 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.2, ease: "easeOut" as const },
  },
};

export function FaunaGrid({ items, isBento = false }: FaunaGridProps) {
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
          // pencarian/filter aktif (isBento false) supaya hasil tetap seragam.
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
              <FaunaCard item={item} index={index} large={large} />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}
