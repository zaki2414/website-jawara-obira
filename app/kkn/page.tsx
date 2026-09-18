// app/kkn/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  BookOpen,
  Rocket,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  CalendarDays,
} from "lucide-react";
import {
  getKKNHubStats,
  getAllKKNTeamMembers,
  getFeaturedKKNProkers,
  getLatestKKNJournals,
  getKKNJournalMonthCounts,
} from "@/lib/supabase/queries";
import { PageOrnament, PaperTexture } from "@/components/shared/PageOrnament";
import { ScrollSpin } from "@/components/shared/ScrollSpin";
import { Reveal } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "KKN-PPM UGM Jawara Obira — Pengabdian di Pulau Obi",
  description:
    "Beranda program KKN-PPM UGM Periode II 2026 di Desa Kawasi & Soligi, Pulau Obi: anggota tim, jurnal harian, dan realisasi program kerja.",
};

// ══════════════════════════════════════════════════════════════════
// LANDING PAGE /kkn — BERANDA "SITUS DI DALAM SITUS"
//
// Diminta terasa seperti beranda sebuah situs tersendiri, tapi masih tinggal
// di situs yang sama. Dua keputusan yang membuat itu bekerja:
//
// 1. HERO-nya sengaja berkebalikan dengan beranda utama. Beranda utama adalah
//    panel kertas yang diletakkan DI ATAS FOTO tempat. Di sini tidak ada foto
//    sama sekali — hero-nya bidang warna institusional dengan tipografi besar.
//    Perbedaan bentuk itulah yang memberi kesan "pindah situs"; kalau cuma
//    ganti teks pada susunan yang sama, ia akan terbaca sebagai halaman biasa.
// 2. Isinya DATA, bukan menu. Versi lama halaman ini hanya tiga kartu tautan
//    berisi deskripsi statis — tidak ada satu pun angka atau entri nyata, jadi
//    pengunjung tidak belajar apa pun tentang program sebelum mengklik.
//    Sekarang halaman ini menampilkan jumlah sebenarnya, proker unggulan
//    beserta metrik dampaknya, jurnal terakhir, dan wajah anggota tim.
// ══════════════════════════════════════════════════════════════════

type TeamMember = {
  id: string;
  name: string;
  photo_url?: string;
  study_program?: string;
  village_placement?: string;
};

type JournalEntry = {
  id: string;
  title: string;
  slug: string;
  cover_image?: string;
  activity_date: string;
  villages?: { name: string } | null;
};

type FeaturedProker = {
  id: string;
  title: string;
  slug: string;
  short_description?: string;
  image_url?: string;
  impact_metrics?: { label: string; value: string }[] | null;
};

const CHANNELS = [
  {
    href: "/kkn/tim",
    label: "Anggota Tim",
    icon: Users,
    tone: "bg-primary text-on-primary",
    blurb:
      "Mahasiswa lintas klaster keilmuan yang ditempatkan di Desa Kawasi dan Soligi.",
  },
  {
    href: "/kkn/jurnal",
    label: "Jurnal Harian",
    icon: BookOpen,
    tone: "bg-tertiary text-on-tertiary",
    blurb:
      "Catatan kegiatan harian selama masa pengabdian, tersusun menurut tanggal.",
  },
  {
    href: "/kkn/proker",
    label: "Program Kerja",
    icon: Rocket,
    tone: "bg-cream text-on-surface",
    blurb:
      "Luaran, metrik dampak, dan dokumentasi dari program-program pilihan yang paling berdampak bagi warga Desa Kawasi dan Soligi.",
  },
] as const;

