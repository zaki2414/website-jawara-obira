"use client";

import { getCategoryAccent, CATEGORY_ACCENT_STYLES } from "@/constants/budaya";

type CategoryRailProps = {
  /** Daftar kategori yang benar-benar bisa dipilih — gabungan taksonomi resmi
   *  dan kategori yang muncul di data. Dioper dari pemanggil, BUKAN dibaca
   *  langsung dari BUDAYA_CATEGORIES, supaya kategori yang hanya ada di
   *  database tidak jadi entri yang mustahil ditemukan. */
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  categoryCounts: Record<string, number>;
  totalCount: number;
};

/**
 * RAIL KATEGORI — filter dipindah dari bar chip horizontal di atas grid ke
 * kolom kiri yang menetap (sticky) di samping isi.
 *
 * Alasannya: sebagai bar horizontal, filter memakan satu baris penuh di atas
 * konten, lalu HILANG begitu pembaca menggulir — padahal justru saat menggulir
 * daftar panjang itulah orang ingin menyaring. Sebagai rail sticky, taksonomi
 * selalu terlihat, jumlah per kategori terbaca sebagai tabel kecil, dan lebar
 * kolom isinya jadi terkendali (bukan melebar sampai 1280px yang bikin baris
 * teks terlalu panjang).
 *
 * Di bawah lg rail ini berubah jadi deretan chip yang bisa digulir mendatar —
 * sticky column tidak masuk akal di layar sempit.
 */
export function CategoryRail({
  categories,
  activeCategory,
  onCategoryChange,
  categoryCounts,
  totalCount,
}: CategoryRailProps) {
  return (
    <>
      {/* ── Layar lebar: rail vertikal sticky ── */}
      <nav
        aria-label="Saring kategori budaya"
        className="hidden lg:block sticky top-28 self-start"
      >
        <p className="text-label-sm font-black uppercase tracking-[0.16em] text-on-surface-variant mb-3">
          Kategori
        </p>

        <ul className="border-t-2 border-on-surface">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = cat === "Semua" ? totalCount : (categoryCounts[cat] ?? 0);
            const accent = cat === "Semua" ? "primary" : getCategoryAccent(cat);
            const styles = CATEGORY_ACCENT_STYLES[accent];

            return (
              <li key={cat} className="border-b-2 border-outline-variant">
                <button
                  type="button"
                  onClick={() => onCategoryChange(cat)}
                  aria-pressed={isActive}
                  className={`w-full flex items-center gap-2.5 py-2.5 px-2 text-left transition-colors duration-150 rounded-md ${
                    isActive
                      ? "bg-surface-container"
                      : "hover:bg-surface-container-low"
                  }`}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full shrink-0 border border-on-surface/40 ${
                      isActive ? styles.dot : "bg-transparent"
                    }`}
                    aria-hidden="true"
                  />
                  <span
                    className={`flex-1 text-label-md uppercase tracking-wider ${
                      isActive ? "font-black text-on-surface" : "font-bold text-on-surface-variant"
                    }`}
                  >
                    {cat}
                  </span>
                  {/* Angka rata kanan & tabular: kolom jumlah terbaca sebagai
                      tabel kecil, tidak goyang saat nilainya berubah. */}
                  <span className="text-label-sm font-black tabular text-on-surface-variant/70">
                    {count}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Layar sempit: chip mendatar ── */}
      <div className="lg:hidden min-w-0 max-w-full -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div
          role="group"
          aria-label="Saring kategori budaya"
          className="flex gap-2 overflow-x-auto scrollbar-none pb-1"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            const count = cat === "Semua" ? totalCount : (categoryCounts[cat] ?? 0);
            const accent = cat === "Semua" ? "primary" : getCategoryAccent(cat);
            const styles = CATEGORY_ACCENT_STYLES[accent];

            return (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                aria-pressed={isActive}
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 h-11 rounded-full border-2 border-on-surface text-label-sm font-black uppercase tracking-wider transition-all duration-150 press-effect ${
                  isActive ? `${styles.badge} hard-shadow-sm` : "bg-background text-on-surface-variant"
                }`}
              >
                {cat}
                <span className="tabular opacity-70">{count}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}
