"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

type AnimatedBackgroundVariant = "orbs" | "orbs-particles" | "scroll-parallax" | "scroll-glow";

type AnimatedBackgroundProps = {
  /**
   * - "orbs": 2 orb gradien statis, tanpa partikel (dekorasi ringan).
   * - "orbs-particles": 3 orb + partikel mengambang (dekorasi ramai, listing page).
   * - "scroll-parallax": orb + partikel yang bergerak mengikuti scroll.
   * - "scroll-glow": satu glow tunggal yang memudar seiring scroll (halaman detail).
   */
  variant?: AnimatedBackgroundVariant;
};

export function AnimatedBackground({ variant = "orbs-particles" }: AnimatedBackgroundProps) {
  if (variant === "scroll-glow") return <ScrollGlowBackground />;
  if (variant === "scroll-parallax") return <ScrollParallaxBackground />;
  if (variant === "orbs") return <OrbsBackground />;
  return <OrbsParticlesBackground />;
}

function OrbsBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], x: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-tl from-tertiary/15 via-tertiary/5 to-transparent rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1], opacity: [0.08, 0.15, 0.08], x: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}

function OrbsParticlesBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        className="absolute top-16 left-8 w-96 h-96 bg-linear-to-br from-primary/25 via-primary/10 to-transparent rounded-full blur-3xl opacity-90"
        animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18], x: [0, 40, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-12 right-10 w-80 h-80 bg-linear-to-tl from-tertiary/25 via-tertiary/10 to-transparent rounded-full blur-3xl opacity-88"
        animate={{ scale: [1, 1.14, 1], opacity: [0.15, 0.28, 0.15], x: [0, -38, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 right-1/3 w-72 h-72 bg-linear-to-br from-secondary/18 via-transparent to-transparent rounded-full blur-3xl opacity-70"
        animate={{ y: [0, -30, 0], opacity: [0.12, 0.22, 0.12], scale: [1, 1.08, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />

      {mounted &&
        Array.from({ length: 11 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? "bg-primary/35" : "bg-tertiary/35"}`}
            style={{ left: `${(i * 11 + 5) % 100}%`, top: `${(i * 19 + 9) % 100}%` }}
            animate={{ y: [0, -42, 0], opacity: [0.2, 0.75, 0.2], scale: [1, 1.35, 1] }}
            transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: (i % 3) * 0.4 }}
          />
        ))}
    </div>
  );
}

function ScrollParallaxBackground() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const rotate1 = useTransform(scrollY, [0, 1000], [0, 180]);
  const rotate2 = useTransform(scrollY, [0, 1000], [0, -180]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        style={{ y: y1, rotate: rotate1 }}
        className="absolute top-10 left-1/4 w-96 h-96 bg-linear-to-br from-primary via-primary/50 to-transparent rounded-full blur-3xl opacity-20"
      />
      <motion.div
        style={{ y: y2, rotate: rotate2 }}
        className="absolute bottom-10 right-1/4 w-125 h-125 bg-linear-to-tl from-tertiary via-tertiary/50 to-transparent rounded-full blur-3xl opacity-20"
      />

      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          style={{ left: `${(i * 17 + 10) % 100}%`, top: `${(i * 23 + 15) % 100}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
          transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: (i % 3) * 0.5 }}
        />
      ))}
    </div>
  );
}

function ScrollGlowBackground() {
  const { scrollYProgress } = useScroll();
  const glowY = useTransform(scrollYProgress, [0, 1], ["-10%", "30%"]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.25, 0.1]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      <motion.div
        style={{ y: glowY, opacity: glowOpacity }}
        className="absolute left-1/2 top-0 -translate-x-1/2 w-240 h-240 rounded-full bg-primary/10 blur-[120px]"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(29,28,24,0.05)_100%)]" />
    </div>
  );
}
