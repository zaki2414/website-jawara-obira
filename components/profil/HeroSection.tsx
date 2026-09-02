"use client";

import { useInView } from "react-intersection-observer";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Landmark } from "lucide-react";
import { AtlasBackground } from "./AtlasBackground";
import { titleVariants } from "@/constants/profil";

export function HeroSection() {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  const { scrollY } = useScroll();
  const rotateCompass = useTransform(scrollY, [0, 1000], [0, 360]);

  return (
    <section
      ref={ref}
      className="relative bg-primary border-b-4 border-on-surface min-h-[50vh] flex items-center overflow-hidden"
    >
      <AtlasBackground />

      <div className="relative max-w-7xl mx-auto px-6 py-24 z-10 w-full">
        {/* ========================= */}
        {/* COMPASS ROSE PARALLAX */}
        {/* ========================= */}
        <motion.div
          style={{ rotate: rotateCompass }}
          className="absolute rotate-20 -bottom-10 -right-10 sm:right-12 md:right-24 sm:top-1/2 sm:-translate-y-1/2 w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 border-4 border-dashed border-on-primary/20 rounded-full flex items-center justify-center pointer-events-none select-none z-0"
          aria-hidden="true"
        >
          {/* Hiasan 4.svg sebagai kompas dengan transparansi halus */}
          <div className="relative w-30% h-30% opacity-30 p-6 sm:p-8">
            <Image
              src="/Hiasan 4.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>

          {/* Huruf N (Utara) - Di luar lingkaran atas */}
          <div className="absolute -top-3 font-sans font-black text-sm sm:text-base text-on-primary/40 tracking-widest">
            N
          </div>

          {/* Huruf S (Selatan) - Di luar lingkaran bawah */}
          <div className="absolute -bottom-3 font-sans font-black text-sm sm:text-base text-on-primary/40 tracking-widest">
            S
          </div>

          {/* Huruf E (Timur) - Di luar lingkaran kanan */}
          <div className="absolute -right-3 font-sans font-black text-sm sm:text-base text-on-primary/40 tracking-widest">
            E
          </div>

          {/* Huruf W (Barat) - Di luar lingkaran kiri */}
          <div className="absolute -left-3 font-sans font-black text-sm sm:text-base text-on-primary/40 tracking-widest">
            W
          </div>
        </motion.div>
        {/* ========================= */}

        {/* Badge + Title + Description Container */}
        <div className="space-y-6 mb-12 relative z-10">
          {/* Badge Kadaster Digital */}
          <motion.div
            custom={0}
            variants={titleVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="flex items-center gap-3 bg-background border-2 border-on-surface px-4 py-1 rounded-full w-fit hard-shadow-sm"
          >
            <Landmark className="w-5 h-5 text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-on-surface">
              Kadaster Digital
            </span>
          </motion.div>

          {/* Title Line 1: Peta Administrasi */}
          <motion.h1
            custom={1}
            variants={titleVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="font-serif text-6xl md:text-8xl font-black text-on-primary leading-none tracking-tighter"
          >
            Peta Administrasi <br />
          </motion.h1>

          {/* Title Line 2: Desa Kawasi dan Soligi (italic accent) */}
          <motion.h1
            custom={2}
            variants={titleVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
            className="font-serif text-4xl md:text-6xl font-black text-tertiary italic leading-none tracking-tighter"
          >
            Desa Kawasi dan Soligi.
          </motion.h1>
        </div>

        {/* Description dengan border kiri accent */}
        <motion.p
          custom={3}
          variants={titleVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative z-10 text-on-primary/90 max-w-2xl text-lg md:text-xl font-medium leading-relaxed mb-12 border-l-4 border-tertiary/50 pl-6"
        >
          Eksplorasi Spasial Pulau Obi Biodiversitas, Budaya, & Bentang Alam Maluku Utara. Menghubungkan ekosistem hutan tropis Desa Soligi dan kawasan pesisir Desa Kawasi secara visual.
        </motion.p>
      </div>
    </section>
  );
}