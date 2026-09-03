"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import type { StatFormat } from "@/constants/home";

type CounterNumberProps = {
  value: number;
  format: StatFormat;
};

// Nama format -> tampilan. Sengaja di sisi klien (bukan fungsi yang dioper
// sebagai prop dari Server Component) — lihat catatan di constants/home.ts.
function formatStat(value: number, format: StatFormat): string {
  switch (format) {
    case "grouped-plus":
      return `${value.toLocaleString("id-ID")}+`;
    case "plus":
      return `${value}+`;
    default:
      return String(value);
  }
}

/**
 * Odometer angka statistik — satu-satunya "authored moment" di section ini.
 *
 * Nilai akhir dirender langsung sebagai teks awal (bukan "0"), jadi kalau
 * JS gagal atau user minta reduced motion, angkanya tetap benar. Animasi
 * hanya menghitung naik dari 0 saat kartu masuk layar.
 */
export function CounterNumber({ value, format }: CounterNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduced = useReducedMotion();

  // null = belum/tidak beranimasi -> pakai nilai asli. Nilai tampilan
  // DITURUNKAN saat render (bukan disimpan lewat setState di effect),
  // supaya state awal & fallback selalu benar tanpa efek tambahan.
  const [tick, setTick] = useState<number | null>(null);
  const display = formatStat(tick ?? value, format);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setTick(Math.round(latest)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  return (
    <span ref={ref} className="font-serif font-black tabular">
      {display}
    </span>
  );
}
