// components/home/StatsSection.tsx
"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, animate, useInView } from "framer-motion";
import Image from "next/image";
import { STATS_CARDS, type HomeStats } from "@/constants/home";

type StatsSectionProps = {
  stats: HomeStats;
};

// --- SUB-KOMPONEN: ANIMASI ANGKA MENGHITUNG (ODOMETER EFFECT) ---
function CounterNumber({ value, formatter }: { value: number; formatter: (val: number) => string }) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const isInView = useInView(elementRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(motionValue, value, {
        duration: 2.2,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          if (elementRef.current) {
            elementRef.current.textContent = formatter(Math.round(latest));
          }
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, motionValue, formatter]);

  return <span ref={elementRef} className="font-serif font-black">0</span>;
}

// --- POSISI ORNAMEN FIXED PER CARD (Bervariasi berdasarkan index) ---
const ORNAMENT_POSITIONS = [
  { position: "top-right",    className: "top-40 right-40 rotate-12" },
  { position: "bottom-right", className: "-bottom-4 -right-4 -rotate-12" },
  { position: "bottom-left",  className: "-bottom-4 -left-4 rotate-[200deg]" },
  { position: "top-left",     className: "-top-4 -left-4 -rotate-[200deg]" },
] as const;

// --- KOMPONEN UTAMA ---
export function StatsSection({ stats }: StatsSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isContainerInView = useInView(containerRef, { once: true, margin: "-100px" });

  const cardContainerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95, rotate: -1.5 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring" as const, stiffness: 150, damping: 15 }
    }
  };

  return (
    <section 
      ref={containerRef}
      className="relative bg-primary text-on-primary py-24 overflow-hidden border-y-4 border-on-surface"
    >
      {/* BACKGROUND UTAMA: Dot matrix minimalis */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(rgba(255,255,255,0.6)_1.5px,transparent_1.5px)] bg-size[24px_24px]" />
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <motion.div 
          variants={cardContainerVariants}
          initial="hidden"
          animate={isContainerInView ? "visible" : "hidden"}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {STATS_CARDS.map((card, i) => {
            // stats sekarang SELALU angka mentah (HomeStats numeric, lihat
            // constants/home.ts) — sebelumnya di sini ada `Number(...) || 0`
            // yang justru BUG kalau stats masih string berformat ("1,200+"
            // dsb): Number("1,200+") = NaN, fallback ke 0, jadi counter
            // "Penduduk"/"UMKM Aktif" selalu nampilin 0 walau datanya ada.
            const rawValue = stats[card.key as keyof HomeStats];
            const ornamentPos = ORNAMENT_POSITIONS[i % ORNAMENT_POSITIONS.length];

            return (
              <motion.div
                key={i}
                variants={cardVariants}
                whileHover={{ 
                  scale: 1.05, 
                  y: -10, 
                  rotate: i % 2 === 0 ? 2 : -2,
                  boxShadow: "0px 20px 0px 0px var(--color-on-surface, #000)" 
                }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-natural-paper text-on-surface p-8 rounded-2xl border-4 border-on-surface hard-shadow hard-shadow-hover transition-all duration-200 flex flex-col justify-between items-start min-h-55 group overflow-hidden"
              >
                {/* ================= FIXED ORNAMENT DECORATION ================= */}
                {/* 
                  Ornamen Hiasan 4.svg dengan posisi FIXED per card:
                  - Card 0: top-right (rotate 12deg)
                  - Card 1: bottom-right (rotate -12deg)
                  - Card 2: bottom-left (rotate 200deg)
                  - Card 3: top-left (rotate -200deg)
                  
                  Menggunakan mix-blend-multiply agar menyatu dengan warna kertas (bg-natural-paper).
                  TIDAK ADA animasi rotasi/scale - posisi 100% statis dan tetap.
                */}
                <div 
                  className={`absolute w-36 h-36 opacity-100 pointer-events-none z-0 select-none ${ornamentPos.className}`}
                  aria-hidden="true"
                >
                  <Image
                    src="/Hiasan 5.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                {/* ============================================================= */}

                {/* Bagian Atas Kartu: Ikon */}
                <div className="flex justify-between items-center w-full relative z-10">
                  <motion.div 
                    className="inline-flex items-center justify-center w-14 h-14 bg-tertiary text-on-tertiary border-2 border-on-surface rounded-xl hard-shadow-sm transition-transform duration-200"
                    whileHover={{ rotate: [-5, 5, -5, 0] }}
                  >
                    <card.icon className="w-7 h-7" aria-hidden="true" />
                  </motion.div>
                </div>

                {/* Bagian Bawah Kartu: Angka Odometer & Label Deskripsi */}
                <div className="space-y-1 mt-8 w-full relative z-10">
                  <div className="text-4xl md:text-5xl font-black text-on-surface font-serif tracking-tight flex items-baseline">
                    <CounterNumber 
                      value={rawValue} 
                      formatter={card.formatter} 
                    />
                  </div>
                  <div className="text-xs uppercase tracking-widest font-black text-on-surface-variant font-sans pt-1">
                    {card.label}
                  </div>
                </div>

                {/* Aksen pemanis garis brutalist pojok kanan bawah */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-primary/5 transition-colors group-hover:bg-primary/10 pointer-events-none rounded-tl-xl border-t-2 border-l-2 border-dashed border-on-surface/10" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}