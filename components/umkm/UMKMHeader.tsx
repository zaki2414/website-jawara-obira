"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  UMKM_CONTENT,
  UMKM_ICONS,
  UMKM_BUSINESS_TYPES,
  getBusinessAccent,
  BUSINESS_ACCENT_STYLES,
  formatBusinessType,
} from "@/constants/umkm";

type UMKMHeaderProps = {
  businessTypeCounts: Record<string, number>;
};

// Section backdrop full-bleed — solid bg-primary (BUKAN gradasi tipis),
// beda per halaman (Budaya=tertiary, Fauna=primary-container, Toga=tertiary-
// container) supaya tiap halaman kerasa beda "kombinasi warna"-nya, bukan
// cuma variasi opacity dari satu resep yang sama. Kotak-kotak hard-shadow
// (rounded-3xl/rounded-2xl + border-4) tetap dipertahankan bentuk aslinya,
// mengambang di atas latar solid itu.
export function UMKMHeader({ businessTypeCounts }: UMKMHeaderProps) {
  const shouldReduceMotion = useReducedMotion();
  const { Store } = UMKM_ICONS;

  const entries = Object.entries(businessTypeCounts).filter(([, c]) => c > 0);
  const total = entries.reduce((sum, [, c]) => sum + c, 0);
  const typesRepresented = entries.length;
  const topType = entries.sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <section className="relative w-full border-b-4 border-on-surface overflow-hidden bg-primary py-12 md:py-16 px-4 sm:px-6 md:px-8">
      {/* Dot-matrix putih (bukan gelap) — bg-primary cukup pekat sehingga
          titik gelap tenggelam, pola sama dengan StatsSection.tsx (home). */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(rgba(255,255,255,0.9)_1.5px,transparent_1.5px)] bg-size-[24px_24px]" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10 space-y-4">
        {/* ─── PANEL JUDUL (kertas arsip, selalu tampil — bukan inView-gated) ─── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative text-center p-8 md:p-12 border-4 border-on-surface rounded-3xl overflow-hidden bg-background hard-shadow group select-none"
        >
          <div className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-multiply select-none">
            <Image
              src="/Background Hero Culture.JPG"
              alt=""
              aria-hidden="true"
              fill
              className="object-cover object-center filter grayscale contrast-125 brightness-110"
              priority
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-background/70 via-background/90 to-background" />
          </div>

          {/* Watermark — Hiasan 5.svg (fill #E6D2B1, SAMA dengan token cream)
              di atas panel bg-background (#fef9f2, nyaris cream juga) jadi
              nyaris tak kelihatan di opacity berapa pun. Ganti Hiasan 2.svg
              (stroke #006689/primary) — sama seperti dipakai HeroSection.tsx
              home, sudah terbukti kontras jelas di atas kertas terang. */}
          <div className="absolute -right-12 -bottom-12 w-52 h-52 opacity-[0.14] pointer-events-none transition-transform duration-1000 ease-out group-hover:rotate-45 group-hover:scale-110 z-10">
            <Image src="/Hiasan 2.svg" alt="" aria-hidden="true" fill className="object-contain" />
          </div>

          <div className="relative z-20 space-y-5">
            <motion.div
              style={{
                backgroundImage: "url('/Background Hero Culture.JPG')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="relative inline-flex items-center gap-3 border-2 border-on-surface px-5 py-2 rounded-full hard-shadow-sm overflow-hidden w-fit mx-auto"
            >
              <div className="absolute inset-0 bg-background/85 backdrop-blur-xs z-0" />
              <motion.div
                className="relative z-10"
                animate={shouldReduceMotion ? {} : { rotate: 360 }}
                transition={{ duration: 25, repeat: shouldReduceMotion ? 0 : Infinity, ease: "linear" as const }}
              >
                <Store className="w-5 h-5 text-primary" />
              </motion.div>
              <span className="text-label-sm font-black tracking-widest uppercase text-on-surface relative z-10">
                {UMKM_CONTENT.eyebrow}
              </span>
            </motion.div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-on-surface leading-tight tracking-tight max-w-4xl mx-auto">
              {UMKM_CONTENT.title.main}{" "}
              <br className="sm:hidden" />
              <span className="relative inline-block italic text-primary underline decoration-wavy decoration-tertiary decoration-2 underline-offset-8 px-2">
                {UMKM_CONTENT.title.italic}
              </span>
            </h1>

            <div className="relative py-1 flex justify-center">
              <div
                className="h-1.5 bg-linear-to-r from-primary via-tertiary to-transparent rounded-full border-b border-on-surface/20 w-full"
                style={{ maxWidth: "260px" }}
              />
            </div>

            <p className="text-on-surface-variant text-base md:text-lg max-w-3xl mx-auto leading-relaxed font-medium">
              {UMKM_CONTENT.description}
            </p>
          </div>
        </motion.div>

        {/* ─── STATS RAIL — 3 blok warna solid (primary/tertiary/cream), anti-monoton ─── */}
        {total > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4"
          >
            <div className="relative overflow-hidden bg-primary text-on-primary border-4 border-on-surface rounded-2xl p-5 hard-shadow flex items-center gap-4">
              {/* Ornamen sudut kedua — Hiasan berbeda dari panel judul supaya bervariasi,
                  di atas warna solid primary sehingga tetap jelas terlihat. */}
              <div className="absolute -right-6 -bottom-6 w-24 h-24 opacity-[0.18] pointer-events-none z-0">
                <Image src="/Hiasan 4.svg" alt="" aria-hidden="true" fill className="object-contain" />
              </div>
              <span className="relative z-10 font-serif text-4xl font-black leading-none">{total}</span>
              <span className="relative z-10 text-label-sm font-black uppercase tracking-wide leading-tight text-on-primary/85">
                {UMKM_CONTENT.statsTotalLabel}
              </span>
            </div>

            <div className="bg-tertiary text-on-tertiary border-4 border-on-surface rounded-2xl p-5 hard-shadow flex items-center gap-4">
              <span className="font-serif text-4xl font-black leading-none">{typesRepresented}</span>
              <span className="text-label-sm font-black uppercase tracking-wide leading-tight text-on-tertiary/85">
                {UMKM_CONTENT.statsTypesLabel}
              </span>
            </div>

            <div className="bg-cream text-on-surface border-4 border-on-surface rounded-2xl p-5 hard-shadow flex items-center gap-4">
              {topType && (
                <>
                  <span
                    className={`w-3 h-3 rounded-full shrink-0 ${BUSINESS_ACCENT_STYLES[getBusinessAccent(topType)].chipDot}`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-label-sm font-black uppercase tracking-wide text-on-surface/70">
                      {UMKM_CONTENT.statsTopTypeLabel}
                    </p>
                    <p className="font-serif text-lg font-black truncate">
                      {UMKM_BUSINESS_TYPES.find((t) => t.value === topType)?.label ??
                        formatBusinessType(topType)}
                    </p>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
