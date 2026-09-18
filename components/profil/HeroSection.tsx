"use client";

import { useInView } from "react-intersection-observer";
import { motion } from "framer-motion";
import { Landmark } from "lucide-react";
import { AtlasBackground } from "./AtlasBackground";
import { CompassRose } from "./CompassRose";
import { titleVariants } from "@/constants/profil";

export function HeroSection() {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="relative bg-primary border-b-4 border-on-surface min-h-[50vh] flex items-center overflow-hidden"
    >
      <AtlasBackground />
      {/* Kompas: cincin & mata angin diam, ornamennya berputar saat digulir. */}
      <CompassRose />

      <div className="relative max-w-7xl mx-auto px-6 py-24 z-10 w-full">
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
          /* Batang aksen tebal di sisi kiri paragraf ini sudah dihapus: itu
             pola callout generik yang tidak dipakai di bagian lain situs ini,
             dan di sini ia menandai paragraf biasa — bukan kutipan atau
             peringatan — sehingga menjanjikan penekanan yang tidak ada isinya.
             Hierarki paragraf ini sudah cukup dibawa ukuran & warnanya. */
          className="relative z-10 text-on-primary/90 max-w-[58ch] text-lg md:text-xl font-medium leading-relaxed mb-12"
        >
          Eksplorasi Spasial Pulau Obi Biodiversitas, Budaya, & Bentang Alam Maluku Utara. Menghubungkan ekosistem hutan tropis Desa Soligi dan kawasan pesisir Desa Kawasi secara visual.
        </motion.p>
      </div>
    </section>
  );
}