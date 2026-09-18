import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, Store } from "lucide-react";
import { resolveBusinessTypeLabel, type UMKMItem } from "@/constants/umkm";

type UMKMDirectoryRowProps = {
  item: UMKMItem;
  number: number;
};

/**
 * BARIS DIREKTORI — pengganti kartu foto besar untuk daftar usaha.
 *
 * Halaman ini adalah DIREKTORI: orang datang mencari "siapa yang jual ikan"
 * atau "bengkel di Kawasi", bukan untuk menikmati foto etalase. Sebagai kartu
 * foto, 17 usaha memakan hampir 5000px dan tidak ada satu layar pun yang bisa
 * dibandingkan isinya. Sebagai baris, tujuh belas entri muat dalam dua layar
 * dan mata bisa memindai kolom nama secara menurun.
 *
 * Server Component: tidak ada state maupun event handler di sini — hover
 * ditangani CSS. Sebelumnya tiap kartu membawa wrapper framer-motion sendiri.
 */
export function UMKMDirectoryRow({ item, number }: UMKMDirectoryRowProps) {
  // Resolver menangani kapitalisasi bebas & nilai di luar taksonomi resmi.
  const typeLabel = resolveBusinessTypeLabel(item.business_type);

  return (
    <Link
      href={`/umkm/${item.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_4.5rem_1fr_auto] items-center gap-x-4 gap-y-1 px-3 sm:px-4 py-4 rounded-2xl transition-colors duration-200 hover:bg-surface-container-low"
    >
      <span className="text-label-sm font-black tabular text-on-surface-variant/50 w-7 shrink-0">
        {String(number).padStart(2, "0")}
      </span>

      {/* Pelat kecil persegi — cukup untuk mengenali tempatnya, tidak lebih.
          Disembunyikan di layar sempit supaya nama usaha dapat lebar penuh. */}
      <div className="hidden sm:block relative w-18 h-18 shrink-0 rounded-xl border-2 border-on-surface bg-surface-container-low overflow-hidden">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt=""
            fill
            aria-hidden="true"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
            sizes="72px"
          />
        ) : (
          <div className="flex items-center justify-center h-full" aria-hidden="true">
            <Store className="w-5 h-5 text-on-surface/25" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-serif text-lg md:text-xl font-black text-on-surface leading-tight group-hover:text-primary transition-colors">
          {item.name}
        </h3>

        <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 mt-1">
          <span className="inline-block px-2 py-0.5 rounded-full bg-cream text-on-surface text-label-sm font-black uppercase tracking-wider">
            {typeLabel}
          </span>
          {item.location_text && (
            <span className="inline-flex items-center gap-1 text-label-sm font-bold text-on-surface-variant min-w-0">
              <MapPin className="w-3 h-3 shrink-0" aria-hidden="true" />
              <span className="truncate">{item.location_text}</span>
            </span>
          )}
        </div>

        {item.short_description && (
          <p className="hidden md:block text-body-md text-on-surface-variant leading-relaxed mt-1.5 max-w-[64ch] line-clamp-1">
            {item.short_description}
          </p>
        )}
      </div>

      <span
        className="shrink-0 grid place-items-center w-10 h-10 rounded-full border-2 border-on-surface bg-background transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:hard-shadow-sm"
        aria-hidden="true"
      >
        <ArrowUpRight className="w-4 h-4 text-on-surface" />
      </span>
    </Link>
  );
}
