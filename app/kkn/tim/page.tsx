// app/kkn/tim/page.tsx
import { getAllKKNTeamMembers } from "@/lib/supabase/queries";
import Image from "next/image";
import { User, MapPin } from "lucide-react";

export default async function KKNTeamPage() {
  const { data: members, error } = await getAllKKNTeamMembers();
  
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

  const renderGrid = (title: string, list: any[]) => (
    <div className="mb-16">
      <div className="inline-flex items-center gap-2 bg-on-surface text-background px-4 py-1.5 font-serif font-black text-lg uppercase tracking-wider border-2 border-on-surface mb-8 hard-shadow-sm">
        <MapPin className="w-4 h-4" /> {title} ({list.length})
      </div>

      {/* RESPONSIVE GRID GRID-COLS FIXED */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {list.map((m) => (
          <div
            key={m.id}
            className="border-2 border-on-surface rounded-2xl overflow-hidden bg-background hard-shadow-sm hover:-translate-y-1 hover:hard-shadow-md transition-all duration-150 flex flex-col"
          >
            {/* Foto Profil */}
            <div className="relative h-64 bg-surface-container-high border-b-2 border-on-surface">
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
                  <User className="w-16 h-16 stroke-[1.25]" />
                </div>
              )}
            </div>

            {/* Informasi Anggota */}
            <div className="p-4 flex-1 flex flex-col justify-between bg-background">
              <div>
                <h3 className="font-serif font-black text-lg text-on-surface leading-snug tracking-tight mb-1">
                  {m.name}
                </h3>
                <p className="text-xs font-bold text-primary tracking-wide uppercase mb-2">
                  {m.study_program}
                </p>
              </div>
              
              <div className="pt-3 border-t border-dashed border-outline-variant mt-2">
                <span className="inline-block px-2 py-0.5 text-[10px] font-black uppercase tracking-wider bg-surface-container border border-on-surface rounded">
                  {m.cluster || "—"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-aged-paper py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <header className="border-b-4 border-on-surface pb-6 mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-black text-on-surface tracking-tight">
            Anggota Tim KKN Jawara Obira 2026
          </h1>
        </header>

        {renderGrid("Desa Kawasi", kawasi)}
        {renderGrid("Desa Soligi", soligi)}
      </div>
    </main>
  );
}