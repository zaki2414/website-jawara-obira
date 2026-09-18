// app/layout.tsx
import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Abril_Fatface } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { getSiteUrl } from "@/lib/siteUrl";

// Satu-satunya jalur pemuatan font — self-hosted via next/font, menggantikan
// @import render-blocking ke fonts.googleapis.com di globals.css (penyebab
// CLS 0.307 terukur). Nama variable sengaja BUKAN --font-sans/--font-heading
// supaya tidak bentrok dengan token @theme; @theme merujuk balik ke sini
// via var().
//
// PASANGAN TIPOGRAFI (mengganti Work Sans + Libre Caslon Text):
//
// Plus Jakarta Sans — teks & UI. Dirancang Tokotype untuk city branding DKI
// Jakarta, jadi pilihannya punya alasan kultural, bukan sekadar "sans yang
// enak": arsip desa Indonesia disuarakan huruf sipil Indonesia. Geometris-
// humanis, x-height tinggi, terbaca di 16px pada kertas krem #fef9f2.
//
// Bodoni Moda — display/heading. Dipilih dari referensi Pinterest yang
// mengumpulkan sembilan display serif (Begies, Bugate, Megina, Dagrin,
// Agilera, Ballgin, Remingo, Junigarden, Raglika). Kesembilannya font
// komersial berbayar, tapi semuanya berbagi satu ciri yang sama: DIDONE
// kontras tinggi — tebal-tipis ekstrem, serif rambut yang lurus dan tajam,
// ball terminal, letterfit rapat.
//
// Abril Fatface — display/heading.
//
// Percobaan ketiga, dan kedua sebelumnya gagal karena alasan yang berlawanan:
// Bodoni Moda terlalu KURUS (didone teks: rambut tipisnya mendominasi siluet di
// ukuran judul), sedangkan Fraunces cukup tebal tapi terlalu KALEM — bentuknya
// ramah, bukan artistik.
//
// Abril Fatface berasal dari genre yang memang menjawab keduanya: FAT FACE,
// huruf poster cetak Inggris awal abad ke-19. Batang vertikalnya dibuat
// setebal mungkin sementara serifnya ditarik jadi rambut halus, sehingga
// hasilnya berat dan dramatis sekaligus — persis huruf yang dipakai pada
// lembar pengumuman dan sampul arsip lama, jadi ia juga sejalan dengan dunia
// "Retro Heritage / Neobrutalist Archive" proyek ini.
//
// CATATAN TEKNIS: keluarga ini hanya punya SATU bobot (400), dan itu memang
// sudah sangat berat by design. Karena markup situs ini memakai font-black di
// mana-mana, `font-synthesis-weight: none` dipasang di globals.css supaya
// browser TIDAK menebalkannya secara sintetis — penebalan palsu pada huruf
// yang sudah gemuk membuat kontur di dalam huruf saling menutup dan hurufnya
// berubah jadi gumpalan.
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const abrilFatface = Abril_Fatface({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  // metadataBase membuat URL relatif di generateMetadata halaman anak (og:image,
  // canonical) diserap jadi URL absolut. Tanpa ini Next memperingatkan dan
  // memakai localhost saat build.
  metadataBase: new URL(getSiteUrl()),
  title: "Jawara Obira — Desa Kawasi & Soligi",
  description: "Platform informasi digital Desa Kawasi & Soligi, Pulau Obi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={cn(plusJakartaSans.variable, abrilFatface.variable, "font-sans")}>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}