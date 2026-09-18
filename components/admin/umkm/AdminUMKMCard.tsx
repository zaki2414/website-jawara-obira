import Image from "next/image";
import Link from "next/link";
import { Store, Pencil, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/admin/DeleteButton";
import { formatBusinessType } from "@/constants/umkm";
import { UMKM_ACCENT_BORDERS, getUMKMVillageTags } from "./umkmCardStyles";

export type AdminUMKMCardData = {
  id: string;
  name: string;
  slug: string;
  business_type: string | null;
  short_description: string | null;
  location_text: string | null;
  thumbnail_url: string | null;
  villages: { name: string } | null;
};

type AdminUMKMCardProps = {
  item: AdminUMKMCardData;
  index?: number;
};

export function AdminUMKMCard({ item, index = 0 }: AdminUMKMCardProps) {
  const accentBorder = UMKM_ACCENT_BORDERS[index % UMKM_ACCENT_BORDERS.length];

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border-4 bg-background hard-shadow-lg hard-shadow-hover ${accentBorder}`}
    >
      <div className="relative h-48 shrink-0 border-b-2 border-on-surface bg-surface-container-high">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
            <Store className="size-14 stroke-[1.25]" aria-hidden="true" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1.5">
          {getUMKMVillageTags(item.villages?.name).map((tag) => (
            <Badge key={tag} variant="solid-outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
          {item.name}
        </h3>
        <p className="text-sm font-bold uppercase tracking-wide text-on-cream">
          {item.business_type ? formatBusinessType(item.business_type) : "Jenis belum diisi"}
        </p>
        {item.location_text && (
          <p className="flex items-center gap-1.5 text-sm text-on-surface-variant">
            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
            {item.location_text}
          </p>
        )}
        {item.short_description && (
          <p className="line-clamp-2 text-sm text-on-surface-variant">
            {item.short_description}
          </p>
        )}

        {/* Kiri-kanan, dibungkus grid (bukan flex) supaya tombol di dalamnya
            SAMA-SAMA otomatis melebar penuh mengikuti kolomnya — default CSS
            Grid men-stretch child tunggal tanpa perlu class tambahan apa pun
            di elemen anak, beda dengan flexbox yang butuh flex-grow eksplisit. */}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <div className="grid flex-1">
            <Button asChild variant="ghost" size="sm">
              <Link prefetch={false} href={`/admin/umkm/${item.id}`}>
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </div>
          <div className="grid flex-1">
            <DeleteButton table="umkm" id={item.id} title={item.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
