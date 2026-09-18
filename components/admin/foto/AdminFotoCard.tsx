import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import DeleteButton from "@/components/admin/DeleteButton";
import { formatDate } from "@/lib/utils";
import type { GalleryItem } from "@/constants/galeri";
import { FOTO_ACCENT_BORDERS } from "./fotoCardStyles";

type AdminFotoCardProps = {
  photo: GalleryItem;
  index?: number;
};

// Tidak ada rute edit-by-id untuk foto galeri (upload-only, sesuai model data
// saat ini) — kartu ini hanya punya aksi Hapus, karenanya tombolnya melebar
// penuh (bukan dibagi 2 seperti kartu Fauna/Budaya yang punya Edit+Hapus).
export function AdminFotoCard({ photo, index = 0 }: AdminFotoCardProps) {
  const accentBorder = FOTO_ACCENT_BORDERS[index % FOTO_ACCENT_BORDERS.length];

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border-4 bg-background hard-shadow-lg hard-shadow-hover ${accentBorder}`}
    >
      <div className="relative h-48 shrink-0 border-b-2 border-on-surface bg-surface-container-high">
        <Image
          src={photo.image_url}
          alt={photo.title || "Foto galeri"}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <Badge variant="solid-tertiary" className="absolute right-2 top-2">
          <ImageIcon className="size-3" aria-hidden="true" />
          {photo.category || "Umum"}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
          {photo.title || "Tanpa Judul"}
        </h3>
        {photo.description && (
          <p className="line-clamp-2 text-sm text-on-surface-variant">{photo.description}</p>
        )}
        {photo.uploaded_at && (
          <p className="text-sm text-on-surface-variant/80">
            Diunggah {formatDate(photo.uploaded_at, { month: "short" })}
          </p>
        )}

        <div className="mt-auto grid pt-4">
          <DeleteButton table="galleries" id={photo.id} title={photo.title || "foto ini"} />
        </div>
      </div>
    </div>
  );
}
