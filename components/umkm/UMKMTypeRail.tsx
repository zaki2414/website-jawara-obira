import Link from "next/link";
import { UMKM_TYPE_ICONS } from "@/constants/umkm";

export type UMKMTypeOption = { value: string; label: string };

type UMKMTypeRailProps = {
  /** Jenis usaha yang benar-benar bisa dipilih — gabungan taksonomi resmi dan
   *  nilai yang muncul di database. Dioper dari pemanggil, BUKAN dibaca dari
   *  UMKM_BUSINESS_TYPES, supaya jenis yang hanya ada di data ("Produk",
   *  "Kuliner") tidak jadi entri yang mustahil ditemukan. */
  types: UMKMTypeOption[];
  /** Jenis usaha yang sedang aktif (dari ?type=). */
  activeType?: string;
  /** Kata kunci aktif — dipertahankan saat berpindah jenis usaha. */
  activeQ?: string;
  businessTypeCounts: Record<string, number>;
  totalCount: number;
};

/**
 * RAIL JENIS USAHA — navigasi taksonomi direktori.
 *
 * Dibuat dari <Link>, bukan tombol berstate, karena penyaringan halaman ini
 * memang digerakkan URL (?type=&q=). Konsekuensinya bagus: tiap jenis usaha
 * punya alamat sendiri yang bisa dibagikan dan di-bookmark, dan rail-nya tetap
 * berfungsi tanpa JavaScript. Kata kunci pencarian ikut dibawa saat berpindah
 * jenis supaya penyaringan tidak diam-diam ter-reset.
 */
export function UMKMTypeRail({
  types,
  activeType,
  activeQ,
  businessTypeCounts,
  totalCount,
}: UMKMTypeRailProps) {
  const current = (activeType || "all").trim().toLowerCase();

  const hrefFor = (value: string) => {
    const params = new URLSearchParams();
    if (value !== "all") params.set("type", value);
    if (activeQ) params.set("q", activeQ);
    const qs = params.toString();
    return qs ? `/umkm?${qs}` : "/umkm";
  };

  return (
    <>
      {/* Layar lebar: rail vertikal sticky */}
      <nav aria-label="Saring jenis usaha" className="hidden lg:block sticky top-28 self-start">
        <p className="text-label-sm font-black uppercase tracking-[0.16em] text-on-surface-variant mb-3">
          Jenis Usaha
        </p>

        <ul className="border-t-2 border-on-surface">
          {types.map((type) => {
            const isActive = current === type.value;
            const count =
              type.value === "all" ? totalCount : (businessTypeCounts[type.value] ?? 0);
            const Icon = UMKM_TYPE_ICONS[type.value] ?? UMKM_TYPE_ICONS.all;

            return (
              <li key={type.value} className="border-b-2 border-outline-variant">
                <Link
                  href={hrefFor(type.value)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-2.5 py-2.5 px-2 rounded-md transition-colors duration-150 ${
                    isActive ? "bg-surface-container" : "hover:bg-surface-container-low"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-on-surface-variant"}`}
                    aria-hidden="true"
                  />
                  <span
                    className={`flex-1 text-label-md uppercase tracking-wider leading-tight ${
                      isActive ? "font-black text-on-surface" : "font-bold text-on-surface-variant"
                    }`}
                  >
                    {type.label}
                  </span>
                  <span className="text-label-sm font-black tabular text-on-surface-variant/70">
                    {count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Layar sempit: chip mendatar */}
      <div className="lg:hidden min-w-0 max-w-full -mx-4 px-4 sm:-mx-6 sm:px-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {types.map((type) => {
            const isActive = current === type.value;
            const count =
              type.value === "all" ? totalCount : (businessTypeCounts[type.value] ?? 0);
            const Icon = UMKM_TYPE_ICONS[type.value] ?? UMKM_TYPE_ICONS.all;

            return (
              <Link
                key={type.value}
                href={hrefFor(type.value)}
                aria-current={isActive ? "page" : undefined}
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 h-11 rounded-full border-2 border-on-surface text-label-sm font-black uppercase tracking-wider transition-all duration-150 press-effect ${
                  isActive
                    ? "bg-primary text-on-primary hard-shadow-sm"
                    : "bg-background text-on-surface-variant"
                }`}
              >
                <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                {type.label}
                <span className="tabular opacity-70">{count}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
