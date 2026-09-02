// components/home/HeroSection.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { AnimatedBadge, Button } from "@/components/ui";
import { wordByWord, floatAnimation } from "@/lib/animations";
import { HERO_WORDS, HERO_CTA_BUTTONS, type Village } from "@/constants/home";

type HeroSectionProps = {
  villages: Village[];
};

export function HeroSection({ villages }: HeroSectionProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Parallax Effects
  const foregroundY = useTransform(scrollY, [0, 500], [0, 120]);
  const foregroundOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);
  const foregroundScale = useTransform(scrollY, [0, 300], [1, 0.96]);
  const backgroundY = useTransform(scrollY, [0, 500], [0, 40]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-natural-paper"
      aria-label="Hero section"
    >
      {/* Background Photo Layer dengan Parallax */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <motion.div
          style={{ y: backgroundY }}
          className="relative w-full h-[115%] top-[-5%] transform-gpu will-change-transform"
        >
          <Image
            src="/Background Hero Home.png"
            alt=""
            fill
            priority
            quality={90}
            className="object-cover object-center lg:object-[80%_center] opacity-90 brightness-100"
            aria-hidden="true"
          />
        </motion.div>

        {/* Gradient Masking Layer */}
        <div className="absolute inset-0 bg-linear-to-b from-natural-paper/40 via-natural-paper/90 to-natural-paper lg:bg-linear-to-r lg:from-natural-paper lg:via-natural-paper/85 lg:to-transparent" />
      </div>

      {/* Decorative Ornaments (Desktop Only) */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute -right-20 top-1/4 w-80 h-80 opacity-85 animate-[spin_35s_linear_infinite]">
          <Image
            src="/Hiasan 2.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
        <div className="absolute -left-20 bottom-1/4 w-72 h-72 opacity-85 animate-[spin_35s_linear_infinite_reverse]">
          <Image
            src="/Hiasan 3.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Main Content Container
        Dinaikkan posisinya menggunakan `-mt-12 sm:-mt-16 md:-mt-20 lg:-mt-28` 
        agar berada di posisi "Optical Center" yang megah.
      */}
      <motion.div
        style={{ y: foregroundY, opacity: foregroundOpacity, scale: foregroundScale }}
        className="relative z-10 max-w-5xl mx-auto px-6 pt-32 pb-20 w-full transform-gpu will-change-transform -mt-12 sm:-mt-16 md:-mt-20 lg:-mt-28"
      >
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          {/* Location Badge */}
          <AnimatedBadge
            label="Pulau Obi • Maluku Utara"
            className="bg-primary/10 text-primary border-2 border-primary/20 backdrop-blur-sm"
          />

          {/* Main Title */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-black text-on-surface leading-[1.1] tracking-tight">
            {HERO_WORDS.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: wordByWord(i),
                }}
                initial="hidden"
                animate="visible"
                className="inline-block mr-4 drop-shadow-sm"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-base md:text-lg text-on-surface max-w-2xl leading-relaxed font-medium"
          >
            Jelajahi kekayaan budaya, biodiversitas, dan kearifan lokal dari{" "}
            <strong className="font-black text-on-surface">
              {villages[0]?.name || "Desa Kawasi"}
            </strong>{" "}
            dan{" "}
            <strong className="font-black text-on-surface">
              {villages[1]?.name || "Desa Soligi"}
            </strong>
            .
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-wrap gap-4 pt-2"
          >
            {HERO_CTA_BUTTONS.map((btn, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  variant={btn.variant}
                  // has-[>svg]:px-7 SENGAJA disamakan dengan px-7 — default
                  // size Button punya has-[>svg]:px-4 bawaan (varian
                  // berbasis selector :has()) yang bisa menang atas px-7
                  // polos tergantung urutan di CSS terkompilasi (bukan
                  // urutan di className); disamakan supaya hasilnya identik
                  // apa pun yang menang, bukan tebak-tebakan spesifisitas.
                  className={`h-auto rounded-full px-7 py-3.5 has-[>svg]:px-7 hard-shadow hard-shadow-hover ${
                    btn.variant === "outline" ? "bg-background" : ""
                  }`}
                >
                  <Link href={btn.href}>
                    <btn.icon className="size-5 group-hover/button:rotate-12 transition-transform duration-200" aria-hidden="true" />
                    {btn.label}
                  </Link>
                </Button>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none hidden md:block"
        animate={floatAnimation(8, 2)}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-label-sm uppercase tracking-widest font-black text-on-primary/80">
            Gulir Kebawah
          </span>
          <svg
            className="w-5 h-5 text-on-primary/80"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}