import type { Variants } from "framer-motion";

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.8 } },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const wordByWord = (index: number) => ({
  opacity: 1,
  y: 0,
  transition: {
    delay: index * 0.1,
    duration: 0.8,
    ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
  },
});

export const floatAnimation = (amplitude = 10, duration = 3) => ({
  y: [0, -amplitude, 0],
  transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
});

export const pulseAnimation = (min = 0.1, max = 0.2, duration = 6) => ({
  scale: [1, 1.2, 1],
  opacity: [min, max, min],
  transition: { duration, repeat: Infinity, ease: "easeInOut" as const },
});