// app/profil/page.tsx
import InteractiveMap from "@/components/kkn/InteractiveMap";

export default function ProfilPage() {
  return (
    <main className="min-h-screen bg-natural-paper py-16 px-6 border-b-4 border-on-surface">
      <div className="max-w-6xl mx-auto">
        {/* Header Halaman */}
        <div className="text-center mb-16">
          <div className="inline-block bg-primary text-on-primary px-4 py-1.5 font-semibold text-sm uppercase tracking-wider mb-4 hard-shadow-sm">
            Eksplorasi Wilayah
          </div>
          <h1 className="font-serif text-5xl md:text-6xl font-bold text-on-surface mb-4">
            Profil Wilayah <span className="italic text-primary">Obira</span>
          </h1>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Jelajahi potensi, demografi, dan kearifan lokal Desa Kawasi dan Desa
            Soligi melalui peta interaktif di bawah ini.
          </p>
        </div>

        {/* Render Komponen Peta Interaktif */}
        <InteractiveMap />
      </div>
    </main>
  );
}