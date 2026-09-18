import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, PawPrint } from "lucide-react";
import {
  getIucnBrutalistClass,
  getIucnLabel,
  type Fauna,
} from "@/constants/fauna";

type FaunaChecklistRowProps = {
  item: Fauna;
  number: number;
};

/**
 * BARIS DAFTAR PERIKSA SPESIES.
 *
 * Dua fakta dari data yang menentukan bentuk ini:
 *
 * 1. Hanya 2 dari 15 spesies punya foto. Susunan lama (grid kartu bergambar)
 *    karena itu menampilkan tiga belas pelat kosong — halaman terlihat rusak
 *    padahal datanya justru lengkap di sisi lain.
 * 2. Yang benar-benar dimiliki tiap spesies adalah NAMA (lokal + ilmiah),
 *    TAKSONOMI (ordo, famili), dan STATUS IUCN. Itu data terstruktur, dan
 *    data terstruktur dibaca sebagai daftar berkolom, bukan sebagai kartu.
 *
 * Jadi baris ini memperlakukan inventarisasi fauna seperti daftar periksa di
 * buku panduan lapangan: nama lokal memimpin, binomial ilmiah miring di
 * bawahnya, status konservasi rata kanan supaya seluruh kolom status bisa
 * dipindai menurun dalam satu tatapan.
 */
export function FaunaChecklistRow({ item, number }: FaunaChecklistRowProps) {
  const taxonomy = [item.order_name, item.family].filter(Boolean).join(" · ");

  return (
    <Link
      href={`/fauna-obi/${item.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_4rem_1fr_auto_auto] items-center gap-x-4 gap-y-1 px-3 sm:px-4 py-3.5 rounded-2xl transition-colors duration-200 hover:bg-surface-container-low"
    >
      <span className="text-label-sm font-black tabular text-on-surface-variant/50 w-7 shrink-0">
        {String(number).padStart(2, "0")}
      </span>

      <div className="hidden sm:block relative w-16 h-16 shrink-0 rounded-xl border-2 border-on-surface bg-surface-container-low overflow-hidden">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="64px"
          />
        ) : (
          <div className="flex items-center justify-center h-full" aria-hidden="true">
            <PawPrint className="w-5 h-5 text-on-surface/25" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-serif text-lg md:text-xl font-black text-on-surface leading-tight group-hover:text-primary transition-colors">
          {item.name_local}
        </h3>
        {/* Binomial ilmiah dimiringkan — itu konvensi penulisan nama takson,
            bukan sekadar pilihan gaya. */}
        {item.name_scientific && (
          <p className="italic text-body-md text-on-surface-variant leading-snug">
            {item.name_scientific}
          </p>
        )}
        {taxonomy && (
          <p className="hidden md:block text-label-sm font-bold uppercase tracking-wider text-on-surface-variant/70 mt-0.5">
            {taxonomy}
          </p>
        )}
      </div>

      {/* Kolom status — lebar tetap supaya badge sejajar antar-baris dan
          seluruh kolomnya bisa dibaca menurun. */}
      <span
        className={`justify-self-start sm:justify-self-end col-span-2 sm:col-span-1 inline-block px-2.5 py-1 rounded-full text-label-sm font-black uppercase tracking-wider whitespace-nowrap ${getIucnBrutalistClass(item.iucn_status)}`}
      >
        {getIucnLabel(item.iucn_status)}
      </span>

      <span
        className="hidden sm:grid shrink-0 place-items-center w-10 h-10 rounded-full border-2 border-on-surface bg-background transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:hard-shadow-sm"
        aria-hidden="true"
      >
        <ArrowUpRight className="w-4 h-4 text-on-surface" />
      </span>
    </Link>
  );
}
