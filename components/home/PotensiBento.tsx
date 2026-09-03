// components/home/PotensiBento.tsx
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Reveal } from "@/components/shared/Reveal";
import { RotatingHiasanBackground } from "@/components/shared/RotatingHiasanBackground";
import { POTENSI_DESA } from "@/constants/home";

// Server Component — section ini tidak butuh state/event apa pun. Semua
// gerak masuk ditangani <Reveal> (GSAP ScrollTrigger, satu leaf client),
// hover ditangani CSS. Sebelumnya seluruh section "use client" + 4 motion
// wrapper per kartu hanya untuk efek yang CSS sudah bisa.
export function PotensiBento() {
  return (
    <section className="bg-natural-paper py-24 md:py-32 border-on-surface relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Glow ambience — motion-safe supaya denyutnya berhenti total saat
            user minta reduced motion (animate-[pulse] tidak otomatis patuh). */}
        <div className="absolute -top-10 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl opacity-15 transform-gpu motion-safe:animate-[pulse_6s_infinite]" />
        <div className="absolute bottom-10 right-1/4 w-125 h-125 bg-tertiary rounded-full blur-3xl opacity-15 transform-gpu motion-safe:animate-[pulse_8s_infinite_1s]" />
        <RotatingHiasanBackground hiasan={1} density="elegant" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <Reveal kind="rise" className="mb-16 md:mb-20 max-w-3xl">
          <span className="inline-block bg-primary text-on-primary border-2 border-on-surface px-5 py-1.5 font-black text-xs uppercase tracking-widest mb-6 hard-shadow-sm rounded-full select-none">
            Potensi Desa
          </span>

          <h2 className="font-serif text-5xl md:text-7xl font-black text-on-surface leading-[1.05] tracking-tight text-balance mb-6">
            Kekayaan <span className="italic text-primary">Pulau Obi</span>
          </h2>

          {/* max-w-[62ch] menjaga panjang baris di zona nyaman baca (65-75
              karakter); sebelumnya max-w-2xl memaksa baris terlalu panjang
              di layar lebar. */}
          <p className="text-body-lg text-on-surface-variant max-w-[62ch] font-medium leading-relaxed text-pretty">
            Dari biodiversitas unik hingga produk kerajinan kreatif, Pulau Obi menyimpan potensi
            luar biasa yang siap untuk dijelajahi.
          </p>
        </Reveal>

        <Reveal
          kind="stagger"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {POTENSI_DESA.map((item, index) => {
            // Bento: kartu 1, 4, dan 5 melebar 2 kolom.
            const isWide = index === 0 || index === 3 || index === 4;

            return (
              <Link
                key={item.id}
                href={item.href}
                data-reveal-item
                className={`group relative flex flex-col overflow-hidden p-6 md:p-8 border-4 rounded-2xl min-h-75 h-full hard-shadow-md hard-shadow-hover press-effect ${item.color} ${item.border} ${
                  isWide ? "md:col-span-2 lg:col-span-2" : "md:col-span-1"
                }`}
              >
                <div className="relative z-10 flex items-center justify-between w-full">
                  <span
                    className={`inline-flex items-center justify-center w-12 h-12 ${item.color} rounded-xl border-2 ${item.border} hard-shadow-sm transition-transform duration-[--duration-panel] ease-[--ease-out] group-hover:-rotate-6 group-hover:scale-110`}
                  >
                    <item.icon className={`w-6 h-6 ${item.accent}`} aria-hidden="true" />
                  </span>
                  <span className={`font-mono text-xs font-black tracking-widest opacity-60 tabular ${item.accent}`}>
                    NO. 0{index + 1}
                  </span>
                </div>

                {/* Judul & deskripsi didorong ke BAWAH (mt-auto) sehingga
                    dasarnya rata dengan kartu sebelah berapa pun tingginya.
                    Sebelumnya konten menumpuk di atas dan kartu lebar
                    menyisakan lubang kosong besar di bagian bawah. */}
                <div className="relative z-10 mt-auto pt-10 space-y-2">
                  <h3 className={`font-serif text-2xl md:text-3xl font-black tracking-tight text-balance ${item.accent}`}>
                    {item.title}
                  </h3>
                  {/* Di kartu lebar teks dibatasi ~52ch supaya tidak
                      melintang penuh selebar kartu dan tetap enak dibaca. */}
                  <p className={`${item.accent} text-sm leading-relaxed font-medium opacity-85 max-w-[52ch] text-pretty`}>
                    {item.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-6 mt-6 w-full border-t-2 border-dashed border-on-surface/20">
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider bg-background text-on-surface border-2 border-on-surface px-4 py-2 rounded-lg hard-shadow-sm transition-transform duration-[--duration-panel] ease-[--ease-out] group-hover:-translate-y-0.5 group-hover:translate-x-1">
                    Jelajahi
                    <ChevronRight
                      className="w-4 h-4 transition-transform duration-[--duration-panel] ease-[--ease-out] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </span>
                </div>

                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-on-surface/5 pointer-events-none transition-opacity duration-[--duration-panel] ease-[--ease-out]" />
              </Link>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
