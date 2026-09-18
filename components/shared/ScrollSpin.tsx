"use client";

import { useEffect, useRef } from "react";

type ScrollSpinProps = {
  children: React.ReactNode;
  /** Derajat rotasi per 1000px gulir. Negatif = berlawanan arah jarum jam. */
  degreesPer1000px?: number;
  /** Pergeseran vertikal (px) per 1000px gulir — untuk efek kedalaman. */
  driftY?: number;
  /** Perubahan skala pada 1000px gulir, mis. 0.15 = membesar 15%. */
  scaleBy?: number;
  className?: string;
};

/**
 * MEMUTAR ISINYA MENGIKUTI POSISI GULIR HALAMAN.
 *
 * Ditulis dengan JavaScript, dan itu keputusan yang disengaja setelah cara
 * sebelumnya gagal di tangan pengguna.
 *
 * Versi sebelumnya memakai CSS scroll-driven animation
 * (`animation-timeline: scroll()`). Di atas kertas itu pilihan terbaik: ia
 * berjalan di luar main thread. Masalahnya, dukungan browsernya belum merata —
 * fitur itu hanya ada di keluarga Chromium; di Safari dan Firefox deklarasinya
 * diabaikan diam-diam, sehingga ornamennya TIDAK BERGERAK SAMA SEKALI dan
 * tidak ada pesan error apa pun yang muncul. Saya memverifikasinya di Chromium
 * dan menyimpulkan "berhasil", padahal di browser lain hasilnya nol.
 *
 * Pendekatan di sini berjalan di mana saja, dan biayanya ditekan dengan:
 *  • listener `scroll` pasif + SATU requestAnimationFrame per frame, jadi
 *    berapa pun seringnya event gulir terpicu, transform hanya ditulis sekali
 *    per gambar layar;
 *  • menulis langsung ke `style.transform` lewat ref (bukan state React, yang
 *    akan me-render ulang komponen puluhan kali per detik);
 *  • hanya transform — properti yang tidak memicu layout maupun paint ulang.
 *
 * Menghormati prefers-reduced-motion: listener tidak dipasang sama sekali.
 */
export function ScrollSpin({
  children,
  degreesPer1000px = 180,
  driftY = 0,
  scaleBy = 0,
  className,
}: ScrollSpinProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;

    const apply = () => {
      frame = 0;
      const progress = window.scrollY / 1000;
      const deg = progress * degreesPer1000px;
      const y = progress * driftY;
      const scale = 1 + progress * scaleBy;
      el.style.transform =
        `translate3d(0, ${y.toFixed(2)}px, 0) rotate(${deg.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply(); // posisi awal, penting saat halaman dibuka sudah dalam keadaan tergulir
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [degreesPer1000px, driftY, scaleBy]);

  return (
    <div ref={ref} className={className} style={{ willChange: "transform" }}>
      {children}
    </div>
  );
}
