"use client";

import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { useRef } from "react";

type DetailOrnamentsProps = {
  containerRef?: React.RefObject<HTMLElement | null>;
};

/**
 * DetailOrnaments
 *
 * Dekorasi SVG untuk halaman detail budaya (/budaya/[slug]).
 * Menggabungkan:
 * - 2x Hiasan 5.svg (Brand Identity) - konsisten dengan halaman list /budaya
 * - 1x Hiasan 4.svg (Kompas Parallax) - konsisten dengan halaman /profil
 *
 * Semua ornamen parallax-responsive terhadap scroll position.
 */
export function DetailOrnaments({ containerRef }: DetailOrnamentsProps) {
  const localRef = useRef<HTMLElement>(null);
  const targetRef = containerRef ?? localRef;
  const shouldReduceMotion = useReducedMotion();

  // Parallax tracking - kalau ada containerRef, track scroll relative ke container itu;
  // kalau tidak, jatuh balik ke localRef (yang tidak pernah ter-attach ke elemen manapun
  // di sini, sehingga useScroll otomatis melacak scroll dokumen secara keseluruhan).
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  // Transform untuk parallax hiasan
  const ornament1Y = useTransform(smoothProgress, [0, 1], [0, 80]);
  const ornament1Rotate = useTransform(smoothProgress, [0, 1], [0, 180]);

  const ornament2Y = useTransform(smoothProgress, [0, 1], [0, -60]);
  const ornament2Rotate = useTransform(smoothProgress, [0, 1], [360, 180]);

  return (
    <>
      {/* ═══════════════════════════════════════════════════ */}
      {/* BRAND IDENTITY ORNAMENTS (Hiasan 5.svg) */}
      {/* Konsisten dengan halaman list /budaya */}
      {/* ═══════════════════════════════════════════════════ */}

      {/* Desktop Ornaments - Parallax bergerak lambat */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
        {/* Ornament 1: Kiri Atas - Bergerak ke bawah */}
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { y: ornament1Y, rotate: ornament1Rotate }
          }
          className="absolute -left-24 top-1/4 w-80 h-80 opacity-30 origin-center"
        >
          <Image
            src="/Hiasan 5.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </motion.div>

        {/* Ornament 2: Kanan Bawah - Bergerak ke atas (berlawanan) */}
        <motion.div
          style={
            shouldReduceMotion
              ? undefined
              : { y: ornament2Y, rotate: ornament2Rotate }
          }
          className="absolute -right-24 bottom-1/4 w-72 h-72 opacity-30 origin-center"
        >
          <Image
            src="/Hiasan 5.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </motion.div>
      </div>

      {/* Mobile Subtle Backdrop - Static (biar ga berat) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none lg:hidden opacity-[0.08]">
        <div className="absolute -top-16 -right-16 w-48 h-48">
          <Image
            src="/Hiasan 5.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48">
          <Image
            src="/Hiasan 5.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
      </div>
    </>
  );
}