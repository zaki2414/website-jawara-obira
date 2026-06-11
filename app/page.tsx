"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
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
// ANIMATION COMPONENT
// ==========================================

function ScrollReveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [ref, setRef] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 },
    );

    if (ref) observer.observe(ref);
    return () => ref && observer.unobserve(ref);
  }, [ref, delay]);

  return (
    <div
      ref={setRef}
      className={`transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      {children}
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* ============ HERO SECTION ============ */}
      <section className="relative bg-natural-paper overflow-hidden border-on-surface min-h-[80vh] flex items-center">
        {/* Decorative gradient elements */}
        <div className="absolute inset-0 opacity-30 pointer-events-none z-0">
          <div
            className="absolute top-10 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute bottom-10 right-1/4 w-125 h-125 bg-tertiary rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "1s" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-16 md:py-32 z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <ScrollReveal>
              {/* Diubah menjadi relative untuk membungkus absolute asset ornamen */}
              <div className="space-y-8 relative">
                {/* Asseet Ornamen Latar Belakang Berputar */}
                <div className="absolute -left-90 -top-35 w-100 h-100 opacity-20 pointer-events-none z-0 animate-[spin_15s_linear_infinite] hidden lg:block select-none">
                  <Image
                    src="/Hiasan 1.svg"
                    alt="Ornamen Jawara Obira"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="absolute left-290 top-65 w-80 h-80 opacity-20 pointer-events-none z-0 animate-[spin_15s_linear_infinite] hidden lg:block select-none">
                  <Image
                    src="/Hiasan 1.svg"
                    alt="Ornamen Jawara Obira"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                {/* Wrapper Konten Utama (z-10 agar berada di atas putaran ornamen) */}
                <div className="relative z-10 space-y-8">
                  <div className="inline-flex items-center gap-2 bg-primary-container/30 border-2 border-on-surface px-5 py-2.5 rounded-full hard-shadow-sm hover:hard-shadow-md transition-all duration-300 w-fit">
                    <MapPin className="w-5 h-5 text-primary shrink-0" />
                    <span className="text-sm font-semibold text-on-surface tracking-widest uppercase">
                      Pulau Obi • Maluku Utara
                    </span>
                  </div>

                  <h1 className="font-serif text-5xl md:text-7xl font-black text-on-surface leading-[1.08] tracking-tight">
                    Selamat Datang
                    <br />
                    <span className="text-primary italic block mt-2">
                      di Pulau Obi
                    </span>
                  </h1>

                  <p className="text-lg md:text-xl text-on-surface-variant max-w-lg leading-relaxed font-medium">
                    Jelajahi kekayaan budaya, biodiversitas, dan kearifan lokal
                    dari{" "}
                    <strong className="font-black text-on-surface">
                      Desa Kawasi
                    </strong>{" "}
                    dan{" "}
                    <strong className="font-black text-on-surface">
                      Desa Soligi
                    </strong>
                    .
                  </p>

                  <div className="flex flex-wrap gap-4 pt-4">
                    <Link
                      href="/profil"
                      className="group inline-flex items-center gap-2 bg-primary text-on-primary px-8 py-3.5 font-black uppercase tracking-wider text-sm rounded-xl border-2 border-on-surface hard-shadow hover:hard-shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                    >
                      <Info className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                      Profil Desa
                    </Link>
                    <Link
                      href="/berita"
                      className="group inline-flex items-center gap-2 bg-background border-2 border-on-surface text-on-surface px-8 py-3.5 font-black uppercase tracking-wider text-sm rounded-xl hard-shadow hover:hard-shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
                    >
                      <Newspaper className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      Berita Terkini
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Right: Hero Visual */}
            <ScrollReveal delay={200}>
              <div className="relative">
                <div className="relative aspect-4/3 max-w-lg mx-auto group">
                  <div className="absolute inset-0 bg-on-primary-container border-2 border-on-surface hard-shadow-lg rounded-2xl overflow-hidden rotate-2 group-hover:rotate-0 group-hover:hard-shadow-xl transition-all duration-500">
                    <Image
                      src="/placeholder-hero.jpg"
                      alt="Pemandangan Pulau Obi"
                      fill
                      className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
                      priority
                    />
                  </div>
                  <div className="absolute -top-4 -left-4 w-full h-full border-4 border-tertiary rounded-2xl -rotate-2 group-hover:rotate-0 transition-all duration-500" />
                  <div className="absolute -bottom-6 -right-6 bg-tertiary text-on-tertiary px-6 py-4 rounded-xl border-2 border-on-surface hard-shadow rotate-3 group-hover:rotate-0 transition-all duration-500">
                    <div className="text-3xl font-serif font-black">
                      {VILLAGE_STATS[0].number}
                    </div>
                    <div className="text-[10px] uppercase tracking-widest font-black">
                      Desa Dampingan
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============ VILLAGE STATS ============ */}
      <section className="bg-tertiary text-background border-y-4 border-on-surface">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {VILLAGE_STATS.map((stat, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="text-center group hover:scale-105 transition-transform duration-300 cursor-default">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <div className="p-3 bg-background/10 border border-on-tertiary/20 rounded-xl group-hover:bg-primary-container/20 transition-colors">
                      <stat.icon className="w-7 h-7 text-on-tertiary group-hover:scale-110 transition-transform" />
                    </div>
                  </div>
                  <div className="font-serif text-4xl md:text-5xl font-black text-on-tertiary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-on-tertiary/40 font-black">
                    {stat.label}
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TWO VILLAGES SECTION ============ */}
      <section className="bg-natural-paper pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <div className="inline-block bg-on-surface text-background border-2 border-on-surface px-5 py-2 font-black text-xs uppercase tracking-widest mb-6 hard-shadow-sm">
                Klaster Wilayah
              </div>
              <h2 className="font-serif text-4xl md:text-6xl font-black text-on-surface leading-tight tracking-tight">
                Mengenal{" "}
                <span className="italic text-primary">Kawasi & Soligi</span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8">
            {VILLAGES.map((village, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="group relative h-full">
                  <div
                    className={`relative bg-background border-2 ${village.border} rounded-2xl p-10 hard-shadow hover:hard-shadow-lg hover:-translate-y-2 transition-all duration-300 h-full flex flex-col justify-between`}
                  >
                    <div>
                      <div
                        className={`inline-flex items-center justify-center w-20 h-20 ${village.color} rounded-2xl mb-8 border-2 ${village.border} group-hover:scale-105 transition-transform duration-300`}
                      >
                        <village.icon
                          className={`w-10 h-10 ${village.accent}`}
                        />
                      </div>

                      <h3 className="font-serif text-3xl font-black text-on-surface mb-3 group-hover:text-primary transition-colors duration-300">
                        {village.name}
                      </h3>

                      <p className="text-sm font-bold text-on-surface-variant mb-6 italic flex items-center gap-2">
                        <MapPin className="w-4 h-4 shrink-0 text-error" />
                        {village.location}
                      </p>

                      <p className="text-on-surface-variant leading-relaxed mb-8 font-medium">
                        {village.desc}
                      </p>
                    </div>

                    <div>
                      <div className="flex flex-wrap gap-2 mb-8">
                        {village.features.map((feature) => (
                          <span
                            key={feature}
                            className="bg-surface-container-high border border-on-surface px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/profil?desa=${village.name.split(" ")[1].toLowerCase()}`}
                        className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider ${village.accent} hover:underline group/link`}
                      >
                        Selengkapnya
                        <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ POTENSI DESA ============ */}
      <section className="bg-natural-paper py-28 border-b-4 border-on-surface">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <div className="inline-block bg-primary text-on-primary border-2 border-on-surface px-5 py-2 font-black text-xs uppercase tracking-widest mb-6 hard-shadow-sm">
                  Potensi Desa
                </div>
                <h2 className="font-serif text-4xl md:text-6xl font-black text-on-surface leading-tight tracking-tight">
                  Kekayaan <span className="italic">Pulau Obi</span>
                </h2>
              </div>
              <p className="text-on-surface-variant max-w-md text-lg font-medium leading-relaxed">
                Dari biodiversitas unik hingga produk kerajinan komoditas
                kreatif, Pulau Obi menyimpan banyak potensi berharga.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {POTENSI_DESA.map((item, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <Link
                  href={item.href}
                  className={`group block bg-background border-2 ${item.border} rounded-2xl p-8 hard-shadow hover:hard-shadow-lg hover:-translate-y-2 transition-all duration-300 h-full`}
                >
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 ${item.color} rounded-2xl mb-6 border-2 ${item.border} group-hover:scale-105 group-hover:rotate-3 transition-all duration-300 relative z-10`}
                  >
                    <item.icon className={`w-8 h-8 ${item.accent}`} />
                  </div>

                  <h3 className="font-serif text-2xl font-black text-on-surface mb-3 group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>

                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6 font-medium">
                    {item.desc}
                  </p>

                  <div
                    className={`inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider ${item.accent}`}
                  >
                    Jelajahi
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ KKN SECTION ============ */}
      <section className="bg-primary text-on-primary py-28 border-b-4 border-on-surface relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 -left-32 w-64 h-64 bg-on-primary rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-on-primary rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div>
                <div className="inline-block bg-background text-on-surface border-2 border-on-surface px-5 py-2 font-black text-xs uppercase tracking-widest mb-8 hard-shadow-sm">
                  Program Pengabdian
                </div>
                <h2 className="font-serif text-5xl md:text-7xl font-black leading-tight mb-8 tracking-tight">
                  KKN UGM
                  <br />
                  <span className="italic text-tertiary text-5xl md:text-6xl">
                    Jawara Obira
                  </span>
                </h2>
                <p className="text-lg mb-10 opacity-95 leading-relaxed font-medium max-w-lg">
                  Sinergi civitas akademika Universitas Gadjah Mada yang
                  mendedikasikan program kerja berbasis digitalisasi spasial,
                  inventarisasi alam, dan penguatan komoditas desa.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/kkn/jurnal"
                    className="group inline-flex items-center gap-2 bg-background text-on-surface px-8 py-3.5 font-black uppercase tracking-wider text-xs rounded-xl border-2 border-on-surface hard-shadow hover:hard-shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    <BookOpen className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    Jurnal Harian
                  </Link>
                  <Link
                    href="/kkn/proker"
                    className="group inline-flex items-center gap-2 bg-primary-container text-on-primary-container px-8 py-3.5 font-black uppercase tracking-wider text-xs rounded-xl border-2 border-on-surface hard-shadow hover:hard-shadow-lg hover:-translate-y-1 transition-all duration-200"
                  >
                    <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    Program Kerja
                  </Link>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <div className="relative">
                <div className="relative aspect-square max-w-md mx-auto group">
                  <div className="absolute inset-0 bg-background border-4 border-on-surface hard-shadow-lg rounded-2xl overflow-hidden -rotate-3 group-hover:rotate-0 group-hover:hard-shadow-xl transition-all duration-500">
                    <Image
                      src="/placeholder-kkn.jpg"
                      alt="Kegiatan KKN"
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute -top-4 -right-4 w-full h-full border-4 border-primary-container rounded-2xl rotate-3 group-hover:rotate-0 transition-all duration-500" />
                  <div className="absolute -bottom-6 -left-6 bg-background text-on-surface border-2 border-on-surface px-8 py-5 rounded-2xl hard-shadow -rotate-3 group-hover:rotate-0 transition-all duration-500">
                    <div className="text-4xl font-serif font-black">50</div>
                    <div className="text-[10px] uppercase tracking-widest font-black">
                      Hari Pengabdian
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ============ CTA SECTION ============ */}
      <section className="bg-tertiary text-on-tertiary py-28 relative overflow-hidden">
        <ScrollReveal>
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="mb-8 inline-block group cursor-default">
              <HeartHandshake className="w-24 h-24 mx-auto group-hover:scale-105 group-hover:rotate-6 transition-all duration-300 text-on-tertiary" />
            </div>

            <h2 className="font-serif text-5xl md:text-7xl font-black mb-8 leading-tight tracking-tight">
              Jelajahi Lebih Jauh
              <br />
              <span className="italic text-primary text-5xl md:text-6xl">
                Pulau Obi
              </span>
            </h2>

            <p className="text-lg mb-12 opacity-95 max-w-2xl mx-auto font-medium leading-relaxed">
              Buka lembaran arsip digital, pelajari keunikan sosiokultural,
              serta saksikan kemajuan pembangunan berkelanjutan di Kawasi dan
              Soligi.
            </p>

            <Link
              href="/profil"
              className="group inline-flex items-center gap-3 bg-background text-on-surface px-10 py-4 font-black uppercase tracking-wider text-sm rounded-xl border-2 border-on-surface hard-shadow hover:hard-shadow-lg hover:-translate-y-1 active:translate-y-0 transition-all duration-200"
            >
              Mulai Menjelajah
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
