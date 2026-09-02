// components/home/PotensiBento.tsx
"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { staggerContainer, scaleIn, fadeInUp } from "@/lib/animations";
import { MotionCard } from "@/components/ui";
import { RotatingHiasanBackground } from "@/components/shared/RotatingHiasanBackground";
import { POTENSI_DESA } from "@/constants/home";

const springTransition = {
  type: "spring" as const,
  stiffness: 300,
  damping: 22,
};

export function PotensiBento() {
  return (
    <section className="bg-natural-paper py-24 md:py-32 border-on-surface relative overflow-hidden">
      
      {/* 
        OPTIMASI BACKGROUND BLUR (Akselerasi GPU)
        Menambahkan transform-gpu dan will-change-transform agar transisi tidak delay 
      */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute -top-10 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl opacity-15 transform-gpu will-change-transform animate-[pulse_6s_infinite]"
        />
        <div
          className="absolute bottom-10 right-1/4 w-125 h-125 bg-tertiary rounded-full blur-3xl opacity-15 transform-gpu will-change-transform animate-[pulse_8s_infinite_1s]"
        />

        {/* Hiasan arsip berputar — sebelumnya section ini satu-satunya di
            homepage tanpa elemen Hiasan*.svg (Hero pakai 2/3, Stats pakai 5,
            KKN pakai 4). Percobaan pertama pakai Hiasan 1.svg (stroke abu
            gelap #2E2E2E) di opacity 0.06 nyaris tak kelihatan di atas
            bg-natural-paper yang terang — dipakai komponen bersama
            RotatingHiasanBackground (opacity elegant 0.16-0.22, sudah
            terbukti kelihatan) alih-alih custom motion.div manual. */}
        <RotatingHiasanBackground hiasan={1} density="elegant" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER SECTION */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mb-16 md:mb-20 text-left"
        >
          <motion.div
            className="inline-block bg-primary text-on-primary border-2 border-on-surface px-5 py-1.5 font-black text-xs uppercase tracking-widest mb-6 hard-shadow-sm rounded-full cursor-default select-none"
            whileHover={{ scale: 1.05, y: -2 }}
            transition={springTransition}
          >
            Potensi Desa
          </motion.div>
          
          <h2 className="font-serif text-5xl md:text-7xl font-black text-on-surface leading-tight tracking-tight mb-6">
            Kekayaan <span className="italic text-primary">Pulau Obi</span>
          </h2>
          
          <p className="text-base md:text-lg text-on-surface-variant max-w-2xl font-medium leading-relaxed">
            Dari biodiversitas unik hingga produk kerajinan kreatif, Pulau Obi menyimpan potensi
            luar biasa yang siap untuk dijelajahi.
          </p>
        </motion.div>

        {/* BRUTALIST BENTO GRID ASIMETRIS PERFECT MATCH */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {POTENSI_DESA.map((item, index) => {
            /**
             * Pola Grid Spanning:
             * Baris 1: Index 0 (Span 2) | Index 1 (Span 1) -> Kiri Panjang
             * Baris 2: Index 2 (Span 1) | Index 3 (Span 2) -> Kanan Panjang
             * Baris 3: Index 4 (Span 2) | Index 5 (Span 1) -> Kiri Panjang (Sesuai Request)
             */
            const isLargeCard = index === 0 || index === 3 || index === 4;
            
            return (
              <MotionCard
                key={item.id}
                href={item.href}
                variants={scaleIn}
                className={`group relative flex flex-col justify-between p-6 md:p-8 border-4 rounded-2xl min-h-75 h-full transition-shadow duration-200 hard-shadow-md hard-shadow-hover ${
                  item.color
                } ${item.border} ${
                  isLargeCard ? "md:col-span-2 lg:col-span-2" : "md:col-span-1"
                }`}
              >
                {/* KONTEN ATAS */}
                <div className="space-y-5 relative z-10 w-full">
                  
                  <div className="flex justify-between items-center w-full">
                    <motion.div
                      className={`inline-flex items-center justify-center w-12 h-12 ${item.color} rounded-xl border-2 ${item.border} hard-shadow-sm`}
                      whileHover={{ rotate: 8, scale: 1.1 }}
                      transition={springTransition}
                    >
                      <item.icon className={`w-6 h-6 ${item.accent}`} aria-hidden="true" />
                    </motion.div>
                    
                    <span className={`font-mono text-xs font-black tracking-widest opacity-60 ${item.accent}`}>
                      NO. 0{index + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className={`font-serif text-2xl md:text-3xl font-black tracking-tight ${item.accent}`}>
                      {item.title}
                    </h3>
                    <p className={`${item.accent} text-sm leading-relaxed font-medium opacity-85 max-w-2xl`}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* KONTEN BAWAH */}
                <div className="relative z-10 pt-6 w-full border-t-2 border-dashed border-on-surface/20">
                  <motion.div
                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-background text-on-surface border-2 border-on-surface px-4 py-2 rounded-lg hard-shadow-sm"
                    whileHover={{ x: 4, y: -2 }}
                    transition={{ type: "spring" as const, stiffness: 400, damping: 10 }}
                  >
                    <span>Jelajahi</span>
                    <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1 duration-200" aria-hidden="true" />
                  </motion.div>
                </div>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-on-surface/5 rounded-xl pointer-events-none transition-opacity duration-200" />
              </MotionCard>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}