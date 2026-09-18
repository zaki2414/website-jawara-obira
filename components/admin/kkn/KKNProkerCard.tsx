import Image from "next/image";
import Link from "next/link";
import { Pencil, Rocket } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/admin/DeleteButton";
import { getJournalVillageTags, KKN_ACCENT_BORDERS } from "./kknCardStyles";

export type KKNProkerCardData = {
  id: string;
  title: string;
  image_url: string | null;
  short_description: string | null;
  villages: { name: string; slug: string } | null;
};

type KKNProkerCardProps = {
  proker: KKNProkerCardData;
  index?: number;
};

export function KKNProkerCard({ proker, index = 0 }: KKNProkerCardProps) {
  const accentBorder = KKN_ACCENT_BORDERS[index % KKN_ACCENT_BORDERS.length];

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border-4 bg-background hard-shadow-lg hard-shadow-hover ${accentBorder}`}
    >
      <div className="relative h-48 shrink-0 border-b-2 border-on-surface bg-surface-container-high">
        {proker.image_url ? (
          <Image
            src={proker.image_url}
            alt={proker.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
            <Rocket className="size-14 stroke-[1.25]" aria-hidden="true" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1.5">
          {getJournalVillageTags(proker.villages?.name).map((tag) => (
            <Badge key={tag} variant="solid-outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
          {proker.title}
        </h3>
        <p className="line-clamp-2 text-sm text-on-surface-variant">
          {proker.short_description || "Belum ada deskripsi singkat."}
        </p>

        {/* Kiri-kanan, dibungkus grid (bukan flex) supaya tombol di dalamnya
            SAMA-SAMA otomatis melebar penuh mengikuti kolomnya — default CSS
            Grid men-stretch child tunggal tanpa perlu class tambahan apa pun
            di elemen anak, beda dengan flexbox yang butuh flex-grow eksplisit. */}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <div className="grid flex-1">
            <Button asChild variant="ghost" size="sm">
              <Link prefetch={false} href={`/admin/kkn/proker/${proker.id}`}>
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </div>
          <div className="grid flex-1">
            <DeleteButton
              table="kkn_prokers"
              id={proker.id}
              title={proker.title}
              redirectAfter="/admin/kkn/proker"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
