"use client";

import { motion } from "framer-motion";
import { galeriCardVariants, type GalleryItem } from "@/constants/galeri";
import { GaleriCard } from "./GaleriCard";

type GaleriGridProps = {
  items: GalleryItem[];
  onOpen?: (item: GalleryItem) => void;
};

export function GaleriGrid({ items, onOpen }: GaleriGridProps) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:balance]">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          custom={index}
          variants={galeriCardVariants}
          initial="hidden"
          animate="visible"
          className="break-inside-avoid mb-6"
        >
          <GaleriCard item={item} onOpen={onOpen} />
        </motion.div>
      ))}
    </div>
  );
}
