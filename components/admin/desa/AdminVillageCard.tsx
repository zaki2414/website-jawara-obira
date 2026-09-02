import Image from "next/image";
import Link from "next/link";
import { Pencil, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VILLAGE_VISUAL_META, type VillageKey } from "@/constants/profil";

// Bentuk baris mentah dari getAllVillages() (lib/supabase/queries.ts) — TIDAK
// pakai VillageContent (tipe untuk halaman publik yang sudah digabung dengan
// meta visual & id-nya SENGAJA VillageKey, bukan UUID baris DB) supaya tidak
// ada tabrakan makna field `id` antara UUID (dibutuhkan untuk link edit) dan
// VillageKey.
type AdminVillageRow = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  long_description: string | null;
  thumbnail_url: string | null;
};

type AdminVillageCardProps = {
  village: AdminVillageRow;
};

// Tidak ada rute "Tambah"/tombol Hapus di sini — sama seperti
// AdminFacilityCard.tsx (admin/peta): baris `villages` sudah tetap (cuma
// Kawasi & Soligi, tidak pernah ada desa baru), admin cuma melengkapi
// konten lewat Edit.
export function AdminVillageCard({ village }: AdminVillageCardProps) {
  const Icon = VILLAGE_VISUAL_META[village.slug as VillageKey]?.icon ?? MapPin;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border-4 border-on-surface bg-background hard-shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:hard-shadow-lg">
      <div className="relative h-48 shrink-0 border-b-2 border-on-surface bg-surface-container-high">
        {village.thumbnail_url ? (
          <Image
            src={village.thumbnail_url}
            alt={village.name}
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
          <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
          {village.name}
        </h3>
        <p className="line-clamp-2 text-sm text-on-surface-variant">
          {village.title || village.long_description || "Belum ada konten — lengkapi lewat Edit."}
        </p>

        <div className="mt-auto grid pt-4">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/desa/${village.id}`}>
              <Pencil className="size-3.5" aria-hidden="true" />
              Edit
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
