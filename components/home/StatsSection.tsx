// components/home/StatsSection.tsx
import Image from "next/image";
import { Reveal } from "@/components/shared/Reveal";
import { CounterNumber } from "./CounterNumber";
import { STATS_CARDS, type HomeStats } from "@/constants/home";

type StatsSectionProps = {
  stats: HomeStats;
};

// Ornamen kompas per kartu — posisi tetap, tidak beranimasi.
const ORNAMENT_POSITIONS = [
  "top-40 right-40 rotate-12",
  "-bottom-4 -right-4 -rotate-12",
  "-bottom-4 -left-4 rotate-[200deg]",
  "-top-4 -left-4 -rotate-[200deg]",
] as const;

// Server Component — hanya odometer angka (CounterNumber) dan entrance
// (Reveal) yang butuh JS, keduanya leaf client. Sebelumnya seluruh section
// "use client" dengan dua sistem hover yang saling bertabrakan: class
// .hard-shadow-hover DAN whileHover framer-motion yang menimpa boxShadow
// dengan nilai yang tidak bisa diinterpolasi (var() di dalam box-shadow).
export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="relative bg-primary text-on-primary py-24 overflow-hidden border-y-4 border-on-surface">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(rgba(255,255,255,0.6)_1.5px,transparent_1.5px)] bg-size-[24px_24px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <Reveal
          kind="stagger"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
        >
          {STATS_CARDS.map((card, i) => {
            const rawValue = stats[card.key as keyof HomeStats];

            return (
              <div
                key={card.key}
                data-reveal-item
                className="relative bg-natural-paper text-on-surface p-8 rounded-2xl border-4 border-on-surface hard-shadow hard-shadow-hover flex flex-col justify-between items-start min-h-55 group overflow-hidden"
              >
                <div
                  className={`absolute w-36 h-36 pointer-events-none z-0 select-none ${ORNAMENT_POSITIONS[i % ORNAMENT_POSITIONS.length]}`}
                  aria-hidden="true"
                >
                  <Image src="/Hiasan 5.svg" alt="" fill className="object-contain" />
                </div>

                <span className="relative z-10 inline-flex items-center justify-center w-14 h-14 bg-tertiary text-on-tertiary border-2 border-on-surface rounded-xl hard-shadow-sm transition-transform duration-[--duration-panel] ease-[--ease-out] group-hover:-rotate-6">
                  <card.icon className="w-7 h-7" aria-hidden="true" />
                </span>

                <div className="space-y-1 mt-8 w-full relative z-10">
                  <div className="text-4xl md:text-5xl font-black text-on-surface font-serif tracking-tight flex items-baseline">
                    <CounterNumber value={rawValue} format={card.format} />
                  </div>
                  <div className="text-xs uppercase tracking-widest font-black text-on-surface-variant font-sans pt-1">
                    {card.label}
                  </div>
                </div>

                {/* Wedge sudut 32px berposisi absolut dihapus: pada 5% tint
                    dengan garis putus beropasitas 10% ia praktis tak terlihat,
                    tapi tetap menambah dua tepi bergaris pada kartu yang sudah
                    punya border tebal sendiri — tumpukan tepi itulah yang bikin
                    sudut kartu terbaca kotor. Elemennya absolut &
                    pointer-events-none, jadi penghapusannya tidak mengubah
                    susunan apa pun. */}
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
