// app/not-found.tsx
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-aged-paper px-4 py-12">
      {/* BOKS PERINGATAN ERROR 404 BRUTALIST */}
      <div className="bg-background border-4 border-on-surface p-8 md:p-12 rounded-2xl hard-shadow-lg text-center max-w-md w-full space-y-6 animate-fade-in">
        
        {/* EMBLEM BLOK INDIKATOR MENCALONG MIRING */}
        <div className="inline-flex p-4 bg-[#ef4444] text-white border-4 border-on-surface rounded-2xl hard-shadow-sm -rotate-3 mx-auto">
          <FileQuestion className="w-12 h-12 stroke-[2.5]" />
        </div>

        {/* INFORMASI TENTANG KEBERADAAN BERKAS */}
        <div className="space-y-2">
          <span className="inline-block text-[10px] font-black uppercase tracking-widest bg-surface-container border border-on-surface px-2.5 py-0.5 rounded text-on-surface-variant">
            Error 404 • Dokumen Hilang
          </span>
          <h1 className="font-serif text-3xl md:text-4xl font-black text-on-surface tracking-tight">
            Halaman Tidak Ada
          </h1>
          <p className="text-sm font-medium text-on-surface-variant leading-relaxed">
            Arsip atau lembaran informasi yang Anda cari mungkin telah dipindahkan, 
            dihapus, atau belum diterbitkan dalam pangkalan data sistem Jawara Obira.
          </p>
        </div>

        {/* CHUNKY INTERACTION BUTTON TO BACK TO HOME */}
        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-background bg-on-surface border-2 border-on-surface px-6 py-3.5 rounded-xl hard-shadow-sm hover:-translate-x-0.75 hover:-translate-y-0.75 hover:hard-shadow-md active:translate-x-0 active:translate-y-0 transition-all duration-150 w-full justify-center"
          >
            <ArrowLeft className="w-4 h-4" /> Kembali ke Beranda
          </Link>
        </div>

      </div>
    </div>
  );
}