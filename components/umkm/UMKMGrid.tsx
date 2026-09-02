"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import { useRef } from "react";
import { useInView } from "react-intersection-observer";
import Image from "next/image";
import { type UMKMItem } from "@/constants/umkm";
import { UMKMCard } from "./UMKMCard";

type UMKMGridProps = {
  items: UMKMItem[];
  isBento?: boolean;
};

export function UMKMGrid({ items, isBento = false }: UMKMGridProps) {
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.05,
    triggerOnce: true,
  });

  // High-fidelity Scroll Tracking untuk animasi backdrop ornamen
  const { scrollYProgress } = useScroll({
    target: gridContainerRef,
    offset: ["start end", "end start"],
  });

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
  });

  // Efek rotasi sinematik pelan pada kompas background saat halaman di-scroll
  const backdropRotate = useTransform(smoothScroll, [0, 1], [0, 45]);
  const backdropY = useTransform(smoothScroll, [0, 1], [-50, 50]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15,
      },
    },
  };

  // Efek 3D Reveal Avant-Garde yang lebih kentara saat masuk viewport
  const cardWrapperVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.92,
      rotateX: 12,
      z: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      z: 0,
      transition: {
        type: "spring" as const,
        stiffness: 65,
        damping: 14,
        mass: 0.9,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.85,
      y: 30,
      transition: {
        duration: 0.2,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <div
      ref={gridContainerRef}
      className="relative w-full py-8 perspective-distant overflow-visible"
    >
      {/* ─── AMBIENT SPOTLIGHT BACKGROUND ORNAMENT ─── */}
      <motion.div
        style={{ rotate: backdropRotate, y: backdropY }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-150 h-150 pointer-events-none select-none opacity-[0.03] mix-blend-multiply z-0 hidden lg:block"
      >
        <Image
          src="/Hiasan 4.svg"
          alt="Watermark Kompas"
          fill
          className="object-contain"
        />
      </motion.div>

      {/* AMBIENT GLOW EFFECT (Warna Identitas Brand) */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-tertiary/5 rounded-full blur-[120px] pointer-events-none z-0" />

      {/* ─── MAIN GRID FLOW ─── */}
      <motion.div
        ref={inViewRef}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 md:grid-flow-dense"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => {
            // Pola bento berulang setiap 4 kartu (bukan cuma kartu pertama)
            // supaya ukuran kartu bervariasi teratur — nonaktif saat
            // pencarian/filter aktif (isBento false) supaya hasil tetap
            // seragam, sama seperti FaunaGrid.tsx/TogaGrid.tsx. h-full di
            // wrapper supaya kartu non-large tetap ikut tinggi baris grid
            // (align-items: stretch), bukan cuma setinggi kontennya sendiri.
            const large = isBento && index % 4 === 0;
            return (
              <motion.div
                key={item.id}
                variants={cardWrapperVariants}
                layout
                className={`w-full h-full origin-center ${large ? "md:col-span-2" : ""}`}
                whileHover={{
                  y: -8,
                  scale: 1.01,
                  transition: { type: "spring" as const, stiffness: 400, damping: 20 },
                }}
              >
                <UMKMCard item={item} index={index} large={large} />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
