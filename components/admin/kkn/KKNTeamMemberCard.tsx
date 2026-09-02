import Image from "next/image";
import Link from "next/link";
import { Pencil, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import DeleteButton from "@/components/admin/DeleteButton";
import { KKN_ACCENT_BORDERS } from "./kknCardStyles";

// "both" TETAP tampil sebagai 2 tag terpisah (Kawasi + Soligi), bukan
// digabung jadi satu teks/badge — desa adalah dua entitas berbeda, jangan
// disatukan posisinya di layout. Diekspor supaya KKNTeamForm.tsx (pratinjau
// kartu) bisa pakai logika & label yang sama persis, tidak duplikasi.
export function getVillageTags(placement: string): string[] {
  if (placement === "both") return ["Kawasi", "Soligi"];
  if (placement === "kawasi") return ["Kawasi"];
  if (placement === "soligi") return ["Soligi"];
  return [placement];
}

export type KKNTeamMemberCardData = {
  id: string;
  name: string;
  cluster: string;
  study_program: string;
  photo_url: string | null;
  village_placement: string;
};

type KKNTeamMemberCardProps = {
  member: KKNTeamMemberCardData;
  index?: number;
};

export function KKNTeamMemberCard({ member, index = 0 }: KKNTeamMemberCardProps) {
  const accentBorder = KKN_ACCENT_BORDERS[index % KKN_ACCENT_BORDERS.length];

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-2xl border-4 bg-background hard-shadow-lg transition-all duration-200 hover:-translate-y-1.5 hover:hard-shadow-lg ${accentBorder}`}
    >
      <div className="relative h-48 shrink-0 border-b-2 border-on-surface bg-surface-container-high">
        {member.photo_url ? (
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
            <User className="size-14 stroke-[1.25]" aria-hidden="true" />
          </div>
        )}
        <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1.5">
          {getVillageTags(member.village_placement).map((tag) => (
            <Badge key={tag} variant="solid-outline">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
          {member.name}
        </h3>
        <p className="text-sm font-bold uppercase tracking-wide text-on-tertiary">
          {member.cluster}
        </p>
        <p className="text-sm text-on-surface-variant">{member.study_program}</p>

        {/* Kiri-kanan, dibungkus grid (bukan flex) supaya tombol di dalamnya
            (elemen <a>/<button>, tipe berbeda) SAMA-SAMA otomatis melebar
            penuh mengikuti kolomnya — default CSS Grid men-stretch child
            tunggal tanpa perlu class tambahan apa pun di elemen anak,
            beda dengan flexbox yang butuh flex-grow eksplisit di anaknya. */}
        <div className="mt-auto flex flex-wrap gap-2 pt-4">
          <div className="grid flex-1">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/admin/kkn/tim/${member.id}`}>
                <Pencil className="size-3.5" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </div>
          <div className="grid flex-1">
            <DeleteButton
              table="kkn_members"
              id={member.id}
              title={member.name}
              redirectAfter="/admin/kkn/tim"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
