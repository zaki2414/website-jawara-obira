"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import {
  getCategoryAccent,
  CATEGORY_ACCENT_STYLES,
  type CultureItem,
} from "@/constants/budaya";
import { excerptFromHtml, formatDate } from "@/lib/utils";

type CultureIndexRowProps = {
  item: CultureItem;
  /** Nomor katalog yang ditampilkan di rail kiri baris. */
  number: number;
};

/**
 * BARIS INDEKS — pengganti kartu untuk entri non-unggulan.
 *
 * Kenapa baris, bukan kartu: dua belas kartu berukuran sama memaksa mata
 * memindai dalam pola zig-zag dan memberi bobot visual yang sama ke semua
 * entri. Sebuah katalog dibaca menurun, satu entri per baris, seperti daftar
 * isi — dan pemisahnya cukup garis, tidak perlu tiap entri dikotaki sendiri.
 * Ini juga memuat lebih banyak entri per layar tanpa terasa sesak, karena
 * tinggi barisnya tetap dan tidak ada chrome kartu yang diulang-ulang.
 *
 * Nomor katalog di kiri bukan hiasan: pada arsip, urutan entri ADALAH
 * informasi (mana yang terbaru, seberapa banyak yang sudah terkumpul).
 */
export function CultureIndexRow({ item, number }: CultureIndexRowProps) {
  const accent = getCategoryAccent(item.category);
  const styles = CATEGORY_ACCENT_STYLES[accent];
  const excerpt = excerptFromHtml(item.content, 150);

  return (
    <Link
      href={`/budaya/${item.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_7rem_1fr_auto] items-center gap-x-4 sm:gap-x-5 gap-y-2 px-3 sm:px-4 py-4 sm:py-5 rounded-2xl transition-colors duration-200 hover:bg-surface-container-low focus-visible:bg-surface-container-low"
    >
      {/* Nomor katalog */}
      <span className="text-label-sm font-black tabular text-on-surface-variant/50 w-8 shrink-0">
        {String(number).padStart(2, "0")}
      </span>

      {/* Pelat kecil — disembunyikan di layar sempit supaya judul dapat
          lebar penuh, bukan diperas jadi dua kata per baris. */}
      <div className="hidden sm:block relative w-28 h-20 shrink-0 rounded-xl border-2 border-on-surface bg-surface-container-low overflow-hidden">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="112px"
          />
        ) : (
          <div className="flex items-center justify-center h-full" aria-hidden="true">
            <Sparkles className="w-5 h-5 text-on-surface/25" />
          </div>
        )}
      </div>

      {/* Isi */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mb-1.5">
          <span
            className={`inline-block px-2 py-0.5 rounded-full text-label-sm font-black uppercase tracking-wider ${styles.badge}`}
          >
            {item.category}
          </span>
          {item.villages?.name && (
            <span className="inline-flex items-center gap-1 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
              <MapPin className="w-3 h-3" aria-hidden="true" />
              {item.villages.name}
            </span>
          )}
          {item.published_at && (
            <span className="text-label-sm font-bold text-on-surface-variant/70 tabular">
              {formatDate(item.published_at)}
            </span>
          )}
        </div>

        <h3 className="font-serif text-xl md:text-2xl font-black text-on-surface leading-tight text-balance group-hover:text-primary transition-colors">
          {item.title}
        </h3>

        {excerpt && (
          <p className="hidden md:block text-body-md text-on-surface-variant leading-relaxed mt-1.5 max-w-[62ch] line-clamp-2">
            {excerpt}
          </p>
        )}
      </div>

      {/* Penanda arah */}
      <span
        className="shrink-0 grid place-items-center w-10 h-10 rounded-full border-2 border-on-surface bg-background transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:hard-shadow-sm"
        aria-hidden="true"
      >
        <ArrowUpRight className="w-4 h-4 text-on-surface" />
      </span>
    </Link>
  );
}
