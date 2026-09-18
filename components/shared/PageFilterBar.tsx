"use client";

import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { DOMAIN_ACCENT, type DomainKey } from "@/constants/domainAccent";

export type FilterChip = {
  value: string;
  label: string;
  count?: number;
  /** Kelas warna solid saat chip aktif, mis. "bg-primary text-on-primary". */
  activeClass?: string;
};

export type FilterSelectOption = { value: string; label: string };

type PageFilterBarProps = {
  /** Menentukan warna tombol cari & aksen fokus. */
  accent: DomainKey;

  /** Kolom pencarian. Dihilangkan bila halaman tidak punya pencarian. */
  search?: {
    name: string;
    placeholder: string;
    defaultValue?: string;
  };

  /** Dropdown penyaring. Dihilangkan bila halaman tidak punya. */
  select?: {
    name: string;
    label: string;
    options: FilterSelectOption[];
    defaultValue?: string;
  };

  /** Label tombol submit. */
  submitLabel?: string;

  /**
   * Deretan chip kategori. Dipakai halaman yang menyaring di sisi klien
   * (Budaya, Galeri) — chip memanggil balik, tidak mengirim form.
   */
  chips?: {
    label: string;
    items: FilterChip[];
    active: string;
    onSelect: (value: string) => void;
  };
};

/**
 * SATU BENTUK FILTER UNTUK SEMUA HALAMAN DAFTAR.
 *
 * Sebelum ini setiap domain punya filternya sendiri dengan bentuk yang
 * berbeda-beda: Budaya & Galeri memakai deretan chip bulat berukuran satu
 * macam, sementara TOGA, Fauna, dan UMKM memakai kotak pencarian besar
 * bertepi tebal dengan dropdown dan tombol — lima komponen terpisah dengan
 * tinggi, radius, dan tata letak yang tidak pernah cocok satu sama lain.
 * Akibatnya berpindah antar-halaman terasa seperti berpindah aplikasi.
 *
 * Sekarang semuanya melewati komponen ini. Yang membedakan antar-halaman
 * hanya BAGIAN MANA yang dipakai (pencarian saja, pencarian + dropdown, atau
 * chip) dan warna aksennya — bukan bentuk dasarnya.
 *
 * Bagian pencarian dibungkus <form method="get"> supaya hasil penyaringan
 * tetap punya alamat sendiri yang bisa dibagikan dan berfungsi tanpa
 * JavaScript; chip memakai callback karena halaman yang memakainya menyaring
 * data yang sudah ada di klien tanpa memuat ulang.
 */
export function PageFilterBar({
  accent,
  search,
  select,
  submitLabel = "Cari",
  chips,
}: PageFilterBarProps) {
  const tone = DOMAIN_ACCENT[accent];
  const hasForm = Boolean(search || select);

  return (
    <div className="space-y-4">
      {hasForm && (
        <form
          method="get"
          className="flex flex-col gap-3 rounded-2xl border-4 border-on-surface bg-background p-3 hard-shadow sm:flex-row sm:items-center"
        >
          {search && (
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant"
                aria-hidden="true"
              />
              <input
                type="search"
                name={search.name}
                defaultValue={search.defaultValue ?? ""}
                placeholder={search.placeholder}
                aria-label={search.placeholder}
                className="h-12 w-full rounded-xl border-2 border-on-surface bg-surface pl-11 pr-4 text-body-md font-semibold text-on-surface placeholder:font-medium placeholder:text-on-surface-variant/50 focus:bg-background focus:outline-none"
              />
            </div>
          )}

          {select && select.options.length > 0 && (
            <div className="relative sm:w-56">
              <select
                name={select.name}
                defaultValue={select.defaultValue ?? "all"}
                aria-label={select.label}
                className="h-12 w-full cursor-pointer appearance-none rounded-xl border-2 border-on-surface bg-surface pl-4 pr-10 text-body-md font-semibold text-on-surface focus:bg-background focus:outline-none"
              >
                {select.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {/* Ikon SVG, bukan glyph "▼": karakter Unicode dirender berbeda
                  per platform dan ikut ketebalan font, jadi tidak pernah
                  sejajar dengan ikon lucide lain di situs ini. */}
              <ChevronDown
                className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant"
                aria-hidden="true"
              />
            </div>
          )}

          <button
            type="submit"
            className={`inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-on-surface px-6 text-label-md font-black uppercase tracking-wider hard-shadow-sm hard-shadow-hover press-effect ${tone.chip}`}
          >
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            {submitLabel}
          </button>
        </form>
      )}

      {chips && chips.items.length > 0 && (
        <div className="min-w-0 max-w-full">
          <div
            role="group"
            aria-label={chips.label}
            // mask-image-horizontal DIHAPUS di sini. Utilitas itu memudarkan KEDUA
            // tepi, padahal baris chip mulai rata kiri dan hanya meluber ke
            // kanan — jadi fade kirinya memudarkan chip pertama ("Semua") yang
            // sama sekali tidak terpotong, dan terbaca seperti ada gradien
            // putih menempel di sisi kiri filter.
            className="flex gap-2 overflow-x-auto scrollbar-none pb-1"
          >
            {chips.items.map((chip) => {
              const isActive = chips.active === chip.value;
              return (
                <button
                  key={chip.value}
                  type="button"
                  onClick={() => chips.onSelect(chip.value)}
                  aria-pressed={isActive}
                  className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-xl border-2 border-on-surface px-4 text-label-sm font-black uppercase tracking-wider transition-all duration-150 press-effect ${
                    isActive
                      ? `${chip.activeClass ?? tone.chip} hard-shadow-sm`
                      : "bg-background text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  {chip.label}
                  {typeof chip.count === "number" && (
                    <span className="tabular opacity-70">{chip.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
