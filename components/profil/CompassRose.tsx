import Image from "next/image";
import { ScrollSpin } from "@/components/shared/ScrollSpin";

/**
 * MAWAR KOMPAS HERO /profil.
 *
 * Bentuknya seperti semula — cincin putus-putus, penanda N/S/E/W, ornamen
 * Hiasan 4 di tengah — dan ORNAMEN DI TENGAHNYA BERPUTAR SAAT HALAMAN DIGULIR
 * KE BAWAH.
 *
 * Rotasinya kini dikerjakan JavaScript (lihat ScrollSpin.tsx). Percobaan
 * sebelumnya memakai CSS `animation-timeline: scroll()`, yang hanya jalan di
 * keluarga Chromium; di Safari dan Firefox deklarasi itu diabaikan tanpa error
 * sehingga ornamennya diam total. ScrollSpin berjalan di semua browser.
 *
 * Cincin dan huruf mata anginnya sengaja TETAP DIAM — kalau ikut berputar,
 * penanda arahnya tidak lagi menunjuk arah.
 */

const CARDINALS = [
  { label: "N", pos: "left-1/2 -translate-x-1/2 -top-3" },
  { label: "E", pos: "top-1/2 -translate-y-1/2 -right-3" },
  { label: "S", pos: "left-1/2 -translate-x-1/2 -bottom-3" },
  { label: "W", pos: "top-1/2 -translate-y-1/2 -left-3" },
];

export function CompassRose() {
  return (
    <div
      className="pointer-events-none absolute -bottom-10 -right-10 z-0 grid size-64 rotate-20 place-items-center rounded-full border-4 border-dashed border-on-primary/20 sm:right-12 sm:top-1/2 sm:size-72 sm:-translate-y-1/2 md:right-24 md:size-80"
      aria-hidden="true"
    >
      {CARDINALS.map((c) => (
        <span
          key={c.label}
          className={`absolute font-sans text-sm font-black tracking-widest text-on-primary/40 sm:text-base ${c.pos}`}
        >
          {c.label}
        </span>
      ))}

      {/* Cincin dalam, ikut diam sebagai kerangka instrumen. */}
      <div className="absolute inset-[14%] rounded-full border-2 border-on-primary/12" />

      {/* Ornamen — berputar mengikuti gulir. */}
      <ScrollSpin degreesPer1000px={260} className="relative size-[34%]">
        <div className="relative size-full opacity-35">
          <Image src="/Hiasan 4.svg" alt="" fill className="object-contain" aria-hidden="true" />
        </div>
      </ScrollSpin>
    </div>
  );
}
