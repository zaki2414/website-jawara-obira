"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * AtlasBackground
 *
 * Komponen dekoratif latar belakang untuk halaman profil.
 * Menggunakan parallax scroll pada kompas dan 3 ornamen SVG yang berputar.
 */
export function AtlasBackground() {
  const { scrollY } = useScroll();
  const rotateCompass = useTransform(scrollY, [0, 1000], [0, 360]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-15">
      {/* HIASAN 1: Grid Garis Topografi Klasik */}
      <div className="absolute inset-0">
        <svg
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="topography-grid"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-on-surface/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topography-grid)" />
        </svg>
      </div>

      {/* HIASAN 2: Kompas Berputar (Parallax Scroll) */}
      <motion.div
        style={{ rotate: rotateCompass }}
        className="absolute -right-20 top-1/4 w-96 h-96 opacity-40"
      >
        <Image
          src="/Hiasan 1.svg"
          alt=""
          fill
          className="object-contain"
          aria-hidden="true"
        />
      </motion.div>

      {/* HIASAN 3: Ornamen Statis dengan Float Animation */}
      <motion.div
        className="absolute -left-20 bottom-1/4 w-80 h-80 opacity-30"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image
          src="/Hiasan 1.svg"
          alt=""
          fill
          className="object-contain"
          aria-hidden="true"
        />
      </motion.div>
    </div>
  );
}