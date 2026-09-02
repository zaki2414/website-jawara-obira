"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const ornamentsByVariant = {
  default: [
    {
      key: "2",
      src: "/Hiasan 2.svg",
      className: "absolute top-8 left-6 w-72 h-72 opacity-30",
      animate: {
        rotate: [0, 360, 0],
        scale: [1, 1.08, 1],
        opacity: [0.18, 0.28, 0.18],
      },
      transition: { duration: 28, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      key: "3",
      src: "/Hiasan 3.svg",
      className: "absolute bottom-10 right-10 w-64 h-64 opacity-24",
      animate: {
        rotate: [0, -360, 0],
        scale: [1, 1.12, 1],
        opacity: [0.14, 0.22, 0.14],
      },
      transition: {
        duration: 30,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 0.8,
      },
    },
    {
      key: "4",
      src: "/Hiasan 4.svg",
      className: "absolute top-1/3 right-20 w-80 h-80 opacity-16",
      animate: {
        rotate: [0, 360, 0],
        scale: [1, 1.06, 1],
        opacity: [0.1, 0.18, 0.1],
      },
      transition: {
        duration: 32,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 1.2,
      },
    },
    {
      key: "5",
      src: "/Hiasan 5.svg",
      className: "absolute left-10 bottom-24 w-64 h-64 opacity-18",
      animate: {
        rotate: [0, -360, 0],
        scale: [1, 1.05, 1],
        opacity: [0.12, 0.2, 0.12],
      },
      transition: {
        duration: 26,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 0.4,
      },
    },
  ],
  minimal: [
    {
      key: "2",
      src: "/Hiasan 2.svg",
      className: "absolute top-10 left-8 w-72 h-72 opacity-22",
      animate: {
        rotate: [0, 360, 0],
        scale: [1, 1.06, 1],
        opacity: [0.14, 0.22, 0.14],
      },
      transition: { duration: 30, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      key: "5",
      src: "/Hiasan 5.svg",
      className: "absolute bottom-14 right-12 w-64 h-64 opacity-18",
      animate: {
        rotate: [0, -360, 0],
        scale: [1, 1.04, 1],
        opacity: [0.12, 0.18, 0.12],
      },
      transition: {
        duration: 32,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 0.6,
      },
    },
  ],
  // Pasangan Hiasan 3+4 di sudut berlawanan dari "minimal" (2+5), supaya halaman
  // yang memakai variant ini punya identitas ornamen sendiri yang jelas berbeda.
  "minimal-alt": [
    {
      key: "3",
      src: "/Hiasan 3.svg",
      className: "absolute top-12 right-10 w-72 h-72 opacity-20",
      animate: {
        rotate: [0, -360, 0],
        scale: [1, 1.06, 1],
        opacity: [0.13, 0.2, 0.13],
      },
      transition: { duration: 30, repeat: Infinity, ease: "easeInOut" as const },
    },
    {
      key: "4",
      src: "/Hiasan 4.svg",
      className: "absolute bottom-12 left-10 w-64 h-64 opacity-16",
      animate: {
        rotate: [0, 360, 0],
        scale: [1, 1.04, 1],
        opacity: [0.1, 0.16, 0.1],
      },
      transition: {
        duration: 34,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: 0.6,
      },
    },
  ],
};

export function BackgroundOrnaments({
  variant = "default",
}: {
  variant?: "default" | "minimal" | "minimal-alt";
}) {
  const ornaments = ornamentsByVariant[variant];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {ornaments.map((ornament) => (
        <motion.div
          key={ornament.key}
          className={ornament.className}
          animate={ornament.animate}
          transition={ornament.transition}
        >
          <Image
            src={ornament.src}
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </motion.div>
      ))}

      <motion.div
        className="absolute inset-0 bg-linear-to-b from-transparent via-background/10 to-transparent"
        animate={{ opacity: [0.04, 0.08, 0.04] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
