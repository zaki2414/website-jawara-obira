"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  UMKMDetailOrnaments,
  HeroBanner,
  ProfileSection,
  ProductsSection,
  GallerySection,
  FeaturesSidebar,
  MapInfoPanel,
} from "@/components/umkm/detail";
import {
  getBusinessAccent,
  type UMKM,
  type GroupedProducts,
} from "@/constants/umkm";
import { AnimatedBackground } from "@/components/shared/AnimatedBackground";

type UMKMDetailClientProps = {
  // page.tsx menormalisasi `umkm.features` (raw DB field) jadi string[] sebelum dikirim ke sini.
  umkm: UMKM & { features: string[] };
  productsByCategory: GroupedProducts;
};

export default function UMKMDetailClient({
  umkm,
  productsByCategory,
}: UMKMDetailClientProps) {
  const shouldReduceMotion = useReducedMotion();
  const accent = getBusinessAccent(umkm.business_type);

  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen overflow-hidden"
    >
      <AnimatedBackground />
      <UMKMDetailOrnaments />

      <div className="relative max-w-7xl mx-auto px-6 space-y-12 z-10">
        {/* Back Button */}
        <Link
          href="/umkm"
          className="inline-flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group"
        >
          <motion.span
            animate={shouldReduceMotion ? {} : { x: [0, -4, 0] }}
            transition={{ duration: 1.5, repeat: shouldReduceMotion ? 0 : Infinity }}
            className="inline-flex"
          >
            <ArrowLeft className="w-4 h-4" />
          </motion.span>
          Kembali
        </Link>

        <HeroBanner umkm={umkm} />

        <div className="grid md:grid-cols-3 gap-10 items-start">
          {/* Left column */}
          <div className="md:col-span-2 space-y-10">
            {umkm.full_description && (
              <ProfileSection description={umkm.full_description} accent={accent} />
            )}

            {Object.keys(productsByCategory).length > 0 && (
              <ProductsSection productsByCategory={productsByCategory} accent={accent} />
            )}

            {umkm.gallery && umkm.gallery.length > 0 && (
              <GallerySection gallery={umkm.gallery} />
            )}
          </div>

          {/* Right sidebar — dibingkai panel bertinta warna jenis usaha */}
          <div
            className={`space-y-6 md:sticky md:top-24 rounded-3xl pb-4`}
          >
            {umkm.features && umkm.features.length > 0 && (
              <FeaturesSidebar features={umkm.features} accent={accent} />
            )}
            <MapInfoPanel
              locationText={umkm.location_text}
              blok={umkm.blok}
              latitude={umkm.latitude}
              longitude={umkm.longitude}
              accent={accent}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}
