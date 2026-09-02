// components/home/KKNSection.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Award, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import type { Proker, ProkerDocumentation, KKNStats } from "@/constants/home";

type KKNSectionProps = {
  kknStats: KKNStats;
  featuredProkers: Proker[];
};

// --- HELPER: PARSE JSON FIELD ---
function parseJsonField(value: ProkerDocumentation[] | string | null | undefined): ProkerDocumentation[] {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function KKNSection({
  kknStats,
  featuredProkers,
}: KKNSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const ctaButtons = [
    {
      href: "/kkn/jurnal",
      label: `Jurnal Harian ${kknStats.jurnal > 0 ? `(${kknStats.jurnal})` : ""}`,
      icon: BookOpen,
    },
    {
      href: "/kkn/proker",
      label: `Program Kerja ${kknStats.proker > 0 ? `(${kknStats.proker})` : ""}`,
      icon: Award,
    },
  ];

  // --- ANIMATION VARIANTS (SNAPPY SPRING BLOCKS) ---
  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 140, damping: 14 },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-primary text-on-primary py-32 border-y-4 border-on-surface overflow-hidden"
    >
      {/* 1. SECTION BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        {/* Dot Matrix Mesh Blueprint */}
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(rgba(255,255,255,0.6)_1.5px,transparent_1.5px)] bg-size-[24px_24px]" />

        {/* Abstract Neo-Brutalist Giant Star Accent */}
        <motion.div
          className="absolute -right-20 top-12 w-96 h-96 opacity-[0.05] filter brightness-200"
          animate={{ rotate: -360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <Image
            src="/Hiasan 4.svg"
            alt=""
            fill
            className="object-contain"
            aria-hidden="true"
          />
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* 2. HERO GRID: TEXT CONTENT & VISUAL PLAYGROUND */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          {/* Left Content Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <motion.div
              variants={itemVariants}
              className="inline-block bg-natural-paper text-on-surface border-4 border-on-surface px-6 py-2 font-black text-xs uppercase tracking-widest hard-shadow-sm rounded-full"
              whileHover={{ scale: 1.05, rotate: -1 }}
            >
              Program Pengabdian
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="font-serif text-6xl md:text-7xl font-black leading-tight"
            >
              KKN UGM
              <br />
              <span className="italic text-tertiary font-normal">
                Jawara Obira
              </span>
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg opacity-90 leading-relaxed font-medium max-w-lg"
            >
              Sinergi civitas akademika Universitas Gadjah Mada yang
              mendedikasikan program kerja berbasis digitalisasi spasial,
              inventarisasi alam, dan penguatan komoditas desa.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap gap-4 pt-2"
            >
              {ctaButtons.map((btn, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    asChild
                    variant="outline"
                    className="h-auto rounded-full border-4 bg-natural-paper px-8 py-4 has-[>svg]:px-8 hard-shadow hard-shadow-hover"
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

          {/* Right Visual Column (Floating Stack Cards) — dokumentasi 2
              proker unggulan PERTAMA (bukan file placeholder statis, itu
              sebelumnya nunjuk ke /placeholder-kkn.jpg yang tidak pernah ada
              di public/, jadi selalu broken image). Fallback ikon kalau
              proker itu belum punya foto dokumentasi sama sekali. */}
          <div className="relative h-85 flex items-center justify-center lg:justify-start">
            {[0, 1].map((i) => {
              const proker = featuredProkers[i];
              const docs = proker ? parseJsonField(proker.documentation) : [];
              const thumb = docs[0]?.url || docs[0]?.image_url || proker?.image_url;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9, rotate: i === 0 ? -12 : 12 }}
                  animate={
                    isInView
                      ? {
                          opacity: 1,
                          scale: 1,
                          y: [i * 30, i * 30 - 12, i * 30],
                          rotate: [
                            i === 0 ? -8 : 10,
                            i === 0 ? -5 : 13,
                            i === 0 ? -8 : 10,
                          ],
                        }
                      : {}
                  }
                  transition={{
                    opacity: { duration: 0.6, delay: 0.2 },
                    scale: { duration: 0.6, delay: 0.2 },
                    y: {
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.5,
                    },
                    rotate: {
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: i * 0.2,
                    },
                  }}
                  whileHover={{
                    scale: 1.06,
                    zIndex: 30,
                    rotate: i === 0 ? -3 : 3,
                  }}
                  className="absolute w-72 h-56 bg-natural-paper p-3 rounded-2xl border-4 border-on-surface hard-shadow-md overflow-hidden cursor-pointer"
                  style={{
                    left: `${i * 60 + 40}px`,
                    zIndex: i === 0 ? 10 : 20,
                  }}
                >
                  <div className="relative w-full h-full rounded-xl overflow-hidden border-2 border-on-surface">
                    {thumb ? (
                      <Image
                        src={thumb}
                        alt={proker?.title ? `Dokumentasi ${proker.title}` : `Visual KKN ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-on-surface/5">
                        <Award className="size-12 text-on-surface/20" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Float Floating Badge Counter */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={
                isInView
                  ? {
                      opacity: 1,
                      scale: 1,
                      y: [0, -10, 0],
                      rotate: [4, -4, 4],
                    }
                  : {}
              }
              transition={{
                scale: {
                  type: "spring" as const,
                  stiffness: 160,
                  damping: 12,
                  delay: 0.5,
                },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute right-4 -bottom-4 bg-tertiary text-on-tertiary px-7 py-4 rounded-full border-4 border-on-surface hard-shadow-md z-40 text-center min-w-35"
            >
              <div className="text-3xl font-black font-mono tracking-tight">
                {kknStats.jurnal}
              </div>
              <div className="text-label-sm uppercase tracking-widest font-black opacity-90">
                Jurnal Terbit
              </div>
            </motion.div>
          </div>
        </div>

        {/* 3. FEATURED PROGRAM KERJA SECTION */}
        {featuredProkers.length > 0 && (
          <div className="border-t-4 border-dashed border-on-surface/30 pt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
              <h3 className="font-serif text-4xl md:text-5xl font-black text-on-primary">
                Program Kerja{" "}
                <span className="italic text-tertiary font-normal">
                  Unggulan
                </span>
              </h3>
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  asChild
                  variant="outline"
                  className="h-auto rounded-full border-4 bg-natural-paper px-6 py-3 has-[>svg]:px-6 hard-shadow hard-shadow-hover"
                >
                  <Link href="/kkn/proker">
                    Lihat Semua
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Cards Display Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProkers.map((proker, i) => {
                const docs = parseJsonField(proker.documentation);
                const thumb =
                  docs[0]?.url || docs[0]?.image_url || proker.image_url;
                const metrics = proker.impact_metrics || {};

                return (
                  <motion.div
                    key={proker.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{
                      delay: 0.3 + i * 0.1,
                      type: "spring" as const,
                      stiffness: 120,
                    }}
                    whileHover={{ y: -10 }}
                    className="h-full"
                  >
                    <Link
                      href={`/kkn/proker/${proker.slug}`}
                      className="group block bg-natural-paper text-on-surface rounded-2xl overflow-hidden border-4 border-on-surface h-full hard-shadow hard-shadow-hover transition-all duration-300 relative"
                    >
                      {/* Mix-Blend Ornament inside Card */}
                      <motion.div
                        className="absolute -right-4 -bottom-4 w-28 h-28 opacity-0 mix-blend-multiply pointer-events-none z-0 select-none transition-all duration-500 group-hover:opacity-[0.15] group-hover:scale-110"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <Image
                          src="/Hiasan 4.svg"
                          alt=""
                          fill
                          className="object-contain"
                          aria-hidden="true"
                        />
                      </motion.div>

                      {/* Header Image Frame */}
                      <div className="relative h-48 bg-primary-container/20 overflow-hidden border-on-surface">
                        {thumb ? (
                          <div className="w-full h-full overflow-hidden">
                            <Image
                              src={thumb}
                              alt={proker.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </div>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-on-surface/5">
                            <Award className="size-14 text-on-surface/20" aria-hidden="true" />
                          </div>
                        )}

                        <div className="absolute top-3 left-3 bg-tertiary text-on-tertiary px-4 py-1.5 text-label-sm font-black uppercase tracking-widest rounded-full border-2 border-on-surface hard-shadow-sm">
                          Featured
                        </div>
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6 relative z-10">
                        <h4 className="font-serif text-xl font-black mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                          {proker.title}
                        </h4>
                        <p className="text-sm text-on-surface-variant line-clamp-2 mb-5 font-medium">
                          {proker.short_description}
                        </p>

                        {/* Impact Metrics Badges */}
                        {metrics &&
                          typeof metrics === "object" &&
                          Object.keys(metrics).length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-4 border-t-2 border-dashed border-on-surface/10">
                              {Object.entries(metrics)
                                .filter(
                                  ([k, v]) =>
                                    v && v !== "" && String(k).includes("_num"),
                                )
                                .slice(0, 2)
                                .map(([k, v]) => {
                                  const labelKey = k.replace("_num", "_label");
                                  const label = metrics[labelKey] || k;
                                  return (
                                    <span
                                      key={k}
                                      className="text-label-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-black border-2 border-primary/20"
                                    >
                                      {v} {label}
                                    </span>
                                  );
                                })}
                            </div>
                          )}
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
