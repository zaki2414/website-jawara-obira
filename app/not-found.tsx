"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { motion, type Variants } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

// ==========================================
// ANIMATED BACKGROUND WITH SVG PARTICLES
// ==========================================

function AnimatedErrorBackground() {
  // Posisi partikel di-generate sekali (useMemo, bukan di render body langsung) supaya
  // tidak acak ulang setiap re-render dan tidak memicu hydration mismatch.
  const particles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const size = 16 + Math.floor(Math.random() * 24);
        return {
          id: i,
          size,
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          duration: 4 + Math.random() * 4,
          delay: Math.random() * 2,
        };
      }),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-linear-to-br from-red-200 via-red-100 to-transparent rounded-full blur-3xl opacity-20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-linear-to-tl from-orange-200 via-orange-100 to-transparent rounded-full blur-3xl opacity-15"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      {/* Floating SVG Particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute opacity-35 select-none"
          style={{
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -40, 0],
            rotate: [0, 180, 360],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        >
          <Image
            src="/Hiasan 5.svg"
            alt=""
            width={p.size}
            height={p.size}
            className="object-contain"
            aria-hidden="true"
          />
        </motion.div>
      ))}
    </div>
  );
}

// ==========================================
// ANIMATED 404 NUMBER
// ==========================================

function AnimatedErrorNumber() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const digitVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: 90 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
  };

  const digits = ["4", "0", "4"];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex justify-center mb-6"
    >
      {digits.map((digit, i) => (
        <motion.div
          key={i}
          variants={digitVariants}
          whileHover={{
            scale: 1.15,
            rotateZ: [0, -5, 5, 0],
            transition: { duration: 0.4 },
          }}
          className="relative"
        >
          <div className="text-4xl md:text-5xl font-black text-on-surface font-serif">
            {digit}
          </div>

          {/* Glow effect behind number */}
          <motion.div
            className="absolute inset-0 blur-2xl bg-red-400/30 rounded-full -z-10"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}

// ==========================================
// FLOATING CENTER ICON WITH SVG DECORATION
// ==========================================

function FloatingErrorIcon() {
  return (
    <motion.div
      className="inline-flex p-4 bg-linear-to-br from-red-500 to-red-600 text-white border-4 border-on-surface rounded-2xl hard-shadow-sm mx-auto mb-6 relative"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
      transition={{
        duration: 0.8,
        delay: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      }}
      whileHover={{
        scale: 1.05,
        boxShadow: "0 20px 40px rgba(239, 68, 68, 0.25)",
      }}
    >
      {/* Mengganti icon Lucide dengan putaran Hiasan 5.svg sebagai pusat perhatian */}
      <motion.div
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        className="w-12 h-12 relative flex items-center justify-center"
      >
        <Image
          src="/Hiasan 5.svg"
          alt=""
          width={48}
          height={48}
          className="invert brightness-250"
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}

// ==========================================
// MAIN 404 PAGE COMPONENT
// ==========================================

export default function NotFound() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen flex items-center justify-center border-b-2 bg-aged-paper px-4 py-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedErrorBackground />

      {/* Main Error Box */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-background border-4 border-on-surface p-6 md:p-8 rounded-2xl hard-shadow-lg text-center max-w-sm w-full space-y-5 relative z-10"
      >
        {/* Animated 404 Number */}
        <AnimatedErrorNumber />

        {/* Floating Icon */}
        <FloatingErrorIcon />

        {/* Error Badge with animation */}
        <motion.div variants={itemVariants} className="space-y-3">
          {/* Main Heading */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-3xl md:text-4xl font-black text-on-surface tracking-tight leading-tight"
          >
            Halaman Tidak Ada
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm font-medium text-on-surface-variant leading-relaxed px-2"
          >
            Arsip atau lembaran informasi yang Anda cari mungkin telah
            dipindahkan, dihapus, atau belum diterbitkan dalam pangkalan data
            sistem Jawara Obira.
          </motion.p>
        </motion.div>

        {/* CTA Button with advanced animation */}
        <motion.div variants={itemVariants} className="pt-2">
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-background bg-linear-to-r from-on-surface to-on-surface/90 border-2 border-on-surface px-6 py-3.5 rounded-xl hard-shadow-sm hover:hard-shadow-lg transition-all duration-200 w-full group"
            >
              <motion.div
                animate={{ x: [-4, 0, -4] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              </motion.div>
              Kembali ke Beranda
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Floating Corner SVG Elements (Fixed dimensions configuration) */}
      <motion.div
        className="absolute top-5 -right-12 opacity-35 pointer-events-none select-none z-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        <Image
          src="/Hiasan 5.svg"
          alt=""
          width={192}
          height={192}
          className="object-contain"
          aria-hidden="true"
        />
      </motion.div>

      <motion.div
        className="absolute -bottom-16 -left-16 opacity-35 pointer-events-none select-none z-0"
        animate={{ rotate: -360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <Image
          src="/Hiasan 5.svg"
          alt=""
          width={256}
          height={256}
          className="object-contain"
          aria-hidden="true"
        />
      </motion.div>
    </motion.div>
  );
}