"use client";

import { motion } from "framer-motion";
import {
  UMKMHeader,
  UMKMSearchForm,
  UMKMGrid,
  UMKMEmptyState,
} from "@/components/umkm";
import { RotatingHiasanBackground } from "@/components/shared/RotatingHiasanBackground";
import type { UMKMItem } from "@/constants/umkm";

type UMKMContentProps = {
  items: UMKMItem[];
  initialQ?: string;
  initialType?: string;
  businessTypeCounts: Record<string, number>;
};

export default function UMKMContent({
  items,
  initialQ,
  initialType,
  businessTypeCounts,
}: UMKMContentProps) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      {/* Hero full-bleed dipisah dari section kertas di bawah supaya ada
          irama gantian warna/kertas seperti home & profil. */}
      <UMKMHeader businessTypeCounts={businessTypeCounts} />

      <section className="relative bg-linear-to-b from-tertiary-container/20 via-background to-background py-10 md:py-16 px-4 sm:px-6 md:px-8 border-b-4 border-on-surface min-h-screen overflow-hidden">
        {/* Hiasan 4.svg (fill putih) nyaris tak kelihatan di atas section
            yang dasarnya terang (bg-background/tertiary-container tipis) —
            putih di atas terang = nyaris invisible. Hiasan 1.svg (stroke abu
            gelap #2E2E2E) kontras jelas di kertas terang, dan beda dari
            Hiasan 2 yang sudah dipakai UMKMHeader supaya hero & isi halaman
            tetap terasa bervariasi. */}
        <RotatingHiasanBackground hiasan={1} density="elegant" />

        <div className="relative max-w-7xl mx-auto z-10 space-y-6">
          <UMKMSearchForm initialQ={initialQ} initialType={initialType} />

          {items && items.length > 0 ? (
            <UMKMGrid
              items={items}
              isBento={!initialQ && (!initialType || initialType === "all")}
            />
          ) : (
            <UMKMEmptyState />
          )}
        </div>
      </section>
    </motion.div>
  );
}