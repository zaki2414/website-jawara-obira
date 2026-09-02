"use client";

import { motion } from "framer-motion";
import {
  Box,
  Package,
  UtensilsCrossed,
  Coffee,
  Fish,
  Carrot,
  Shirt,
  Wrench,
  Palette,
  Cookie,
  ShoppingBasket,
  type LucideIcon,
} from "lucide-react";
import {
  UMKM_DETAIL_CONTENT,
  BUSINESS_ACCENT_STYLES,
  nextAccent,
  type GroupedProducts,
  type BusinessAccent,
} from "@/constants/umkm";

type ProductsSectionProps = {
  productsByCategory: GroupedProducts;
  accent: BusinessAccent;
};

const list = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const item = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35 } },
};

// Semua logo kategori produk memakai lucide-react — dipetakan dari kata kunci
// nama kategori (bukan lagi emoji `category.icon` dari database), dengan
// Package sebagai fallback netral kalau tidak ada kata kunci yang cocok.
const CATEGORY_ICON_RULES: [RegExp, LucideIcon][] = [
  [/makan|nasi|lauk|kuliner|catering/i, UtensilsCrossed],
  [/minum|kopi|teh|jus|susu/i, Coffee],
  [/laut|ikan|udang|kerang|nelayan/i, Fish],
  [/sayur|buah|kebun|tani/i, Carrot],
  [/kain|jahit|tenun|pakaian|busana/i, Shirt],
  [/jasa|servis|montir|reparasi|bengkel/i, Wrench],
  [/kerajinan|kriya|anyaman|ukir|handmade/i, Palette],
  [/kue|snack|jajan|roti|cemilan/i, Cookie],
  [/sembako|bahan|kelontong|toko/i, ShoppingBasket],
];

function getCategoryIcon(categoryName: string): LucideIcon {
  const match = CATEGORY_ICON_RULES.find(([pattern]) => pattern.test(categoryName));
  return match ? match[1] : Package;
}

export function ProductsSection({ productsByCategory, accent }: ProductsSectionProps) {
  const categories = Object.entries(productsByCategory);

  return (
    <motion.section
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="bg-background p-8 border-4 border-tertiary rounded-2xl hard-shadow-lg space-y-6"
    >
      <div className="flex items-center justify-between border-b-2 border-dashed border-outline-variant pb-5">
        <h2 className="font-serif text-2xl font-black text-on-surface">
          {UMKM_DETAIL_CONTENT.productsTitle}
        </h2>
        <Box className="w-6 h-6 text-tertiary/50" />
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        {categories.map(([catName, data], idx) => {
          let barAccent = accent;
          for (let i = 0; i < idx; i++) barAccent = nextAccent(barAccent);
          const barStyles = BUSINESS_ACCENT_STYLES[barAccent];
          const CategoryIcon = getCategoryIcon(catName);

          return (
          <motion.div
            key={catName}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.07, duration: 0.5 }}
            className="relative pl-5 space-y-3"
          >
            <span
              className={`absolute left-0 top-1 bottom-1 w-1 rounded-full ${barStyles.topBar}`}
              aria-hidden="true"
            />

            <h3 className="font-bold text-on-surface flex items-center gap-2 text-sm uppercase tracking-wide">
              <CategoryIcon className={`w-4 h-4 shrink-0 ${barStyles.text}`} />
              {catName}
            </h3>

            <motion.ul
              variants={list}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-wrap gap-2"
            >
              {data.items.map((entry: string, i: number) => (
                <motion.li
                  key={i}
                  variants={item}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-on-surface bg-background border-2 border-on-surface rounded-full px-3 py-1.5 hard-shadow-sm"
                >
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${barStyles.chipDot}`} aria-hidden="true" />
                  {entry}
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}