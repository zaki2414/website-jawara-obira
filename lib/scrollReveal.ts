// lib/scrollReveal.ts
"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

/** ScrollTrigger hanya boleh diregistrasi sekali per sesi browser. */
export function registerScrollTrigger() {
  if (registered || typeof window === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export type RevealKind = "rise" | "stagger" | "panel";

type RevealOptions = {
  kind?: RevealKind;
  /** Selector anak untuk kind "stagger". Default: [data-reveal-item]. */
  itemSelector?: string;
  /** Geser titik mulai. Default "top 82%" — elemen mulai saat 18% masuk layar. */
  start?: string;
  delay?: number;
};

// Satu bahasa gerak untuk SELURUH situs, bukan entrance berbeda per komponen.
//
// Kenapa gsap.from() dan BUKAN gsap.fromTo()/CSS opacity:0 di markup:
// from() membaca posisi akhir dari DOM yang SUDAH terlihat, lalu memundurkan
// elemen ke state awal saat runtime. Kalau JS gagal / ScrollTrigger tidak
// pernah fire (bug IntersectionObserver, hydration error, JS diblokir),
// konten tetap tampil normal. Pola lama di proyek ini (framer-motion
// initial="hidden" + useInView) menyimpan opacity:0 di markup, jadi begitu
// observer-nya tidak jalan seluruh section jadi blok warna kosong.
const PRESETS: Record<RevealKind, gsap.TweenVars> = {
  // Blok teks/heading: naik pelan dari bawah.
  rise: { y: 28, opacity: 0, duration: 0.62 },
  // Grid kartu: tiap anak menyusul dengan jeda pendek.
  stagger: { y: 34, opacity: 0, duration: 0.58, stagger: 0.06 },
  // Panel besar (hero band, banner): skala nyaris tak terlihat + blur
  // tipis supaya terasa "mendarat", bukan sekadar geser.
  panel: { y: 20, opacity: 0, scale: 0.985, filter: "blur(6px)", duration: 0.7 },
};

/**
 * Pasang scroll-reveal pada satu elemen. Mengembalikan fungsi cleanup.
 * Aman dipanggil saat prefers-reduced-motion aktif: langsung no-op,
 * elemen dibiarkan pada state akhirnya (terlihat).
 */
export function applyReveal(el: HTMLElement, opts: RevealOptions = {}): () => void {
  if (typeof window === "undefined") return () => {};

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) return () => {};

  registerScrollTrigger();

  const { kind = "rise", itemSelector = "[data-reveal-item]", start = "top 82%", delay = 0 } = opts;

  const targets =
    kind === "stagger" ? Array.from(el.querySelectorAll<HTMLElement>(itemSelector)) : [el];
  if (targets.length === 0) return () => {};

  const tween = gsap.from(targets, {
    ...PRESETS[kind],
    delay,
    ease: "expo.out", // exponential ease-out — padanan --ease-out di CSS
    clearProps: "filter,transform,opacity", // lepas inline style setelah selesai
    scrollTrigger: {
      trigger: el,
      start,
      once: true,
    },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
  };
}
