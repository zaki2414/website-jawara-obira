// app/kkn/tim/page.tsx
import { getAllKKNTeamMembers } from "@/lib/supabase/queries";
import Image from "next/image";
import { User, MapPin } from "lucide-react";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";
import { KKNTeamHero } from "@/components/kkn/KKNTeamHero";
import { KAWASI_TEAM_ACCENT_BORDERS, SOLIGI_TEAM_ACCENT_BORDERS } from "@/components/kkn/kknCardStyles";

const SECTION_ACCENTS = {
  kawasi: { pill: "bg-primary text-on-primary", chip: "bg-primary-container/25 text-primary border-primary/30" },
  soligi: { pill: "bg-tertiary text-on-tertiary", chip: "bg-tertiary-container/35 text-on-tertiary border-tertiary/40" },
} as const;

type TeamMember = {
  id: string;
  name: string;
  cluster: string | null;
  study_program: string | null;
  photo_url: string | null;
  village_placement: string;
};

export default async function KKNTeamPage() {
  const { data, error } = await getAllKKNTeamMembers();
  const members = data as unknown as TeamMember[] | null;

  if (error) {
    return (
      <div className="min-h-screen bg-natural-paper p-8 flex items-center justify-center">
        <div className="bg-background p-6 border-2 border-error rounded-xl max-w-md hard-shadow-sm text-center">
          <p className="font-serif font-black text-error text-lg mb-2">Gagal Memuat Data</p>
          <p className="text-sm text-on-surface-variant font-medium">{String(error)}</p>
        </div>
      </div>
    );
  }

  const kawasi =
    members?.filter(
      (m) => m.village_placement === "kawasi" || m.village_placement === "both",
    ) || [];
  const soligi =
    members?.filter(
      (m) => m.village_placement === "soligi" || m.village_placement === "both",
    ) || [];

  const renderGrid = (
    title: string,
    list: TeamMember[],
    accentKey: keyof typeof SECTION_ACCENTS,
  ) => {
    const accent = SECTION_ACCENTS[accentKey];
    return (
    <div className="mb-16">
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 font-serif font-black text-lg border-2 border-on-surface rounded-full mb-8 hard-shadow-sm ${accent.pill}`}>
        <MapPin className="w-4 h-4" aria-hidden="true" /> {title} ({list.length})
      </div>

      {/* RESPONSIVE GRID GRID-COLS FIXED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((m, index) => {
          const borders = accentKey === "kawasi" ? KAWASI_TEAM_ACCENT_BORDERS : SOLIGI_TEAM_ACCENT_BORDERS;
          const borderColor = borders[index % borders.length];
          return (
          <div
            key={m.id}
            className={`border-4 ${borderColor} rounded-2xl overflow-hidden bg-background hard-shadow hard-shadow-hover transition-all flex flex-col`}
          >
            {/* Foto Profil */}
            <div className={`relative h-64 bg-surface-container-high border-b-2 ${borderColor}`}>
              {m.photo_url ? (
                <Image
                  src={m.photo_url}
                  alt={m.name}
                  fill
                  className="object-cover"
                  loading="eager"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface-container text-on-surface-variant/40">
                  <User className="w-16 h-16 stroke-[1.25]" aria-hidden="true" />
                </div>
              )}
            </div>

            {/* Informasi Anggota */}
            <div className="p-4 flex-1 flex flex-col justify-between bg-background">
              <div>
                <h3 className="font-serif font-black text-lg text-on-surface leading-snug tracking-tight mb-1">
                  {m.name}
                </h3>
                <p className="text-label-sm font-bold text-primary tracking-wide uppercase mb-2">
                  {m.study_program}
                </p>
              </div>

              <div className="pt-3 border-t border-dashed border-outline-variant mt-2">
                <span className={`inline-block px-2 py-0.5 text-label-sm font-black uppercase tracking-wider border-2 rounded ${accent.chip}`}>
                  {m.cluster || "—"}
                </span>
              </div>
            </div>
          </div>
          );
        })}
      </div>
    </div>
    );
  };

  return (
    <main className="relative min-h-screen bg-natural-paper py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <KknPageBackground />

      <div className="relative max-w-6xl mx-auto z-10">
        <KKNTeamHero totalCount={members?.length ?? 0} />

        {renderGrid("Desa Kawasi", kawasi, "kawasi")}
        {renderGrid("Desa Soligi", soligi, "soligi")}
      </div>
    </main>
  );
}