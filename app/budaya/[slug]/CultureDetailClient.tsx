"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import { ArrowLeft, Compass } from "lucide-react";
import {
  DETAIL_CONTENT,
  getCategoryAccent,
  CATEGORY_ACCENT_STYLES,
  type CultureItem,
  type ExtraImage,
} from "@/constants/budaya";
import { HeroBanner, ArticleHeader, ProseContent, DetailOrnaments } from "@/components/budaya";
import { BackgroundOrnaments } from "@/components/shared/BackgroundOrnaments";
import { EntityGallerySection } from "@/components/shared/EntityGallerySection";

type CultureDetailClientProps = {
  culture: CultureItem;
  extraImages: ExtraImage[];
};

export default function CultureDetailClient({
  culture,
  extraImages,
}: CultureDetailClientProps) {
  const containerRef = useRef<HTMLElement>(null); // ← REF UNTUK PARALLAX
  const hasExtraImages = extraImages.length > 0;
  const shouldReduceMotion = useReducedMotion();
  const accent = getCategoryAccent(culture.category);
  const accentStyles = CATEGORY_ACCENT_STYLES[accent];

  // Scroll tracking untuk animasi sinematik konten
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 25,
    restDelta: 0.001,
  });

  // Parallax untuk konten utama
  const heroY = useTransform(smoothProgress, [0, 0.4], [0, -40]);
  const heroScale = useTransform(smoothProgress, [0, 0.4], [1, 0.97]);
  const heroBlur = useTransform(
    smoothProgress,
    [0, 0.4],
    ["blur(0px)", "blur(3px)"],
  );

  const textContentY = useTransform(smoothProgress, [0, 0.5], [0, -20]);

  return (
    <motion.article
      ref={containerRef}
      className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen overflow-hidden selection:bg-primary/20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* ─── BRAND IDENTITY CANVAS LAYER (IMAGE BACKGROUND) ─── */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 mix-blend-multiply select-none">
        <Image
          src="/Background Hero Culture.JPG"
          alt=""
          aria-hidden="true"
          fill
          className="object-cover object-center filter grayscale contrast-125 brightness-110"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/90 via-background/95 to-background" />
      </div>

      {/* ─── PROGRESS BAR (di bawah Navbar sticky h-20 agar tidak bertabrakan) ─── */}
      <div className="fixed top-20 left-0 right-0 h-1.5 bg-on-surface/10 z-40 overflow-hidden">
        <motion.div
          className="h-full bg-linear-to-r from-primary via-tertiary to-primary origin-left"
          style={{ scaleX: smoothProgress }}
        />
      </div>

      {/* ═══════════════════════════════════════════ */}
      {/* ✨ HIASAN SVG - PARALLAX ORNAMENTS ✨ */}
      {/* ═══════════════════════════════════════════ */}
      <DetailOrnaments containerRef={containerRef} />
      {/* Ornamen berputar kontinu — DetailOrnaments di atas cuma scroll-tied
          (statis di mobile), jadi tambahkan lapisan spin independen supaya
          halaman ini tetap punya Hiasan svg yang benar-benar berputar. */}
      <BackgroundOrnaments variant="minimal" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        {/* ─── TOP NAVIGATION ROW ─── */}
        <div className="flex items-center justify-between mb-10 border-b border-dashed border-on-surface/10 pb-4">
          <Link
            href="/budaya"
            className="inline-flex items-center gap-2 text-sm font-black text-on-surface-variant hover:text-primary transition-colors group uppercase tracking-wider rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <motion.span
              animate={shouldReduceMotion ? {} : { x: [0, -4, 0] }}
              transition={{ duration: 1.5, repeat: shouldReduceMotion ? 0 : Infinity }}
              className="inline-flex"
            >
              <ArrowLeft className="w-4 h-4 text-primary" />
            </motion.span>
            {DETAIL_CONTENT.backLabel}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`hidden md:inline-flex items-center gap-3 text-label-sm font-black text-on-surface bg-background border-2 border-on-surface px-5 py-2 rounded-xl uppercase tracking-widest hard-shadow-sm ${accentStyles.hoverBadge} transition-colors duration-300`}
          >
            <Compass className="w-4 h-4 text-tertiary" />
            <span>Dokumentasi Spasial</span>
          </motion.div>
        </div>

        {/* ─── HERO AREA: PARALLAX ─── */}
        {culture.thumbnail_url && (
          <motion.div
            style={{ y: heroY, scale: heroScale, filter: heroBlur }}
            className="w-full mb-16 origin-top"
          >
            <HeroBanner
              imageUrl={culture.thumbnail_url}
              title={culture.title}
              category={culture.category}
            />
          </motion.div>
        )}

        {/* ─── MAIN CONTENT — satu kolom di semua breakpoint, sama dengan pola
            UMKM/Fauna (dulu ada 2 pohon JSX terpisah mobile vs desktop di sini,
            plus galeri di sidebar desktop yang cuma sanggup nampilin 2 foto
            pertama — sisanya kebuang diam-diam). Galeri sekarang di bawah
            konten lewat EntityGallerySection standar (border-cream, masonry,
            lightbox), sama seperti UMKM/Fauna/KKN. ─── */}
        <motion.div style={{ y: textContentY }} className="max-w-3xl mx-auto mt-6 space-y-8">
          <ArticleHeader culture={culture} />

          <motion.div
            className="pt-4 border-t-2 border-dashed border-on-surface/10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <ProseContent content={culture.content ?? ""} />
          </motion.div>

          {hasExtraImages && (
            <div className="pt-8 border-t-2 border-dashed border-on-surface/10">
              <EntityGallerySection
                images={extraImages.map((img) => ({ url: img.url, caption: img.caption }))}
                title="Dokumentasi"
                entityName={culture.title}
                borderColorClass="border-cream"
              />
            </div>
          )}
        </motion.div>
      </div>
    </motion.article>
  );
}
