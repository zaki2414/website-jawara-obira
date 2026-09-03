// app/layout.tsx
import type { Metadata } from "next";
import { Work_Sans, Libre_Caslon_Text } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { cn } from "@/lib/utils";

// Satu-satunya jalur pemuatan font — self-hosted via next/font, menggantikan
// @import render-blocking ke fonts.googleapis.com di globals.css (penyebab
// CLS 0.307 terukur) SEKALIGUS 3 next/font lama yang tidak dipakai
// (Inter, Playfair_Display×2, Noto_Sans — variabelnya bentrok nama dengan
// token --font-sans/--font-heading di @theme dan tak pernah dirujuk di luar
// file ini). Nama variable sengaja BUKAN --font-sans/--font-heading supaya
// tidak bentrok dengan token @theme; @theme merujuk balik ke sini via var().
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const libreCaslonText = Libre_Caslon_Text({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-libre-caslon",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jawara Obira — Desa Kawasi & Soligi",
  description: "Platform informasi digital Desa Kawasi & Soligi, Pulau Obi.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={cn(workSans.variable, libreCaslonText.variable, "font-sans")}>
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