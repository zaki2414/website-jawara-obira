// app/kkn/proker/page.tsx
import { getAllKKNProkers } from "@/lib/supabase/queries";
import Link from "next/link";
import Image from "next/image";
import { Award, ArrowRight, HelpCircle, MapPin } from "lucide-react";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";
import { KKNProkerHero } from "@/components/kkn/KKNProkerHero";
import { PROKER_CARD_ACCENTS } from "@/components/kkn/kknCardStyles";

export const dynamic = "force-dynamic";

type PageProps = {
  searchParams: Promise<{ desa?: string }>;
};

type ProkerListItem = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  image_url: string | null;
  impact_metrics: { label: string; value: string }[] | null;
  village_id: string | null;
  villages: { name: string; slug: string } | null;
};

const VILLAGE_FILTERS = [
  { value: "", label: "Semua", activeClass: "bg-on-surface text-background" },
  { value: "kawasi", label: "Desa Kawasi", activeClass: "bg-primary text-on-primary" },
  { value: "soligi", label: "Desa Soligi", activeClass: "bg-tertiary text-on-tertiary" },
] as const;

export default async function KKNProkersPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const selectedDesa = params.desa ?? "";
  const { data: prokers, error } = await getAllKKNProkers(selectedDesa || undefined);

  if (error) {
    return (
      <div className="min-h-screen bg-natural-paper p-8 flex items-center justify-center">
        <div className="bg-background p-6 border-2 border-error rounded-xl max-w-md hard-shadow-sm text-center">
          <p className="font-serif font-black text-error text-lg mb-2">Gagal Memuat Program Kerja</p>
          <p className="text-sm text-on-surface-variant font-medium">{String(error)}</p>
        </div>
      </div>
    );
  }

  const list = (prokers as unknown as ProkerListItem[] | null) ?? [];

  return (
    <div className="relative min-h-screen bg-primary-container/15 overflow-hidden">
      <KknPageBackground />

      <KKNProkerHero totalCount={list.length} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* PENYARING DESA — bentuk chip yang sama dengan PageFilterBar
            (components/shared/PageFilterBar.tsx) yang dipakai Budaya, Galeri,
            TOGA, Fauna, dan UMKM. Tetap <Link> (navigasi ?desa=, disaring di
            server), bukan tombol dengan callback, karena itu komponennya tidak
            dipakai ulang langsung di sini. */}
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <span className="text-label-sm font-black uppercase tracking-widest text-on-surface-variant">
            Wilayah
          </span>
          <div role="group" aria-label="Saring menurut desa" className="flex flex-wrap gap-2">
            {VILLAGE_FILTERS.map((f) => {
              const isActive = selectedDesa === f.value;
              return (
                <Link
                  key={f.value || "all"}
                  href={f.value ? `?desa=${f.value}` : "?"}
                  aria-current={isActive ? "true" : undefined}
                  className={`inline-flex h-11 shrink-0 items-center rounded-xl border-2 border-on-surface px-4 text-label-sm font-black uppercase tracking-wider transition-colors duration-150 press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                    isActive
                      ? `${f.activeClass} hard-shadow-sm`
                      : "bg-background text-on-surface-variant hover:bg-surface-container-low"
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════
            BARIS DOSIR MENDATAR, BUKAN KARTU BERDIRI
            Susunan sebelumnya: grid tiga kolom berisi kartu tegak (foto
            16:10 di atas, lalu judul, deskripsi, dan metrik ditumpuk ke
            bawah). Seluruh isi kartu berebut satu kolom selebar ~350px,
            sehingga judul panjang tetap terpotong tiga baris dan dua angka
            dampak harus berbagi lebar yang sama sempitnya.

            Sekarang tiap program jadi satu baris: foto mengunci sisi kiri,
            keterangan memanjang ke kanan. Dua kolom (bukan tiga) memberi
            tiap baris ~600px, jadi judul, deskripsi, dan angka dampak
            masing-masing punya ruang mendatar sendiri — dan halamannya
            memuat dua program per baris, bukan satu kartu tinggi per kolom.
            ══════════════════════════════════════════════════════════════ */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {list.map((proker, index) => {
            // Border kartu, warna angka metrik, DAN warna judul saat hover
            // sengaja satu objek aksen yang sama, supaya tidak ada kartu
            // bertepi emas yang angkanya biru. Cincin aksen dipertahankan
            // dari desain sebelumnya.
            const accent = PROKER_CARD_ACCENTS[index % PROKER_CARD_ACCENTS.length];
            const metrics = (proker.impact_metrics ?? [])
              .filter((m) => m?.label && m?.value)
              .slice(0, 2);

            return (
              <Link
                key={proker.id}
                href={`/kkn/proker/${proker.slug}`}
                className={`group flex items-stretch overflow-hidden rounded-2xl border-4 bg-background hard-shadow hard-shadow-hover press-effect focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${accent.border}`}
              >
                <div className="relative w-32 shrink-0 self-stretch bg-surface-container-high sm:w-44">
                  {proker.image_url ? (
                    <Image
                      src={proker.image_url}
                      alt={proker.title}
                      fill
                      className="object-cover transition-transform duration-500 ease-[--ease-out] group-hover:scale-105"
                      sizes="176px"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-on-surface-variant/30">
                      <Award className="size-10 stroke-2" aria-hidden="true" />
                    </div>
                  )}
                </div>

                {/* Strip aksen — penanda warna baris sekaligus pemisah tegas
                    antara foto dan keterangan, sejalan dengan kartu anggota
                    di /kkn/tim. */}
                <div className={`w-1.5 shrink-0 self-stretch ${accent.bar}`} aria-hidden="true" />

                <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
                  <span className="mb-2 inline-flex w-fit items-center gap-1 rounded-full border-2 border-on-surface bg-surface-container px-2.5 py-0.5 text-label-sm font-black uppercase tracking-wider text-on-surface-variant">
                    <MapPin className="size-3 shrink-0" aria-hidden="true" />
                    {proker.villages?.name ?? "Lintas Desa"}
                  </span>

                  <h2
                    // line-clamp-3, bukan 2 — banyak judul proker panjang
                    // ("GROW-MOM: OrangTua Sadar Gizi dan Perkembangan Anak
                    // untuk Generasi Anti Stunting") dan pada dua baris
                    // hampir semuanya terpotong di tengah kata.
                    className={`font-serif text-base font-black leading-snug tracking-tight text-on-surface transition-colors line-clamp-3 sm:text-lg ${accent.hoverTitle}`}
                  >
                    {proker.title}
                  </h2>

                  {proker.short_description && (
                    <p className="mt-1.5 text-sm font-medium leading-relaxed text-on-surface-variant line-clamp-2">
                      {proker.short_description}
                    </p>
                  )}

                  {/* KAKI BARIS — ANGKA DAMPAK SEBAGAI JANGKAR.
                      Panah menggantikan tulisan "LIHAT PROGRAM" yang dulu
                      diulang di 23 kartu, padahal seluruh barisnya memang
                      sudah satu tautan. */}
                  <div className="mt-auto flex items-end justify-between gap-3 border-t-2 border-dashed border-outline-variant pt-3">
                    {metrics.length > 0 ? (
                      <dl className="flex min-w-0 flex-1 gap-5">
                        {metrics.map((m) => (
                          <div key={m.label} className="min-w-0">
                            {/* Ukuran angka menyesuaikan panjang isinya —
                                sebagian metrik bukan angka pendek seperti
                                "500" tapi frasa penuh seperti "60 bibit (40
                                kayu putih, 20 berdaun lebar)". */}
                            <dd
                              className={`font-serif font-black leading-tight tabular line-clamp-2 ${accent.metricValue} ${
                                m.value.length <= 6
                                  ? "text-xl"
                                  : m.value.length <= 14
                                    ? "text-base"
                                    : "text-sm"
                              }`}
                            >
                              {m.value}
                            </dd>
                            <dt className="mt-0.5 text-label-sm font-bold uppercase leading-tight tracking-wide text-on-surface-variant line-clamp-2">
                              {m.label}
                            </dt>
                          </div>
                        ))}
                      </dl>
                    ) : (
                      <span className="text-label-sm font-bold uppercase tracking-wide text-on-surface-variant">
                        Lihat dokumentasi
                      </span>
                    )}

                    <ArrowRight
                      className="size-5 shrink-0 text-on-surface transition-transform duration-150 ease-[--ease-out] group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {list.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-outline-variant bg-background py-24 text-on-surface-variant">
            <HelpCircle className="size-12 stroke-[1.5] opacity-30" aria-hidden="true" />
            <p className="font-serif text-lg font-bold">Belum Ada Program Dampak</p>
            <p className="text-sm">
              Arsip laporan program kerja untuk kategori ini belum diterbitkan.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
