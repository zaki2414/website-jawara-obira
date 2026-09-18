import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FACILITY_ICON_BY_NAME, DEFAULT_FACILITY_ICON, type MapFacility } from "@/constants/peta";
import { PETA_ACCENT_BORDERS } from "./petaCardStyles";

type AdminFacilityCardProps = {
  facility: MapFacility;
  index?: number;
};

// Tidak ada rute "Tambah"/tombol Hapus di sini — baris map_facilities sudah
// tetap (seed 1:1 dengan feature_id di public/data/fasum.geojson dan
// fasum-soligi.geojson), admin cuma melengkapi deskripsi + foto lewat Edit.
export function AdminFacilityCard({ facility, index = 0 }: AdminFacilityCardProps) {
  const accentBorder = PETA_ACCENT_BORDERS[index % PETA_ACCENT_BORDERS.length];
  const Icon = FACILITY_ICON_BY_NAME[facility.name] ?? DEFAULT_FACILITY_ICON;

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border-4 bg-background hard-shadow-lg hard-shadow-hover ${accentBorder}`}
    >
      <div className="relative h-48 shrink-0 border-b-2 border-on-surface bg-surface-container-high">
        {facility.photo_url ? (
          <Image
            src={facility.photo_url}
            alt={facility.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
            <Icon className="size-14 stroke-[1.25]" aria-hidden="true" />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="flex items-center gap-2 font-serif text-lg font-black leading-snug text-on-surface">
          <Icon className="size-4 shrink-0 text-on-tertiary" aria-hidden="true" />
          {facility.name}
        </h3>
        <p className="line-clamp-2 text-sm text-on-surface-variant">
          {facility.description || "Belum ada deskripsi."}
        </p>

        <div className="mt-auto grid pt-4">
          <Button asChild variant="ghost" size="sm">
            <Link prefetch={false} href={`/admin/peta/${facility.id}`}>
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
