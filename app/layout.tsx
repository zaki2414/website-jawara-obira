// app/layout.tsx
import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
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
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="flex flex-col min-h-screen">
        <Navbar />
        {/* 🛠️ PERBAIKAN: Hapus max-w, mx-auto, dan padding di sini agar children bisa full-width */}
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}