// app/kkn/tim/page.tsx
import { getAllKKNTeamMembers } from "@/lib/supabase/queries";
import Image from "next/image";
import { KknPageBackground } from "@/components/kkn/KknPageBackground";
import { KKNTeamHero } from "@/components/kkn/KKNTeamHero";
import {
  KAWASI_TEAM_ACCENTS,
  SOLIGI_TEAM_ACCENTS,
  type TeamCardAccent,
} from "@/components/kkn/kknCardStyles";

export const revalidate = 3600;

type TeamMember = {
  id: string;
  name: string;
  cluster: string | null;
  study_program: string | null;
  photo_url: string | null;
  village_placement: string;
};

// Inisial dipakai kalau foto gagal dimuat — lebih baik daripada ikon orang
// generik yang sama untuk semua orang, karena inisial tetap mengidentifikasi
// siapa yang ada di kartu itu.
function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ══════════════════════════════════════════════════════════════════════
// KARTU ANGGOTA — BARIS ROSTER, BUKAN KARTU POTRET BERDIRI
//
// Susunan lama: grid 4 kolom berisi kartu potret tinggi (foto rasio 4:5 +
// blok teks di bawahnya). Dua akibatnya:
//   • Halaman jadi 5.500px lebih untuk 28 orang — tujuh baris kartu tinggi
//     yang isinya berulang, dan sebagian besar foto ada di bawah lipatan.
//   • Teks dipaksa masuk kolom selebar ~270px, sehingga nama panjang seperti
//     "Anindya Reswara Nasya Purbawarastri" dan program studi seperti
//     "Teknologi Pangan dan Hasil Pertanian - 2023" pecah jadi tiga baris
//     dan menumpuk rapat dengan chip klaster di bawahnya.
//
// Sekarang tiap anggota jadi SATU BARIS horizontal: foto persegi di kiri,
// keterangan memanjang ke kanan. Dua kolom saja (bukan empat) supaya tiap
// baris dapat ~600px — nama dan program studi terpanjang pun muat tanpa
// dipotong, dan tinggi halaman turun drastis karena satu baris memuat dua
// orang, bukan satu kartu tinggi per orang.
//
// Cincin aksennya DIPERTAHANKAN persis seperti sebelumnya: border-4 yang
// dirotasi per anggota, biru untuk Kawasi dan emas untuk Soligi
// (KAWASI_TEAM_ACCENTS / SOLIGI_TEAM_ACCENTS di kknCardStyles.ts). Strip
// aksen yang dulu jadi garis horizontal di bawah foto kini berdiri sebagai
// pemisah vertikal antara foto dan keterangan — peran yang sama, mengikuti
// arah kartunya yang berubah.
// ══════════════════════════════════════════════════════════════════════
function MemberRow({ member, accent }: { member: TeamMember; accent: TeamCardAccent }) {
  return (
    <article
      className={`group flex items-stretch overflow-hidden rounded-2xl border-4 bg-background hard-shadow hard-shadow-hover ${accent.border}`}
    >
      <div className="relative size-28 shrink-0 bg-surface-container-high sm:size-32">
        {member.photo_url ? (
          // object-[center_25%], bukan object-cover default (yang berarti
          // center 50%). Foto anggota semuanya potret berdiri, jadi memotong
          // dari titik tengah membuang kepala dan menyisakan badan/latar —
          // pada foto berlatar gelap hasilnya bahkan terbaca seperti kotak
          // kosong. Menggeser titik potong ke sepertiga atas menaruh wajah di
          // dalam bingkai persegi ini.
          <Image
            src={member.photo_url}
            alt={member.name}
            fill
            className="object-cover object-[center_25%]"
            sizes="128px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-serif text-2xl font-black text-on-surface-variant/50">
            {initials(member.name)}
          </div>
        )}
      </div>

      {/* Strip aksen — penanda warna kartu, sekaligus pemisah tegas antara
          foto dan keterangan. */}
      <div className={`w-1.5 shrink-0 ${accent.bar}`} aria-hidden="true" />

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5 px-4 py-3">
        <h3
          className={`font-serif text-base font-black leading-tight text-on-surface transition-colors sm:text-lg ${accent.hoverTitle}`}
        >
          {member.name}
        </h3>

        {member.study_program && (
          <p className="text-xs font-bold uppercase leading-snug tracking-wide text-on-surface-variant">
            {member.study_program}
          </p>
        )}

        {member.cluster && (
          <span
            className={`w-fit max-w-full rounded-full border-2 border-on-surface px-2.5 py-0.5 text-label-sm font-black uppercase tracking-wider hard-shadow-sm ${accent.chip}`}
          >
            {member.cluster}
          </span>
        )}
      </div>
    </article>
  );
}

function VillageRoster({
  title,
  list,
  accents,
  headerPill,
}: {
  title: string;
  list: TeamMember[];
  accents: readonly TeamCardAccent[];
  headerPill: string;
}) {
  if (list.length === 0) return null;

  return (
    <section className="mb-16">
      {/* Kepala seksi: nama desa memakai skala judul halaman biasa dan
          jumlahnya ikut menempel di sebelahnya sebagai angka, bukan kalimat
          "14 mahasiswa" yang berdiri sendiri di ujung kanan dan terbaca
          seperti keterangan yang terlepas dari judulnya. */}
      <div className="mb-7 flex items-baseline gap-4 border-b-4 border-on-surface pb-4">
        <h2 className="font-serif text-2xl font-black tracking-tight text-on-surface md:text-3xl">
          {title}
        </h2>
        <span
          className={`inline-flex shrink-0 items-center rounded-full border-2 border-on-surface px-3 py-0.5 text-label-sm font-black tabular uppercase tracking-wider hard-shadow-sm ${headerPill}`}
        >
          {list.length} Mahasiswa
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {list.map((member, index) => (
          <MemberRow
            key={member.id}
            member={member}
            accent={accents[index % accents.length]}
          />
        ))}
      </div>
    </section>
  );
}

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

  return (
    <main className="relative min-h-screen bg-cream-container/45 overflow-hidden">
      <KknPageBackground />

      <KKNTeamHero totalCount={members?.length ?? 0} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <VillageRoster
          title="Desa Kawasi"
          list={kawasi}
          accents={KAWASI_TEAM_ACCENTS}
          headerPill="bg-primary text-on-primary"
        />
        <VillageRoster
          title="Desa Soligi"
          list={soligi}
          accents={SOLIGI_TEAM_ACCENTS}
          headerPill="bg-tertiary text-on-tertiary"
        />
      </div>
    </main>
  );
}
