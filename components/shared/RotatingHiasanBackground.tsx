import Image from "next/image";

type RotatingHiasanBackgroundProps = {
  /** Nomor file "Hiasan {n}.svg" di /public — identitas visual per keluarga halaman. */
  hiasan: 1 | 2 | 3 | 4 | 5;
  /**
   * "full" (default) — 3 instance desktop + 2 mobile, opacity sampai 0.85 (dipakai
   * berita/kkn). "elegant" — 2 instance desktop + 1 mobile, opacity jauh lebih
   * rendah (~0.15-0.24), untuk halaman yang butuh ornamen lebih halus & tidak ramai.
   */
  density?: "full" | "elegant";
};

/**
 * Ornamen dekoratif Hiasan-N.svg berputar — dipakai sebagai latar setiap
 * halaman publik supaya semua route punya identitas ornamen berputar yang
 * konsisten, tanpa menduplikasi markup yang sama persis di tiap fitur.
 * Murni Server Component (tanpa "use client") karena hanya markup statis +
 * CSS keyframe (motion-safe: menghormati prefers-reduced-motion).
 */
export function RotatingHiasanBackground({ hiasan, density = "full" }: RotatingHiasanBackgroundProps) {
  const src = `/Hiasan ${hiasan}.svg`;

  if (density === "elegant") {
    return (
      <>
        {/* Desktop Ornaments — 2 instance, opacity rendah */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
          <div className="absolute -right-16 top-1/4 w-72 h-72 opacity-[0.22] motion-safe:animate-[spin_32s_linear_infinite]">
            <Image src={src} alt="" fill className="object-contain" aria-hidden="true" />
          </div>
          <div className="absolute -left-12 bottom-1/4 w-64 h-64 opacity-[0.16] motion-safe:animate-[spin_38s_linear_infinite_reverse]">
            <Image src={src} alt="" fill className="object-contain" aria-hidden="true" />
          </div>
        </div>

        {/* Mobile Subtle Backdrop — 1 instance */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none lg:hidden opacity-15">
          <div className="absolute -top-10 -right-10 w-40 h-40 motion-safe:animate-[spin_32s_linear_infinite]">
            <Image src={src} alt="" fill className="object-contain" aria-hidden="true" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Desktop Ornaments */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden lg:block">
        <div className="absolute -right-20 top-1/4 w-80 h-80 opacity-[0.85] motion-safe:animate-[spin_35s_linear_infinite]">
          <Image src={src} alt="" fill className="object-contain" aria-hidden="true" />
        </div>
        <div className="absolute -left-16 bottom-1/4 w-72 h-72 opacity-70 motion-safe:animate-[spin_40s_linear_infinite_reverse]">
          <Image src={src} alt="" fill className="object-contain" aria-hidden="true" />
        </div>
        <div className="absolute right-1/4 bottom-1/3 w-48 h-48 opacity-50 motion-safe:animate-[spin_50s_linear_infinite]">
          <Image src={src} alt="" fill className="object-contain" aria-hidden="true" />
        </div>
      </div>

      {/* Mobile Subtle Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none lg:hidden opacity-20">
        <div className="absolute -top-12 -right-12 w-48 h-48 motion-safe:animate-[spin_35s_linear_infinite]">
          <Image src={src} alt="" fill className="object-contain" aria-hidden="true" />
        </div>
        <div className="absolute -bottom-12 -left-12 w-40 h-40 motion-safe:animate-[spin_40s_linear_infinite_reverse]">
          <Image src={src} alt="" fill className="object-contain" aria-hidden="true" />
        </div>
      </div>
    </>
  );
}
