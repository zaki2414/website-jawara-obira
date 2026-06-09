// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Info,
  Newspaper,
  Users,
  User,
  Trees,
  Store,
  Waves,
  Shrub,
  BookOpen,
  Award,
  Camera,
  ChevronRight,
  ArrowRight,
  Sprout,
  Bird,
  Palette,
  HeartHandshake,
} from "lucide-react";

// ==========================================
// DATA CONSTANTS (Diekstrak agar JSX bersih)
// ==========================================

const VILLAGE_STATS = [
  { icon: Users, number: "2", label: "Desa" },
  { icon: User, number: "1,200+", label: "Penduduk" },
  { icon: Trees, number: "85%", label: "Hutan Tropis" },
  { icon: Store, number: "45+", label: "UMKM Aktif" },
];

const VILLAGES = [
  {
    name: "Desa Kawasi",
    location: "Pesisir Timur Pulau Obi",
    desc: "Desa pesisir dengan kekayaan laut dan tradisi gotong royong yang kuat. Pusat kegiatan pemberdayaan UMKM dan pelestarian budaya maritim.",
    features: ["Potensi Perikanan", "Budaya Maritim", "UMKM Kerajinan"],
    icon: Waves,
    color: "bg-ocean-100",
    accent: "text-ocean-700",
    border: "border-ocean-700",
  },
  {
    name: "Desa Soligi",
    location: "Pedalaman Pulau Obi",
    desc: "Desa pedalaman dengan hutan tropis yang masih asri. Kaya akan biodiversitas, tanaman obat keluarga, dan kearifan lokal dalam menjaga alam.",
    features: ["Hutan Tropis", "TOGA", "Biodiversitas"],
    icon: Shrub,
    color: "bg-tropic-100",
    accent: "text-tropic-700",
    border: "border-tropic-700",
  },
];

