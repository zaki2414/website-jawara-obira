import Link from "next/link";
import { Bird, Turtle, Rabbit, LayoutGrid, type LucideIcon } from "lucide-react";
import { IUCN_ORDER, IUCN_LABELS, IUCN_STYLES } from "@/constants/fauna";

type FaunaClassRailProps = {
  /** Kelas takson yang benar-benar ada di data + "all". */
  classes: { value: string; label: string; count: number }[];
  activeClass?: string;
  activeQ?: string;
  totalCount: number;
  /** Jumlah spesies per kode IUCN — dipakai legenda status. */
  statusCounts: Record<string, number>;
};

// Ikon per kelas takson — SVG, bukan emoji (field `emoji` di FAUNA_CLASSES
// hanya dipakai <option> dropdown, yang memang tidak bisa memuat SVG).
const CLASS_ICONS: Record<string, LucideIcon> = {
  all: LayoutGrid,
  Aves: Bird,
  Reptilia: Turtle,
  Mammalia: Rabbit,
  Amphibia: Turtle,
};

/**
 * RAIL KELAS TAKSON + LEGENDA STATUS KONSERVASI.
 *
 * Legenda status ikut di rail karena inilah satu-satunya tempat pembaca bisa
 * belajar arti kode IUCN sambil daftarnya terlihat. Sebelumnya badge status
 * muncul di tiap kartu tanpa kunci baca di mana pun, jadi "VU" tidak berarti
 * apa-apa bagi pengunjung yang bukan ahli — padahal justru merekalah audiens
 * arsip desa ini.
 */
export function FaunaClassRail({
  classes,
  activeClass,
  activeQ,
  totalCount,
  statusCounts,
}: FaunaClassRailProps) {
  const current = (activeClass || "all").trim();

  const hrefFor = (value: string) => {
    const params = new URLSearchParams();
    if (value !== "all") params.set("class", value);
    if (activeQ) params.set("q", activeQ);
    const qs = params.toString();
    return qs ? `/fauna-obi?${qs}` : "/fauna-obi";
  };

  const presentStatuses = IUCN_ORDER.filter((code) => (statusCounts[code] ?? 0) > 0);

  return (
    <div className="lg:sticky lg:top-28 lg:self-start space-y-8 min-w-0 max-w-full">
      {/* ── Kelas takson ── */}
      <nav aria-label="Saring kelas satwa">
        <p className="hidden lg:block text-label-sm font-black uppercase tracking-[0.16em] text-on-surface-variant mb-3">
          Kelas Takson
        </p>

        {/* Layar lebar: daftar vertikal */}
        <ul className="hidden lg:block border-t-2 border-on-surface">
          {classes.map((cls) => {
            const isActive = current === cls.value;
            const Icon = CLASS_ICONS[cls.value] ?? CLASS_ICONS.all;
            const count = cls.value === "all" ? totalCount : cls.count;

            return (
              <li key={cls.value} className="border-b-2 border-outline-variant">
                <Link
                  href={hrefFor(cls.value)}
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
                    className={`flex-1 text-label-md uppercase tracking-wider ${
                      isActive ? "font-black text-on-surface" : "font-bold text-on-surface-variant"
                    }`}
                  >
                    {cls.label}
                  </span>
                  <span className="text-label-sm font-black tabular text-on-surface-variant/70">
                    {count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Layar sempit: chip mendatar */}
        <div className="lg:hidden min-w-0 max-w-full -mx-4 px-4 sm:-mx-6 sm:px-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {classes.map((cls) => {
              const isActive = current === cls.value;
              const Icon = CLASS_ICONS[cls.value] ?? CLASS_ICONS.all;
              const count = cls.value === "all" ? totalCount : cls.count;

              return (
                <Link
                  key={cls.value}
                  href={hrefFor(cls.value)}
                  aria-current={isActive ? "page" : undefined}
                  className={`shrink-0 inline-flex items-center gap-2 px-3.5 h-11 rounded-full border-2 border-on-surface text-label-sm font-black uppercase tracking-wider transition-all duration-150 press-effect ${
                    isActive
                      ? "bg-primary text-on-primary hard-shadow-sm"
                      : "bg-background text-on-surface-variant"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                  {cls.label}
                  <span className="tabular opacity-70">{count}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ── Legenda status konservasi (desktop) ── */}
      {presentStatuses.length > 0 && (
        <section className="hidden lg:block" aria-label="Keterangan status konservasi IUCN">
          <p className="text-label-sm font-black uppercase tracking-[0.16em] text-on-surface-variant mb-3">
            Status IUCN
          </p>
          <ul className="space-y-1.5">
            {presentStatuses.map((code) => (
              <li key={code} className="flex items-center gap-2.5">
                <span
                  className={`w-8 shrink-0 text-center px-1 py-0.5 rounded-md text-label-sm font-black ${IUCN_STYLES[code]}`}
                >
                  {code}
                </span>
                <span className="flex-1 text-label-sm font-bold text-on-surface-variant leading-tight">
                  {IUCN_LABELS[code]}
                </span>
                <span className="text-label-sm font-black tabular text-on-surface-variant/70">
                  {statusCounts[code]}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
