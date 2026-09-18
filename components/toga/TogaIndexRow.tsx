import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sprout } from "lucide-react";
import type { TogaPlant } from "@/constants/toga";

type TogaIndexRowProps = {
  item: TogaPlant;
  number: number;
};

/**
 * Kolom `health_benefits` bertipe array di database, tapi data lama bisa saja
 * tersimpan sebagai string JSON. Dinormalkan di satu tempat supaya markup
 * tidak perlu tahu bentuk aslinya.
 */
function parseBenefits(value: TogaPlant["health_benefits"]): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.filter(Boolean) : [value];
    } catch {
      return [value];
    }
  }
  return [];
}

/**
 * BARIS INDEKS MATERIA MEDICA.
 *
 * Bentuk halaman ini ditentukan isinya: kesembilan tanaman punya 4–5 KHASIAT
 * tercatat, tapi hanya 2 yang punya foto. Jadi yang layak memimpin baris
 * adalah nama + khasiatnya, bukan pelat gambar yang tujuh di antaranya kosong.
 *
 * Nama Indonesia jadi entri utama karena begitulah warga menyebutnya, dengan
 * binomial Latin miring di bawahnya sebagai kunci rujukan ilmiah — susunan
 * yang sama dipakai buku materia medica: nama umum untuk mencari, nama ilmiah
 * untuk memastikan.
 */
export function TogaIndexRow({ item, number }: TogaIndexRowProps) {
  const benefits = parseBenefits(item.health_benefits);
  const shown = benefits.slice(0, 3);
  const rest = benefits.length - shown.length;

  return (
    <Link
      href={`/toga/${item.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] sm:grid-cols-[auto_4.5rem_1fr_auto] items-start gap-x-4 gap-y-2 px-3 sm:px-4 py-4 rounded-2xl transition-colors duration-200 hover:bg-surface-container-low"
    >
      <span className="text-label-sm font-black tabular text-on-surface-variant/50 w-7 shrink-0 pt-1">
        {String(number).padStart(2, "0")}
      </span>

      <div className="hidden sm:block relative w-18 h-18 shrink-0 rounded-xl border-2 border-on-surface bg-herbal-container/50 overflow-hidden">
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
            <Sprout className="w-5 h-5 text-herbal/40" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <h3 className="font-serif text-xl md:text-2xl font-black text-on-surface leading-tight group-hover:text-herbal transition-colors">
          {item.name_id}
        </h3>
        {item.name_latin && (
          <p className="italic text-body-md text-on-surface-variant leading-snug">
            {item.name_latin}
          </p>
        )}

        {shown.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-2">
            {shown.map((benefit) => (
              <li
                key={benefit}
                className="inline-block px-2 py-0.5 rounded-full bg-herbal-container text-on-surface text-label-sm font-bold max-w-full truncate"
                // Khasiat panjang dipotong secara visual, tapi teks penuhnya
                // tetap tersedia lewat title untuk hover & pembaca layar.
                title={benefit}
              >
                {benefit}
              </li>
            ))}
            {rest > 0 && (
              <li className="inline-block px-2 py-0.5 rounded-full border-2 border-dashed border-outline text-on-surface-variant text-label-sm font-black tabular">
                +{rest} lagi
              </li>
            )}
          </ul>
        )}
      </div>

      <span
        className="shrink-0 grid place-items-center w-10 h-10 mt-1 rounded-full border-2 border-on-surface bg-background transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:hard-shadow-sm"
        aria-hidden="true"
      >
        <ArrowUpRight className="w-4 h-4 text-on-surface" />
      </span>
    </Link>
  );
}
