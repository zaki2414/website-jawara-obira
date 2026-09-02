import Image from "next/image";
import Link from "next/link";
import { Newspaper, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/utils";
import { BERITA_ACCENT_BORDERS, getNewsVillageTags } from "./beritaCardStyles";

export type AdminBeritaCardData = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  author_name: string | null;
  published_at: string;
  villages: { name: string; slug?: string } | null;
};

type AdminBeritaCardProps = {
  item: AdminBeritaCardData;
  index?: number;
};

export function AdminBeritaCard({ item, index = 0 }: AdminBeritaCardProps) {
  const accentBorder = BERITA_ACCENT_BORDERS[index % BERITA_ACCENT_BORDERS.length];

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border-4 bg-background hard-shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:hard-shadow-lg ${accentBorder}`}
    >
      <div className="relative h-48 shrink-0 border-b-2 border-on-surface bg-surface-container-high">
        {item.thumbnail_url ? (
          <Image
            src={item.thumbnail_url}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
            <Newspaper className="size-14 stroke-[1.25]" aria-hidden="true" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1.5">
          {getNewsVillageTags(item.villages?.name).map((tag) => (
            <Badge key={tag} variant="solid-outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="line-clamp-2 font-serif text-lg font-black leading-snug text-on-surface">
          {item.title}
        </h3>
        <p className="text-sm font-bold uppercase tracking-wide text-on-cream">
          {item.author_name || "Admin"}
        </p>
        <p className="text-sm text-on-surface-variant">
          {formatDate(item.published_at, { month: "short" })}
        </p>

        {/* Kiri-kanan, dibungkus grid (bukan flex) supaya tombol di dalamnya
            SAMA-SAMA otomatis melebar penuh mengikuti kolomnya — default CSS
            Grid men-stretch child tunggal tanpa perlu class tambahan apa pun
            di elemen anak, beda dengan flexbox yang butuh flex-grow eksplisit. */}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <div className="grid flex-1">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/berita/${item.id}`}>
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </div>
          <div className="grid flex-1">
            <DeleteButton table="news" id={item.id} title={item.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
