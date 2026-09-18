import Image from "next/image";

/**
 * Latar kartografis untuk hero /profil: grid topografi + dua tanda kompas.
 *
 * SEKARANG STATIS, DAN ITU PERBAIKAN UTAMANYA.
 *
 * Versi sebelumnya menjalankan `useScroll()` + `useTransform` yang memutar
 * ornamen 384px sebesar 0→360° mengikuti posisi gulir, DITAMBAH satu ornamen
 * lain yang melayang naik-turun tanpa henti — dan HeroSection.tsx di atasnya
 * menjalankan `useScroll()` KEDUA untuk memutar mawar kompasnya sendiri.
 *
 * Itu penyebab langsung gulir halaman ini terasa patah-patah: properti
 * `rotate` framer-motion tidak dipercepat GPU, ia dihitung di main thread
 * lewat requestAnimationFrame. Dua elemen besar yang diputar pada SETIAP
 * frame gulir memaksa repaint area luas terus-menerus, tepat saat browser
 * juga sedang sibuk menggulir dan (di halaman ini) menyiapkan peta Leaflet.
 *
 * Gerak itu juga tidak punya tujuan: ia tidak menjelaskan apa pun, tidak
 * menandai perubahan status, dan dilihat setiap kali orang membuka halaman.
 * Kompas pada lembar atlas memang tidak berputar — justru diamnya yang
 * membuatnya terbaca sebagai cetakan.
 */
export function AtlasBackground() {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-15"
      aria-hidden="true"
    >
      {/* Grid topografi */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <pattern
              id="topography-grid"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-on-surface/30"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#topography-grid)" />
        </svg>
      </div>

      {/* Dua tanda kompas, diam, menggantung di tepi berlawanan. */}
      <div className="absolute -right-20 top-1/4 w-96 h-96 opacity-40">
        <Image src="/Hiasan 1.svg" alt="" fill className="object-contain" aria-hidden="true" />
      </div>
      <div className="absolute -left-20 bottom-1/4 w-80 h-80 opacity-30">
        <Image src="/Hiasan 1.svg" alt="" fill className="object-contain" aria-hidden="true" />
      </div>
    </div>
  );
}
