import Image from "next/image";
import Link from "next/link";
import { Sprout, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/admin/DeleteButton";
import type { TogaPlant } from "@/constants/toga";
import { TOGA_ACCENT_BORDERS } from "./togaCardStyles";

type AdminTogaCardProps = {
  plant: TogaPlant;
  index?: number;
};

export function AdminTogaCard({ plant, index = 0 }: AdminTogaCardProps) {
  const accentBorder = TOGA_ACCENT_BORDERS[index % TOGA_ACCENT_BORDERS.length];
  const benefitCount = plant.health_benefits?.length ?? 0;

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border-4 bg-background hard-shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:hard-shadow-lg ${accentBorder}`}
    >
      <div className="relative h-48 shrink-0 border-b-2 border-on-surface bg-surface-container-high">
        {plant.thumbnail_url ? (
          <Image
            src={plant.thumbnail_url}
            alt={plant.name_id}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
            <Sprout className="size-14 stroke-[1.25]" aria-hidden="true" />
          </div>
        )}
        {benefitCount > 0 && (
          <Badge variant="solid-cream" className="absolute right-2 top-2">
            {benefitCount} Khasiat
          </Badge>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
          {plant.name_id}
        </h3>
        <p className="text-sm italic font-bold text-on-cream">{plant.name_latin}</p>
        {plant.description && (
          <p className="line-clamp-2 text-sm text-on-surface-variant">{plant.description}</p>
        )}

        {/* Kiri-kanan, dibungkus grid (bukan flex) supaya tombol di dalamnya
            SAMA-SAMA otomatis melebar penuh mengikuti kolomnya — default CSS
            Grid men-stretch child tunggal tanpa perlu class tambahan apa pun
            di elemen anak, beda dengan flexbox yang butuh flex-grow eksplisit. */}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <div className="grid flex-1">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/toga/${plant.id}`}>
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </div>
          <div className="grid flex-1">
            <DeleteButton
              table="toga_plants"
              id={plant.id}
              title={plant.name_id}
              redirectAfter="/admin/toga"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
