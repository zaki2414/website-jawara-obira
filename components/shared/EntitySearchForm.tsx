"use client";

import { motion, type Variants } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ChevronDown, type LucideIcon } from "lucide-react";
import { DOMAIN_ACCENT, type DomainKey } from "@/constants/domainAccent";

type FilterOption = {
  value: string;
  label: string;
  emoji: string;
};

type EntitySearchFormProps = {
  variants: Variants;
  initialQ?: string;
  initialFilter?: string;
  /** name atribut <select>, mis. "class" (fauna) atau "type" (umkm). Opsional — kalau
   *  filterOptions kosong/tidak diisi, dropdown filter tidak dirender (form jadi search-only). */
  filterName?: string;
  filterOptions?: FilterOption[];
  searchPlaceholder: string;
  filterLabel: string;
  SearchIcon: LucideIcon;
  /** Ikon tombol submit. Default ke SearchIcon kalau tidak diisi (varian search-only). */
  FilterIcon?: LucideIcon;
  /**
   * Domain pemilik form ini. Menentukan warna tombol submit supaya kontrol
   * ikut aksen halamannya — sebelumnya tombol selalu biru primary, jadi di
   * halaman TOGA (hijau) dan Budaya (emas) ia terbaca sebagai benda asing
   * yang nyasar dari halaman lain. Default primary bila tidak diisi.
   */
  accent?: DomainKey;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
};

export function EntitySearchForm({
  variants,
  initialQ,
  initialFilter,
  filterName,
  filterOptions = [],
  searchPlaceholder,
  filterLabel,
  SearchIcon,
  FilterIcon,
  accent,
  onSubmit,
}: EntitySearchFormProps) {
  const SubmitIcon = FilterIcon ?? SearchIcon;
  const submitTone = accent ? DOMAIN_ACCENT[accent].chip : "bg-primary text-on-primary";
  const { ref, inView } = useInView({ threshold: 0.3, triggerOnce: true });

  return (
    <motion.form
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      onSubmit={onSubmit}
      className="flex flex-col md:flex-row gap-5 mb-5 bg-background p-5 border-4 border-on-surface rounded-2xl hard-shadow-sm hover:hard-shadow transition-all duration-300 group/form"
    >
      {/* Search Input */}
      <div className="flex-1 relative group/input">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <SearchIcon className="w-5 h-5 text-on-surface-variant group-focus-within/input:text-primary group-focus-within/input:scale-110 transition-all duration-200" />
        </div>
        <input
          name="q"
          defaultValue={initialQ || ""}
          placeholder={searchPlaceholder}
          className="w-full pl-12 pr-4 py-4 border-3 border-on-surface rounded-xl bg-surface font-black text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:bg-background focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 text-sm tracking-wide"
        />
      </div>

      {/* Filter Select (opsional — hanya dirender kalau filterOptions diisi) */}
      {filterName && filterOptions.length > 0 && (
        <div className="relative group/select">
          <select
            name={filterName}
            defaultValue={initialFilter || "all"}
            className="w-full md:w-auto min-w-50 pl-4 pr-10 py-4 border-3 border-on-surface rounded-xl bg-surface font-black text-on-surface cursor-pointer focus:outline-none focus:border-tertiary focus:bg-background appearance-none transition-all duration-200 text-sm tracking-wide"
          >
            {filterOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="font-bold">
                {opt.emoji} &nbsp; {opt.label}
              </option>
            ))}
          </select>
          {/* Ikon SVG, bukan glyph "▼": karakter Unicode merender beda-beda
              per platform (dan ikut ketebalan font), jadi ia tidak pernah
              sejajar dengan ikon lucide lain di sistem ini. */}
          <ChevronDown
            className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-4 h-4 text-on-surface-variant group-focus-within/select:text-on-surface transition-colors"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        className={`px-8 py-4 ${submitTone} font-black rounded-xl border-3 border-on-surface hard-shadow-sm hover:hard-shadow-md active:hard-shadow-none active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-3 whitespace-nowrap text-sm uppercase tracking-widest group/btn`}
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.div
          variants={{ hover: { rotate: [0, -15, 15, 0], scale: 1.2 } }}
          whileHover="hover"
          transition={{ type: "spring" as const, stiffness: 300, damping: 10 }}
          className="inline-flex"
        >
          {/* currentColor, bukan text-on-primary hardcode — supaya ikonnya
              ikut pasangan warna aksen domain apa pun yang dipakai. */}
          <SubmitIcon className="w-4 h-4" />
        </motion.div>
        <span>{filterLabel}</span>
      </motion.button>
    </motion.form>
  );
}
