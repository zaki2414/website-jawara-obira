// app/profil/page.tsx
import InteractiveMap from "@/components/kkn/InteractiveMap";
import Link from "next/link";

export default function ProfilPage() {
  return (
    <main className="min-h-screen bg-sand-50/50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Halaman */}
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-ocean-800 mb-4">
            Profil Wilayah
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Jelajahi potensi, demografi, dan keunikan Desa Kawasi dan Desa Soligi 
            melalui peta interaktif di bawah ini.
          </p>
        </div>

        {/* Render Komponen Peta Interaktif */}
        <InteractiveMap />
        
      </div>
    </main>
  );
}