export default async function KKNLandingPage() {
  const [
    { data: stats },
    { data: membersData },
    { data: prokersData },
    { data: journalsData },
    { data: monthCounts },
  ] = await Promise.all([
    getKKNHubStats(),
    getAllKKNTeamMembers(),
    getFeaturedKKNProkers(4),
    getLatestKKNJournals(4),
    getKKNJournalMonthCounts(),
  ]);

  const members = (membersData ?? []) as TeamMember[];
  const prokers = (prokersData ?? []) as FeaturedProker[];
  const journals = (journalsData ?? []) as unknown as JournalEntry[];

  const villages = [
    ...new Set(members.map((m) => m.village_placement).filter(Boolean)),
  ] as string[];

  const counts = {
    members: stats?.members ?? members.length,
    journals: stats?.journals ?? journals.length,
    prokers: stats?.prokers ?? prokers.length,
    villages: villages.length || 2,
  };

  const channelCount: Record<string, number> = {
    "/kkn/tim": counts.members,
    "/kkn/jurnal": counts.journals,
    "/kkn/proker": counts.prokers,
  };

  // Strip periode pengabdian — memberi rasa "kalender" tanpa menggambar
  // petak tanggal kosong. Rentangnya mengikuti batas yang sama dengan
  // navigasi bulan di /kkn/jurnal (Juni–Agustus 2026).
  const PERIOD = [
    { key: "2026-06", label: "Jun" },
    { key: "2026-07", label: "Jul" },
    { key: "2026-08", label: "Ags" },
  ];

  const [featuredJournal, ...otherJournals] = journals;

  // Deretan wajah di bagian tim — dibatasi supaya jadi cuplikan, bukan roster
  // kedua yang menyaingi /kkn/tim.
  const facePreview = members.filter((m) => m.photo_url).slice(0, 10);

  return (
    <div className="bg-natural-paper">
      {/* ══ HERO ══ */}
      <section className="relative overflow-hidden bg-primary text-on-primary border-b-4 border-on-surface">
        <PaperTexture opacity={0.07} />
        <PageOrnament motif={4} placement="top-right" size="xl" opacity={0.09} marks={2} counterMotif={1} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-20 md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-on-primary/40 bg-on-primary/10 px-4 py-1.5 text-label-sm font-black uppercase tracking-[0.18em]">
            KKN-PPM UGM · Periode II 2026
          </span>

          <h1 className="mt-7 font-serif text-5xl sm:text-6xl md:text-8xl font-black leading-[0.92] tracking-[-0.03em] text-balance">
            Mengabdi di
            <span className="block text-tertiary">Pulau Obi</span>
          </h1>

          <div className="mt-8 h-1 w-24 bg-tertiary" aria-hidden="true" />

          <p className="mt-8 max-w-[56ch] text-body-lg leading-relaxed text-on-primary/90">
            Tim Jawara Obira menjalankan program pengabdian di Desa Kawasi dan Desa
            Soligi — memetakan ruang desa, mendokumentasikan pengetahuan lokal, dan
            menguatkan usaha warga. Halaman ini merekam apa yang dikerjakan, oleh
            siapa, dan hasilnya apa.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild variant="tertiary" size="lg" className="text-label-md">
              <Link href="/kkn/proker">
                <Rocket className="size-5" aria-hidden="true" />
                Lihat Program Kerja
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-label-md border-on-primary/50 bg-on-primary/10 text-on-primary hover:bg-on-primary/20"
            >
              <Link href="/kkn/tim">
                <Users className="size-5" aria-hidden="true" />
                Kenali Timnya
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ══ STATISTIK ══ */}
      <section className="relative border-b-4 border-on-surface bg-cream-container">
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-10 md:py-14">
          <dl className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8">
            {[
              { label: "Mahasiswa Terjun", value: counts.members },
              { label: "Desa Dampingan", value: counts.villages },
              { label: "Program Kerja", value: counts.prokers },
              { label: "Jurnal Terbit", value: counts.journals },
            ].map((stat) => (
              <div key={stat.label} className="border-t-4 border-on-surface pt-3">
                <dd className="font-serif text-5xl md:text-6xl font-black leading-none text-on-surface tabular">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-label-sm font-black uppercase tracking-[0.14em] text-on-cream">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ══ TIGA KANAL ══ */}
      <section className="relative overflow-hidden border-b-4 border-on-surface">
        <PaperTexture opacity={0.045} />
        <PageOrnament motif={2} placement="top-left" size="xl" opacity={0.055} marks={2} counterMotif={5} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
          <Reveal kind="rise" className="max-w-2xl mb-12">
            <h2 className="font-serif text-4xl md:text-5xl font-black leading-tight tracking-[-0.02em] text-on-surface text-balance">
              Tiga catatan yang kami tinggalkan
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant leading-relaxed">
              Setiap kanal menyimpan jenis rekaman yang berbeda, dan ketiganya
              dirawat supaya masih bisa dibaca lama setelah masa KKN berakhir.
            </p>
          </Reveal>

          <Reveal kind="stagger" className="grid gap-6 md:grid-cols-3">
            {CHANNELS.map((channel) => (
              <Link
                key={channel.href}
                href={channel.href}
                data-reveal-item
                className="group flex flex-col justify-between rounded-3xl border-4 border-on-surface bg-background p-7 hard-shadow hard-shadow-hover press-effect"
              >
                <div>
                  <span
                    className={`inline-grid place-items-center w-12 h-12 rounded-xl border-2 border-on-surface ${channel.tone}`}
                  >
                    <channel.icon className="w-5 h-5" aria-hidden="true" />
                  </span>

                  <h3 className="mt-6 font-serif text-2xl font-black text-on-surface leading-tight">
                    {channel.label}
                  </h3>
                  <p className="mt-2 text-body-md text-on-surface-variant leading-relaxed">
                    {channel.blurb}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t-2 border-dashed border-outline-variant pt-4">
                  <span className="font-serif text-3xl font-black text-on-surface tabular">
                    {channelCount[channel.href]}
                  </span>
                  <ArrowUpRight
                    className="w-5 h-5 text-on-surface transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden="true"
                  />
                </div>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ══ PROGRAM KERJA UNGGULAN ══
          Bidangnya bg-cream, BUKAN bg-background. Seksi "Tiga catatan" di
          atasnya transparan di atas bg-natural-paper (#f5f0e6) sementara seksi
          ini dulu bg-background (#fef9f2) — dua nilai yang praktis sama, jadi
          keduanya terbaca sebagai satu bidang pucat panjang tanpa batas.
          Cream (#E6D2B1) memberi jeda yang jelas, dan kartunya yang tetap
          bg-background jadi menonjol di atasnya.

          Susunannya juga diganti: dulu dua kartu tegak berdampingan — bentuk
          yang sama persis dengan daftar di /kkn/proker, jadi halaman beranda
          ini cuma mengulang halaman daftarnya dalam ukuran lebih kecil.
          Sekarang tiap proker jadi satu panel melebar penuh dengan foto di
          satu sisi dan keterangan di sisi lain, sisinya berganti-ganti — ruang
          mendatar itu yang membuat angka dampaknya bisa tampil besar
          berdampingan, bukan diperas ke dalam kolom kartu. */}
      {prokers.length > 0 && (
        <section className="relative overflow-hidden border-b-4 border-on-surface bg-cream">
          <PaperTexture opacity={0.05} />

          {/* Ornamen hiasan yang BERPUTAR mengikuti gulir — ScrollSpin, bukan
              PageOrnament (yang sengaja Server Component tanpa animasi).
              Motif dipilih menurut warna bawaannya terhadap bidang cream
              #E6D2B1: Hiasan 1 (#2E2E2E, 9.19:1) dan Hiasan 2 (#006689,
              4.36:1). Hiasan 3 & 4 berwarna putih (1.48:1) dan Hiasan 5
              justru berisi #E6D2B1 — persis warna bidang ini, jadi kalau
              dipakai di sini ia benar-benar tidak terlihat sama sekali. */}
          <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
            <ScrollSpin
              degreesPer1000px={110}
              className="absolute -left-24 top-10 size-72 opacity-[0.13]"
            >
              <div className="relative size-full">
                <Image src="/Hiasan 1.svg" alt="" fill className="object-contain" aria-hidden="true" />
              </div>
            </ScrollSpin>
            <ScrollSpin
              degreesPer1000px={-150}
              className="absolute -right-28 bottom-12 size-80 opacity-[0.16]"
            >
              <div className="relative size-full">
                <Image src="/Hiasan 2.svg" alt="" fill className="object-contain" aria-hidden="true" />
              </div>
            </ScrollSpin>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <Reveal kind="rise" className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-black leading-tight tracking-[-0.02em] text-on-surface">
                  Program Kerja
                </h2>
                <p className="mt-3 max-w-[52ch] text-body-lg leading-relaxed text-on-surface/75">
                  Sebagian program dengan capaian terukur paling menonjol, lengkap
                  dengan angka dampaknya di lapangan.
                </p>
              </div>
              <Button asChild variant="secondary" className="text-label-md">
                <Link href="/kkn/proker">
                  Semua Program
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>

            <Reveal kind="stagger" className="flex flex-col gap-6">
              {prokers.map((proker, index) => {
                const metrics = (proker.impact_metrics ?? []).filter((m) => m.label && m.value).slice(0, 3);
                // Sisi foto berganti tiap panel — irama editorial supaya dua
                // panel berturut-turut tidak terbaca sebagai baris yang sama
                // dicetak dua kali.
                const imageRight = index % 2 === 1;

                return (
                  <Link
                    key={proker.id}
                    href={`/kkn/proker/${proker.slug}`}
                    data-reveal-item
                    className="group grid overflow-hidden rounded-3xl border-4 border-on-surface bg-background hard-shadow-lg hard-shadow-hover press-effect md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]"
                  >
                    <div
                      className={`relative aspect-16/10 border-b-4 border-on-surface bg-surface-container-low md:aspect-auto md:min-h-52 md:border-b-0 ${
                        imageRight
                          ? "md:order-2 md:border-l-4"
                          : "md:order-1 md:border-r-4"
                      }`}
                    >
                      {proker.image_url ? (
                        <Image
                          src={proker.image_url}
                          alt={proker.title}
                          fill
                          className="object-cover transition-transform duration-700 ease-[--ease-out] group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, 42vw"
                        />
                      ) : (
                        <div className="grid place-items-center h-full" aria-hidden="true">
                          <Rocket className="w-10 h-10 text-on-surface/25" />
                        </div>
                      )}
                    </div>

                    <div
                      className={`flex flex-col p-5 md:p-7 ${imageRight ? "md:order-1" : "md:order-2"}`}
                    >
                      <h3 className="font-serif text-xl md:text-2xl font-black text-on-surface leading-tight text-balance">
                        {proker.title}
                      </h3>
                      {proker.short_description && (
                        <p className="mt-2 max-w-[58ch] text-sm text-on-surface-variant leading-relaxed line-clamp-2">
                          {proker.short_description}
                        </p>
                      )}

                      {metrics.length > 0 && (
                        <dl className="mt-auto flex flex-wrap gap-x-8 gap-y-3 border-t-2 border-dashed border-outline-variant pt-4">
                          {metrics.map((m) => (
                            <div key={m.label} className="min-w-0">
                              {/* Ukuran angka menyesuaikan panjang isinya —
                                  sebagian metrik berupa frasa, bukan bilangan
                                  pendek. */}
                              <dd
                                className={`font-serif font-black leading-tight tabular text-primary ${
                                  m.value.length <= 6
                                    ? "text-xl"
                                    : m.value.length <= 14
                                      ? "text-base"
                                      : "text-sm"
                                }`}
                              >
                                {m.value}
                              </dd>
                              <dt className="mt-0.5 text-label-sm font-bold uppercase tracking-wider text-on-surface-variant">
                                {m.label}
                              </dt>
                            </div>
                          ))}
                        </dl>
                      )}

                      <span className="mt-4 inline-flex w-fit items-center gap-2 text-label-sm font-black uppercase tracking-widest text-on-surface">
                        Lihat Program
                        <ArrowRight
                          className="size-4 transition-transform duration-150 ease-[--ease-out] group-hover:translate-x-1"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </Reveal>
          </div>
        </section>
      )}

      {/* ══ JURNAL — SOROTAN + STRIP PERIODE ══
          Versi sebelumnya menampilkan daftar bergaris di atas bidang teal.
          Dengan satu entri, daftar itu jadi satu baris tipis yang mengambang
          di tengah band raksasa — bentuk "daftar" menjanjikan banyak butir,
          lalu ingkar. Sekarang entri terbaru diberi perlakuan sorotan (sampul
          besar + tanggal + judul), dan sebaran waktunya ditunjukkan lewat
          strip periode Juni–Agustus, bukan petak tanggal yang mayoritas
          kosong. Bentuknya tetap benar baik saat ada satu entri maupun dua
          puluh. */}
      {journals.length > 0 && featuredJournal && (
        <section className="relative overflow-hidden border-b-4 border-on-surface bg-primary text-on-primary">
          <PaperTexture opacity={0.06} />
          <PageOrnament motif={3} placement="bottom-right" size="xl" opacity={0.08} />

          <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
            <Reveal kind="rise" className="flex flex-wrap items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="font-serif text-4xl md:text-5xl font-black leading-tight tracking-[-0.02em]">
                  Jurnal Harian
                </h2>
                <p className="mt-3 max-w-[52ch] text-body-lg text-on-primary/85">
                  Catatan dari lapangan, ditulis pada hari kegiatannya berlangsung.
                </p>
              </div>
              <Button asChild variant="tertiary" className="text-label-md">
                <Link href="/kkn/jurnal">
                  Buka Kalender
                  <CalendarDays className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </Reveal>

            {/* SOROTAN MELEBAR — foto di kiri, keterangan di kanan.
                Sebelumnya kartu sorotan duduk di kolom kiri dan kolom kanan
                diisi grafik batang "Periode Pengabdian". Dengan jumlah entri
                yang ada sekarang, grafik itu menggambar satu batang terisi dan
                dua batang kosong — bentuk dasbor yang menjanjikan sebaran data
                lalu memperlihatkan bahwa datanya belum ada. Panel sorotan
                sekarang memakai lebar penuh, dan periode pengabdian pindah ke
                bawah sebagai chip bulan yang BISA DIKLIK menuju bulan itu di
                kalender — informasi yang sama, tapi jadi navigasi, dan tetap
                jujur baik saat ada satu entri maupun dua puluh. */}
            <Reveal kind="panel">
              <Link
                href={`/kkn/jurnal/${featuredJournal.slug}`}
                className="group grid overflow-hidden rounded-3xl border-4 border-on-surface bg-background text-on-surface hard-shadow-lg hard-shadow-hover press-effect lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]"
              >
                <div className="relative aspect-16/10 border-b-4 border-on-surface bg-surface-container-low lg:aspect-auto lg:min-h-64 lg:border-b-0 lg:border-r-4">
                  {featuredJournal.cover_image ? (
                    <Image
                      src={featuredJournal.cover_image}
                      alt={featuredJournal.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-[--ease-out] group-hover:scale-105"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="grid h-full place-items-center" aria-hidden="true">
                      <BookOpen className="size-12 text-on-surface/25" />
                    </div>
                  )}
                  <span className="absolute left-4 top-4 z-10 rounded-full border-2 border-on-surface bg-tertiary px-3 py-1 text-label-sm font-black uppercase tracking-wider text-on-tertiary hard-shadow-sm">
                    Terbaru
                  </span>
                </div>

                <div className="flex flex-col justify-center p-6 md:p-9">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-label-sm font-black uppercase tracking-[0.14em] text-primary">
                    <span className="tabular">{formatDate(featuredJournal.activity_date)}</span>
                    {featuredJournal.villages?.name && (
                      <>
                        <span aria-hidden="true" className="text-outline">/</span>
                        <span className="inline-flex items-center gap-1 text-on-surface-variant">
                          <MapPin className="size-3" aria-hidden="true" />
                          {featuredJournal.villages.name}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-3 font-serif text-2xl md:text-3xl font-black leading-tight text-balance">
                    {featuredJournal.title}
                  </h3>
                  <span className="mt-6 inline-flex w-fit items-center gap-2 text-label-md font-black uppercase tracking-widest">
                    Baca Catatan
                    <ArrowUpRight
                      className="size-4 transition-transform duration-150 ease-[--ease-out] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>

            <Reveal kind="rise" className="mt-10 border-t-2 border-dashed border-on-primary/25 pt-8">
              <h3 className="text-label-sm font-black uppercase tracking-[0.18em] text-on-primary/70">
                Periode Pengabdian
              </h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {PERIOD.map((m) => {
                  const n = monthCounts?.[m.key] ?? 0;
                  const [yr, mo] = m.key.split("-");
                  return (
                    <Link
                      key={m.key}
                      href={`/kkn/jurnal?year=${yr}&month=${Number(mo)}&desa=kawasi`}
                      className="group inline-flex items-center gap-2.5 rounded-xl border-2 border-on-primary/40 bg-on-primary/10 px-4 py-2.5 transition-colors duration-150 hover:bg-on-primary/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tertiary focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
                    >
                      <span className="text-label-md font-black uppercase tracking-wider">
                        {m.label}
                      </span>
                      <span
                        className={`grid h-6 min-w-6 place-items-center rounded-full px-1.5 text-label-sm font-black tabular ${
                          n > 0
                            ? "bg-tertiary text-on-tertiary"
                            : "bg-on-primary/15 text-on-primary/60"
                        }`}
                      >
                        {n}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </Reveal>

            {otherJournals.length > 0 && (
              <Reveal kind="rise" className="mt-10 border-t-2 border-dashed border-on-primary/25 pt-8">
                <h3 className="text-label-sm font-black uppercase tracking-[0.18em] text-on-primary/70">
                  Catatan Lain
                </h3>
                <ul className="mt-4 grid gap-1 md:grid-cols-2">
                  {otherJournals.map((journal) => (
                    <li key={journal.id}>
                      <Link
                        href={`/kkn/jurnal/${journal.slug}`}
                        className="group flex items-start gap-3 rounded-xl px-3 py-3 transition-colors duration-150 hover:bg-on-primary/10"
                      >
                        <span className="mt-1 shrink-0 text-label-sm font-black tabular text-tertiary">
                          {new Date(journal.activity_date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                          })}
                        </span>
                        <span className="font-serif text-base font-black leading-snug text-balance">
                          {journal.title}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
          </div>
        </section>
      )}

      {/* ══ TIM ══ */}
      <section className="relative overflow-hidden border-b-4 border-on-surface bg-background">
        <PaperTexture opacity={0.045} />
        <PageOrnament motif={5} placement="bottom-left" size="xl" opacity={0.055} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 py-16 md:py-24">
          <Reveal kind="rise" className="max-w-2xl">
            <h2 className="font-serif text-4xl md:text-5xl font-black leading-tight tracking-[-0.02em] text-on-surface text-balance">
              {counts.members} mahasiswa, {counts.villages} desa
            </h2>
            <p className="mt-4 text-body-lg text-on-surface-variant leading-relaxed">
              Ditempatkan lintas klaster keilmuan supaya program yang dijalankan
              saling melengkapi — dari pemetaan spasial sampai penguatan usaha warga.
            </p>
          </Reveal>

          {facePreview.length > 0 && (
            <Reveal kind="rise" className="mt-10">
              {/* Deretan wajah bertumpuk — cuplikan, bukan roster kedua. */}
              <div className="flex flex-wrap items-center gap-y-3">
                {facePreview.map((member, i) => (
                  <div
                    key={member.id}
                    className="relative w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-on-surface overflow-hidden bg-surface-container-low hard-shadow-sm"
                    style={{ marginLeft: i === 0 ? 0 : "-0.9rem" }}
                    title={member.name}
                  >
                    <Image
                      src={member.photo_url as string}
                      alt={member.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>
                ))}
                {counts.members > facePreview.length && (
                  <span
                    className="relative grid place-items-center w-16 h-16 md:w-20 md:h-20 rounded-full border-4 border-on-surface bg-tertiary text-on-tertiary font-serif text-lg font-black hard-shadow-sm"
                    style={{ marginLeft: "-0.9rem" }}
                  >
                    +{counts.members - facePreview.length}
                  </span>
                )}
              </div>
            </Reveal>
          )}

          <Reveal kind="rise" className="mt-10">
            <Button asChild variant="primary" size="lg" className="text-label-md">
              <Link href="/kkn/tim">
                <Users className="size-5" aria-hidden="true" />
                Lihat Seluruh Anggota
              </Link>
            </Button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
