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
  rise: { y: 24, opacity: 0, duration: 0.9 },
  // Grid kartu: tiap anak menyusul dengan jeda pendek.
  stagger: { y: 28, opacity: 0, duration: 0.85, stagger: 0.09 },
  // Panel besar (hero band, banner): skala nyaris tak terlihat, supaya
  // terasa "mendarat" alih-alih sekadar bergeser.
  //
  // `filter: blur(6px)` dihapus dari preset ini: menganimasikan blur memaksa
  // browser menggambar ulang seluruh permukaan panel pada setiap frame, dan
  // pada panel selebar layar itu cukup untuk menjatuhkan frame rate — persis
  // saat elemennya sedang bergerak dan jank paling terlihat.
  panel: { y: 22, opacity: 0, scale: 0.99, duration: 0.95 },
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

  // start "top 88%" (bukan 82%): animasi mulai saat elemen baru menyentuh
  // tepi bawah layar, jadi sebagian besar geraknya sudah selesai sebelum
  // elemen masuk zona baca. Dengan 82% elemen sudah cukup dalam di layar saat
  // mulai bergerak, sehingga sentakannya justru terlihat.
  const { kind = "rise", itemSelector = "[data-reveal-item]", start = "top 88%", delay = 0 } = opts;

  const targets =
    kind === "stagger" ? Array.from(el.querySelectorAll<HTMLElement>(itemSelector)) : [el];
  if (targets.length === 0) return () => {};

  const tween = gsap.from(targets, {
    ...PRESETS[kind],
    delay,
    // "power2.out", BUKAN "expo.out".
    //
    // Inilah penyebab utama gerak reveal terasa menyentak. expo.out adalah
    // kurva perlambatan paling ekstrem yang ada: ia menempuh sekitar dua
    // pertiga jarak dalam sepersepuluh pertama durasinya, lalu merayap di
    // sisanya. Efeknya elemen seperti "dilempar" ke tempatnya — persis kesan
    // kaget yang dilaporkan. power2.out menyebar geraknya jauh lebih merata,
    // jadi mata sempat mengikuti seluruh lintasannya.
    ease: "power2.out",
    // force3D memaksa transform dijalankan di GPU sehingga geraknya tidak
    // bersaing dengan pekerjaan main thread saat halaman sedang digulir.
    force3D: true,
    clearProps: "transform,opacity", // lepas inline style setelah selesai
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
