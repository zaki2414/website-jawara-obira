import Link from "next/link";
import Image from "next/image";
import { MapPin, HeartHandshake, HardDriveDownload, ArrowRight } from "lucide-react";
import { FOOTER_LINKS } from "@/constants/nav";

export default function Footer() {
  return (
    <footer className="bg-surface-container border-t-2 border-on-surface text-on-surface mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          
          {/* KOLOM IDENTITAS HUB */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-primary border-2 border-on-surface rounded text-background">
                <Image
                  src="/Logo Obi Kuning.svg"
                  alt="Logo Jawara Obira"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
              </div>
              <h3 className="font-serif text-xl font-black tracking-tight">
                Jawara Obira
              </h3>
            </div>
            <p className="text-on-surface-variant text-sm font-medium leading-relaxed max-w-sm">
              Platform pusat repositori informasi digital Desa Kawasi & Soligi, Pulau Obi. 
              Mendokumentasikan khazanah budaya, potensi komoditas, dan heritabilitas alamiah demi generasi mendatang.
            </p>
          </div>

          {/* KOLOM INTERNAL LINKING */}
          <div>
            <h4 className="font-sans font-black text-xs uppercase tracking-widest text-primary mb-4">
              Peta Arsip Dokumen
            </h4>
            <ul className="space-y-2.5 text-sm font-bold">
              {FOOTER_LINKS.map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href} 
                    className="text-on-surface-variant hover:text-on-surface inline-flex items-center gap-1 group transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-on-surface-variant/40 group-hover:text-primary transition-colors" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* KOLOM INFORMASI DATA KREDENSIAL */}
          <div>
            <h4 className="font-sans font-black text-xs uppercase tracking-widest text-primary mb-4">
              Maklumat Informasi
            </h4>
            <ul className="space-y-3 text-xs font-black uppercase tracking-wider text-on-surface-variant">
              <li className="flex items-center gap-2 bg-background border-2 border-on-surface p-2.5 rounded-lg">
                <MapPin className="w-4 h-4 text-error shrink-0" />
                <span>Pulau Obi, Halmahera Selatan</span>
              </li>
              <li className="flex items-center gap-2 bg-background border-2 border-on-surface p-2.5 rounded-lg">
                <HeartHandshake className="w-4 h-4 text-sand-500 shrink-0" />
                <span>Kolaborasi KKN UGM & Masyarakat</span>
              </li>
              <li className="flex items-center gap-2 bg-background border-2 border-on-surface p-2.5 rounded-lg">
                <HardDriveDownload className="w-4 h-4 text-tropic-500 shrink-0" />
                <span>Pangkalan Data Digital Terintegrasi</span>
              </li>
            </ul>
          </div>

        </div>

        {/* HAK CIPTA JAHITAN PUTUS-PUTUS (DASHLINE) */}
        <div className="border-t border-dashed border-outline-variant mt-10 pt-6 text-center text-xs font-bold text-on-surface-variant tracking-wide">
          © {new Date().getFullYear()} Jawara Obira. Dedikasi Digital Kolektif untuk Kawasi & Soligi.
        </div>
      </div>
    </footer>
  );
}