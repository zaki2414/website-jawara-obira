"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";
import { applyReveal, type RevealKind } from "@/lib/scrollReveal";

type RevealProps = {
  children: ReactNode;
  /**
   * "rise"    — blok teks/heading, naik dari bawah (default)
   * "stagger" — grid kartu; tandai tiap anak dengan data-reveal-item
   * "panel"   — panel besar/banner, mendarat dengan blur tipis
   */
  kind?: RevealKind;
  /** Elemen yang di-render. Default div — pakai "section"/"header" bila semantis. */
  as?: ElementType;
  className?: string;
  start?: string;
  delay?: number;
};

/**
 * Pembungkus scroll-reveal berbasis GSAP ScrollTrigger.
 *
 * Konten di-render TERLIHAT (tidak ada opacity-0 di markup) — GSAP yang
 * memundurkannya ke state awal saat runtime. Jadi kalau JS gagal atau
 * user mengaktifkan prefers-reduced-motion, halaman tetap utuh terbaca.
 * Lihat catatan lengkap di lib/scrollReveal.ts.
 */
export function Reveal({
  children,
  kind = "rise",
  as: Tag = "div",
  className,
  start,
  delay,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return applyReveal(ref.current, { kind, start, delay });
  }, [kind, start, delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
