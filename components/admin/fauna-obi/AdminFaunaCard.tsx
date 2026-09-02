import Image from "next/image";
import Link from "next/link";
import { Bird, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/admin/DeleteButton";
import { getIucnBrutalistClass, type Fauna } from "@/constants/fauna";
import { FAUNA_ACCENT_BORDERS } from "./faunaCardStyles";

type AdminFaunaCardProps = {
  fauna: Fauna;
  index?: number;
};

export function AdminFaunaCard({ fauna, index = 0 }: AdminFaunaCardProps) {
  const accentBorder = FAUNA_ACCENT_BORDERS[index % FAUNA_ACCENT_BORDERS.length];

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border-4 bg-background hard-shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:hard-shadow-lg ${accentBorder}`}
    >
      <div className="relative h-48 shrink-0 border-b-2 border-on-surface bg-surface-container-high">
        {fauna.thumbnail_url ? (
          <Image
            src={fauna.thumbnail_url}
            alt={fauna.name_local}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
            <Bird className="size-14 stroke-[1.25]" aria-hidden="true" />
          </div>
        )}
        {/* Status IUCN TIDAK ikut diretint ke cream — warnanya semantik
            (merah=terancam, dst.), disengaja dipertahankan apa adanya
            terlepas dari aksen warna section, per CLAUDE.md. */}
        {fauna.iucn_status && (
          <span
            className={`absolute right-2 top-2 inline-flex rounded-full border-2 border-on-surface px-2.5 py-1 text-label-md font-black uppercase tracking-wide ${getIucnBrutalistClass(fauna.iucn_status)}`}
          >
            {fauna.iucn_status}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
          {fauna.name_local}
        </h3>
        <p className="text-sm italic font-bold text-on-cream">{fauna.name_scientific}</p>
        <p className="text-sm text-on-surface-variant">{fauna.class || "Kelas belum diisi"}</p>

        {/* Kiri-kanan, dibungkus grid (bukan flex) supaya tombol di dalamnya
            SAMA-SAMA otomatis melebar penuh mengikuti kolomnya — default CSS
            Grid men-stretch child tunggal tanpa perlu class tambahan apa pun
            di elemen anak, beda dengan flexbox yang butuh flex-grow eksplisit. */}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <div className="grid flex-1">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/fauna-obi/${fauna.id}`}>
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </div>
          <div className="grid flex-1">
            <DeleteButton
              table="fauna_obi"
              id={fauna.id}
              title={fauna.name_local}
              redirectAfter="/admin/fauna-obi"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
