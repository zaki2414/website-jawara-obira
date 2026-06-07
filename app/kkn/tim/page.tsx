// app/kkn/tim/page.tsx
import { getAllKKNTeamMembers } from "@/lib/supabase/queries";
import Image from "next/image";

export default async function KKNTeamPage() {
  const { data: members, error } = await getAllKKNTeamMembers();
  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-600">Error: {String(error)}</p>
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
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-ocean-800">{title}</h2>
      <div className="grid grid-cols-4 gap-6">
        {list.map((m) => (
          <div
            key={m.id}
            className="border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition"
          >
            {/* Foto */}
            <div className="relative h-60 bg-gray-200">
              {m.photo_url ? (
                <Image
                  src={m.photo_url}
                  alt={m.name}
                  fill
                  className="object-cover"
                  loading="eager"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-300">
                  👤
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-bold text-gray-800 mb-1">{m.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{m.study_program}</p>
              <p className="text-sm text-gray-500">{m.cluster}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8 text-ocean-800">Tim KKN</h1>
      {renderGrid("Desa Kawasi", kawasi)}
      {renderGrid("Desa Soligi", soligi)}
    </main>
  );
}