const POTENSI_DESA = [
  {
    href: "/fauna-obi",
    icon: Bird,
    title: "Fauna Endemik",
    desc: "Inventarisasi herpetofauna dan satwa endemik yang hanya ada di Pulau Obi.",
    color: "bg-sand-100",
    accent: "text-sand-800",
    border: "border-sand-800",
  },
  {
    href: "/toga",
    icon: Sprout,
    title: "Tanaman Obat",
    desc: "Ensiklopedia digital TOGA (Tanaman Obat Keluarga) khas Maluku Utara.",
    color: "bg-tropic-100",
    accent: "text-tropic-800",
    border: "border-tropic-800",
  },
  {
    href: "/umkm",
    icon: Store,
    title: "UMKM Lokal",
    desc: "Direktori usaha mikro kecil menengah dari kedua desa.",
    color: "bg-tertiary-fixed",
    accent: "text-tertiary",
    border: "border-tertiary",
  },
  {
    href: "/budaya",
    icon: Palette,
    title: "Budaya & Tradisi",
    desc: "Dokumentasi kearifan lokal, tradisi, dan kesenian masyarakat.",
    color: "bg-primary-fixed",
    accent: "text-primary",
    border: "border-primary",
  },
  {
    href: "/galeri",
    icon: Camera,
    title: "Galeri Desa",
    desc: "Dokumentasi visual kehidupan sehari-hari dan keindahan alam.",
    color: "bg-ocean-100",
    accent: "text-ocean-700",
    border: "border-ocean-700",
  },
  {
    href: "/berita",
    icon: Newspaper,
    title: "Berita Desa",
    desc: "Update terkini kegiatan dan perkembangan desa.",
    color: "bg-surface-container-high",
    accent: "text-on-surface",
    border: "border-on-surface",
  },
];

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ============ HERO SECTION ============ */}
      <section className="relative bg-natural-paper overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-tertiary rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-primary-container/30 border-2 border-on-surface px-5 py-2 rounded-full hard-shadow-sm">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm font-semibold text-on-surface tracking-wide uppercase">
                  Pulau Obi • Maluku Utara
                </span>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl font-bold text-on-surface leading-[1.05]">
                Selamat Datang di
                <br />
                <span className="text-primary italic">Pulau Obi</span>
              </h1>

              <p className="text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed">
                Dua desa yang kaya akan budaya, biodiversitas, dan kearifan
                lokal. Mengenal lebih dekat <strong>Desa Kawasi</strong> dan{" "}
                <strong>Desa Soligi</strong>.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/profil"
                  className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 font-semibold rounded-lg hard-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Info className="w-5 h-5" />
                  Profil Desa
                </Link>
                <Link
                  href="/berita"
                  className="inline-flex items-center gap-2 bg-background border-2 border-on-surface text-on-surface px-6 py-3 font-semibold rounded-lg hard-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all"
                >
                  <Newspaper className="w-5 h-5" />
                  Berita Terkini
                </Link>
              </div>
            </div>

            {/* Right: Hero Visual */}
            <div className="relative">
              <div className="relative aspect-[4/3] max-w-lg mx-auto">
                <div className="absolute inset-0 bg-primary hard-shadow-lg rounded-xl overflow-hidden rotate-2">
                  <Image
                    src="/placeholder-hero.jpg" // TODO: Ganti dengan path gambar aslimu
                    alt="Pemandangan Pulau Obi"
                    fill
                    className="object-cover mix-blend-multiply opacity-90"
                    priority
                  />
                </div>
                <div className="absolute -top-4 -left-4 w-full h-full border-4 border-tertiary rounded-xl -rotate-2" />
                <div className="absolute -bottom-6 -right-6 bg-tertiary text-on-tertiary px-6 py-4 rounded-xl hard-shadow rotate-3">
                  <div className="text-3xl font-serif font-bold">2</div>
                  <div className="text-xs uppercase tracking-wider">
                    Desa Dampingan
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ VILLAGE STATS ============ */}
      <section className="bg-on-surface text-background border-y-4 border-on-surface">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {VILLAGE_STATS.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <stat.icon className="w-7 h-7 text-primary-container" />
                </div>
                <div className="font-serif text-4xl md:text-5xl font-bold text-primary-container">
                  {stat.number}
                </div>
                <div className="text-xs md:text-sm uppercase tracking-wider text-background/70 mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TWO VILLAGES SECTION ============ */}
      <section className="bg-aged-paper py-24 border-b-4 border-on-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block bg-on-surface text-background px-4 py-1.5 font-semibold text-sm uppercase tracking-wider mb-4 hard-shadow-sm">
              Desa Dampingan
            </div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-on-surface leading-tight">
              Mengenal{" "}
              <span className="italic text-primary">Kawasi & Soligi</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {VILLAGES.map((village, i) => (
              <div
                key={i}
                className={`bg-background border-2 ${village.border} rounded-xl p-10 hard-shadow hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all`}
              >
                <div
                  className={`inline-flex items-center justify-center w-20 h-20 ${village.color} rounded-xl mb-6 border-2 ${village.border}`}
                >
                  <village.icon className={`w-10 h-10 ${village.accent}`} />
                </div>
                <h3 className="font-serif text-3xl font-bold text-on-surface mb-3">
                  {village.name}
                </h3>
                <p className="text-sm text-on-surface-variant mb-5 italic flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {village.location}
                </p>
                <p className="text-on-surface-variant leading-relaxed mb-6">
                  {village.desc}
                </p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {village.features.map((feature) => (
                    <span
                      key={feature}
                      className="bg-surface-container-high border border-on-surface px-3 py-1.5 text-xs font-medium rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/profil?desa=${village.name.split(" ")[1].toLowerCase()}`}
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${village.accent} hover:underline`}
                >
                  Selengkapnya
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POTENSI DESA ============ */}
      <section className="bg-background py-24 border-b-4 border-on-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <div className="inline-block bg-primary text-on-primary px-4 py-1.5 font-semibold text-sm uppercase tracking-wider mb-4 hard-shadow-sm">
                Potensi Desa
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-bold text-on-surface leading-tight">
                Kekayaan Pulau Obi
              </h2>
            </div>
            <p className="text-on-surface-variant max-w-md text-lg">
              Dari biodiversitas unik hingga UMKM kreatif, Pulau Obi menyimpan
              banyak potensi yang patut dijelajahi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POTENSI_DESA.map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className={`group block bg-background border-2 ${item.border} rounded-xl p-8 hard-shadow hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all`}
              >
                <div
                  className={`inline-flex items-center justify-center w-16 h-16 ${item.color} rounded-xl mb-6 border-2 ${item.border}`}
                >
                  <item.icon className={`w-8 h-8 ${item.accent}`} />
                </div>
                <h3 className="font-serif text-2xl font-bold text-on-surface mb-3 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-5">
                  {item.desc}
                </p>
                <div
                  className={`inline-flex items-center gap-1 text-sm font-semibold ${item.accent}`}
                >
                  Jelajahi
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ KKN SECTION ============ */}
      <section className="bg-primary text-on-primary py-24 border-b-4 border-on-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block bg-background text-on-surface px-4 py-1.5 font-semibold text-sm uppercase tracking-wider mb-5 hard-shadow-sm">
                Program Pengabdian
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-bold leading-tight mb-6">
                KKN UGM
                <br />
                <span className="italic text-primary-container">
                  Jawara Obira 2026
                </span>
              </h2>
              <p className="text-lg mb-8 opacity-90 leading-relaxed">
                Tim Kuliah Kerja Nyata dari Universitas Gadjah Mada yang
                mengabdi di Pulau Obi selama 50 hari, mendokumentasikan setiap
                langkah dan memberdayakan setiap potensi.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/kkn/jurnal"
                  className="inline-flex items-center gap-2 bg-background text-on-surface px-6 py-3.5 font-semibold rounded-lg hard-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(254,249,242,1)] transition-all"
                >
                  <BookOpen className="w-5 h-5" />
                  Jurnal Harian
                </Link>
                <Link
                  href="/kkn/proker"
                  className="inline-flex items-center gap-2 bg-on-surface/20 backdrop-blur border-2 border-on-primary text-on-primary px-6 py-3.5 font-semibold rounded-lg hover:bg-on-surface/30 transition-all"
                >
                  <Award className="w-5 h-5" />
                  Program Kerja
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-background hard-shadow-lg rounded-xl overflow-hidden -rotate-3">
                  <Image
                    src="/placeholder-kkn.jpg" // TODO: Ganti dengan path gambar aslimu
                    alt="Kegiatan KKN"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute -top-4 -right-4 w-full h-full border-4 border-primary-container rounded-xl rotate-3" />
                <div className="absolute -bottom-6 -left-6 bg-tertiary text-on-tertiary px-6 py-4 rounded-xl hard-shadow -rotate-3">
                  <div className="text-3xl font-serif font-bold">50</div>
                  <div className="text-xs uppercase tracking-wider">
                    Hari Pengabdian
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="bg-tertiary text-on-tertiary py-20 border-b-4 border-on-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <HeartHandshake className="w-20 h-20 mx-auto mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Jelajahi Lebih Jauh
            <br />
            <span className="italic">Pulau Obi</span>
          </h2>
          <p className="text-lg mb-10 opacity-90 max-w-2xl mx-auto">
            Temukan keunikan budaya, kekayaan alam, dan potensi desa yang ada di
            Pulau Obi, Maluku Utara.
          </p>
          <Link
            href="/profil"
            className="inline-flex items-center gap-2 bg-background text-on-surface px-10 py-4 font-semibold rounded-lg hard-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all text-lg"
          >
            Mulai Menjelajah
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}