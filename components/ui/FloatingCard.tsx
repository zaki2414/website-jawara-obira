"use client";

import { motion } from "framer-motion";
import Image from "next/image";

type FloatingCardProps = {
  index: number;
  src: string;
  alt: string;
  className?: string;
};

export function FloatingCard({ index, src, alt, className = "" }: FloatingCardProps) {
  const baseRotation = -15 + index * 15;
  const baseX = index * 40;
  const baseY = index * 30;

  return (
    <motion.div
      className={`absolute w-72 h-96 rounded-2xl overflow-hidden border-2 border-on-surface hard-shadow-lg ${className}`}
      style={{ rotate: baseRotation, x: baseX, y: baseY }}
      animate={{
        y: [baseY, baseY - 20, baseY],
        rotate: [baseRotation, baseRotation + 5, baseRotation],
      }}
      transition={{
        duration: 4 + index * 0.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      whileHover={{ scale: 1.05, zIndex: 10 }}
    >
      <Image src={src} alt={alt} fill className="object-cover" priority />
      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
    </motion.div>
  );
}