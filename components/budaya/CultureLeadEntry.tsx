"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import {
  getCategoryAccent,
  CATEGORY_ACCENT_STYLES,
  type CultureItem,
} from "@/constants/budaya";
import { excerptFromHtml, formatDate } from "@/lib/utils";

type CultureLeadEntryProps = {
  item: CultureItem;
};

/**
 * ENTRI UTAMA — satu artikel diberi panggung besar di kepala katalog.
 *
 * Alasan strukturalnya: katalog yang menampilkan semua entri dalam kartu
 * berukuran sama menyatakan bahwa tidak ada satu pun yang cukup penting untuk
 * dilihat lebih dulu. Arsip justru sebaliknya — nilainya ada pada bendanya.
 * Jadi entri terbaru mendapat gambar besar, judul sebesar judul halaman, dan
 * cuplikan isinya; sisanya turun ke indeks padat di bawah.
 *
 * Ini juga satu-satunya tempat di halaman ini yang menampilkan CUPLIKAN ISI.
 * Sebelumnya pembaca harus membuka artikel hanya untuk tahu isinya tentang apa.
 */
export function CultureLeadEntry({ item }: CultureLeadEntryProps) {
  const accent = getCategoryAccent(item.category);
  const styles = CATEGORY_ACCENT_STYLES[accent];
  const excerpt = excerptFromHtml(item.content, 240);

  return (
    <Link
      href={`/budaya/${item.slug}`}
      className="group block border-4 border-on-surface rounded-3xl bg-background overflow-hidden hard-shadow-lg hard-shadow-hover press-effect"
    >
      {/* Pemisah dua panel dinyatakan lewat divide-* di INDUK, bukan
          border-r-4 di anak. Hasil visualnya sama, tapi maksudnya jadi tepat:
          ini garis pembagi antara dua panel sederajat (gambar | teks) yang
          berputar arah mengikuti layout — vertikal di layar lebar, horizontal
          saat menumpuk — bukan aksen yang ditempel di satu sisi kartu. */}
      <div className="grid md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-on-surface">
        {/* Pelat gambar — sisi kiri penuh, tanpa padding, supaya bendanya
            yang pertama terbaca, bukan bingkainya. */}
        <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[22rem] bg-surface-container-low overflow-hidden">
          {item.thumbnail_url ? (
            <Image
              src={item.thumbnail_url}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
            />
          ) : (
            <div className="relative flex items-center justify-center h-full" aria-hidden="true">
              <div className="absolute inset-0 bg-[radial-gradient(rgba(29,28,24,0.85)_1.5px,transparent_1.5px)] bg-size-[18px_18px] opacity-[0.07]" />
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.09]">
                <div className="relative w-56 h-56">
                  <Image src="/Hiasan 4.svg" alt="" fill className="object-contain" />
                </div>
              </div>
              <div className="relative flex flex-col items-center gap-2 rounded-xl border-2 border-dashed border-on-surface/25 px-6 py-5">
                <Sparkles className="w-9 h-9 text-on-surface/35" />
                <span className="text-label-sm font-black uppercase tracking-[0.14em] text-on-surface/35">
                  Belum berfoto
                </span>
              </div>
            </div>
          )}

          <span
            className={`absolute top-4 left-4 z-10 px-3 py-1 rounded-full border-2 border-on-surface text-label-sm font-black uppercase tracking-wider hard-shadow-sm ${styles.badge}`}
          >
            {item.category}
          </span>
        </div>

        {/* Kolom teks */}
        <div className="p-6 md:p-9 flex flex-col justify-center gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-label-sm font-black uppercase tracking-[0.14em] text-on-surface-variant">
            <span className={styles.text}>Sorotan Arsip</span>
            {item.villages?.name && (
              <>
                <span aria-hidden="true" className="text-outline">
                  /
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3 h-3" aria-hidden="true" />
                  {item.villages.name}
                </span>
              </>
            )}
            {item.published_at && (
              <>
                <span aria-hidden="true" className="text-outline">
                  /
                </span>
                <span className="tabular">{formatDate(item.published_at)}</span>
              </>
            )}
          </div>

          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-black text-on-surface leading-[1.02] tracking-[-0.03em] text-balance">
            {item.title}
          </h2>

          {excerpt && (
            <>
              <div className="border-t-2 border-dashed border-outline-variant" aria-hidden="true" />
              <p className="text-body-md text-on-surface-variant leading-relaxed max-w-[52ch]">
                {excerpt}
              </p>
            </>
          )}

          <span className="inline-flex items-center gap-2 text-label-md font-black uppercase tracking-widest text-on-surface mt-1">
            Baca Selengkapnya
            <ArrowUpRight
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
