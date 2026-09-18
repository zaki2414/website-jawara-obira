"use client";

import { useEffect, useRef } from "react";

type MouseDriftProps = {
  children: React.ReactNode;
  /** Seberapa jauh lapisan ini bergeser, dalam piksel, pada simpangan penuh. */
  strength?: number;
  /** Rotasi maksimum, dalam derajat. */
  rotate?: number;
  className?: string;
};

/**
 * Menggeser & memiringkan isinya mengikuti posisi kursor.
 *
 * Tiga hal yang dijaga di sini karena semuanya adalah jebakan performa yang
 * nyata pada efek semacam ini:
 *
 * 1. TULIS LANGSUNG KE style.transform, BUKAN ke CSS variable induk.
 *    Mengubah custom property di sebuah induk memaksa browser menghitung ulang
 *    gaya SELURUH anaknya. Pada halaman dengan tiga ornamen dan puluhan kartu,
 *    itu berarti kerja gaya besar pada setiap gerakan mouse.
 *
 * 2. SATU rAF PER FRAME. Event pointermove bisa terpicu jauh lebih sering
 *    daripada laju gambar layar; tanpa penjadwalan, transform ditulis
 *    berkali-kali untuk frame yang sama dan sebagian besarnya terbuang.
 *
 * 3. INTERPOLASI HALUS (lerp). Menempelkan posisi kursor mentah membuat
 *    ornamen "menempel" di kursor dan terasa mekanis. Mendekati target sedikit
 *    demi sedikit tiap frame memberi kelembaman, jadi geraknya menyusul dengan
 *    tenang — sekaligus meredam lonjakan saat kursor melompat.
 *
 * Menghormati prefers-reduced-motion: kalau aktif, komponen tidak memasang
 * listener sama sekali dan isinya tetap diam.
 */
export function MouseDrift({
  children,
  strength = 26,
  rotate = 7,
  className,
}: MouseDriftProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Perangkat sentuh tidak punya kursor yang melayang — efek ini tidak
    // berlaku dan listener-nya hanya jadi beban.
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let frame = 0;

    const onMove = (event: PointerEvent) => {
      // Dinormalkan ke rentang -1..1 relatif terhadap tengah layar.
      targetX = (event.clientX / window.innerWidth) * 2 - 1;
      targetY = (event.clientY / window.innerHeight) * 2 - 1;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const tick = () => {
      // Lerp: 12% jarak sisa per frame — cukup responsif tapi masih terasa
      // punya bobot.
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      el.style.transform =
        `translate3d(${(currentX * strength).toFixed(2)}px, ` +
        `${(currentY * strength).toFixed(2)}px, 0) ` +
        `rotate(${(currentX * rotate).toFixed(2)}deg)`;

      const settled =
        Math.abs(targetX - currentX) < 0.001 && Math.abs(targetY - currentY) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [strength, rotate]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
