// app/loading.tsx
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-natural-paper px-4">
      {/* KARTU PROSES MEMUAT DATA BERGAYA ARSIP FISIK */}
      <div className="bg-background border-4 border-on-surface p-8 rounded-2xl hard-shadow-sm text-center max-w-xs w-full flex flex-col items-center gap-4">
        
        {/* KOTAK IKON ROTASI TEBAL */}
        <div className="p-3 bg-surface-container border-2 border-on-surface rounded-xl text-on-surface animate-spin">
          <Loader2 className="w-8 h-8 stroke-[2.5]" />
        </div>
        
        <div>
          <h3 className="font-serif font-black text-lg text-on-surface uppercase tracking-wider">
            Memuat Berkas
          </h3>
          <p className="text-xs font-bold text-on-surface-variant mt-1 animate-pulse">
            Menyelaraskan data kearsipan Obira...
          </p>
        </div>

      </div>
    </div>
  );
}