"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { getCategoryAccent, CATEGORY_ACCENT_STYLES } from "@/constants/budaya";

type HeroBannerProps = {
  imageUrl: string;
  title: string;
  category?: string;
};

export function HeroBanner({ imageUrl, title, category }: HeroBannerProps) {
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });
  const accent = getCategoryAccent(category);
  const styles = CATEGORY_ACCENT_STYLES[accent];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.8 }}
      className="relative w-full mb-16"
    >
      {/* Aksen bar kategori di atas figure — pemisah warna dari panel judul */}
      <div className={`h-2 w-24 rounded-t-full ${styles.topBar} ml-4`} aria-hidden="true" />

      <div className="relative w-full h-64 md:h-112.5 border-4 border-on-surface rounded-2xl overflow-hidden hard-shadow-lg">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="relative w-full h-full"
        >
          <Image
            src={imageUrl}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover"
          />
        </motion.div>

        <motion.div
          className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        />

        {/* Caption strip ala label pameran museum */}
        {category && (
          <div
            className={`absolute bottom-0 left-0 right-0 ${styles.badge} border-t-4 border-on-surface px-5 py-2.5 flex items-center gap-2 backdrop-blur-sm`}
          >
            <span className="text-label-sm font-black uppercase tracking-widest">
              {category}
            </span>
            <span className="w-1 h-1 rounded-full bg-current opacity-60" aria-hidden="true" />
            <span className="text-label-sm font-semibold uppercase tracking-wider opacity-80 truncate">
              Arsip Kebudayaan Obira
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
