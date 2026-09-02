// components/profil/VillageDetailPanel.tsx
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Maximize2, Home, MapPinned, Sparkles, X, Landmark } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { VILLAGE_VISUAL_META, type VillageContent, type VillageKey } from "@/constants/profil";

type VillageDetailPanelProps = {
  villages: Record<VillageKey, VillageContent>;
  village: VillageKey | null;
  onClose: () => void;
};

// Dulu jadi kartu 5/12-kolom di sisi kanan peta (components/kkn/InteractiveMap.tsx)
// dengan tombol "Buka Arsip Detail" yang mengarah ke rute /profil/[slug] yang
// TIDAK PERNAH ADA (link mati). Sekarang: full-width, "terbuka" di bawah peta
// hanya saat ada desa terpilih (tidak ada state kosong lagi), tanpa link mati itu.
//
// Konten (nama, deskripsi, statistik, foto) datang dari prop `villages` yang
// dirakit di app/profil/page.tsx dari tabel `villages`+`village_statistics`
// (dikelola admin di /admin/desa) — bukan hardcode lagi, jadi field
// title/longDesc/highlight/image bisa null selama admin belum mengisinya.
export function VillageDetailPanel({ villages, village, onClose }: VillageDetailPanelProps) {
  const data = village ? villages[village] : null;
  // Ikon di-resolve DI SINI (client) dari VILLAGE_VISUAL_META, bukan dari
  // `data.icon` — VillageContent sengaja tidak menyimpan referensi komponen
  // React karena tidak boleh lewat props Server->Client (lihat catatan di
  // constants/profil.ts).
  const Icon = village ? VILLAGE_VISUAL_META[village]?.icon : undefined;

  return (
    <AnimatePresence>
      {data && (
        <motion.div
          key={data.id}
          initial={{ opacity: 0, y: -12, height: 0 }}
          animate={{ opacity: 1, y: 0, height: "auto" }}
          exit={{ opacity: 0, y: -12, height: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="overflow-hidden"
        >
          <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-0 overflow-hidden rounded-2xl border-4 border-on-surface bg-background hard-shadow-lg md:grid-cols-5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup detail wilayah"
              className="absolute right-3 top-3 z-10 inline-flex rounded-full border-2 border-on-surface bg-background p-1.5 text-on-surface hard-shadow-sm hard-shadow-hover press-effect"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="relative h-56 md:col-span-2 md:h-full md:min-h-72 bg-surface-container-high">
              {data.image ? (
                <Image
                  src={data.image}
                  alt={data.name}
                  fill
                  sizes="(min-width: 768px) 40vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-on-surface-variant/30">
                  <Landmark className="size-16 stroke-[1.25]" aria-hidden="true" />
                </div>
              )}
              <div className={`absolute inset-0 opacity-15 mix-blend-multiply ${data.badgeColor.split(" ")[0]}`} />
              {data.highlight && (
                <Badge variant="solid-tertiary" className="absolute bottom-3 left-3">
                  <Sparkles className="size-3" aria-hidden="true" />
                  {data.highlight}
                </Badge>
              )}
            </div>

            <div className="flex flex-col justify-between p-6 md:col-span-3 md:p-8">
              <div>
                <div className="mb-4 flex items-center gap-3 border-b-2 border-dashed border-on-surface/20 pb-4">
                  {Icon && (
                    <Icon className={`size-9 shrink-0 rounded-lg border-2 p-2 ${data.badgeColor}`} aria-hidden="true" />
                  )}
                  <div>
                    <h3 className="font-serif text-2xl font-black tracking-tight text-on-surface">
                      {data.name}
                    </h3>
                    {data.title && (
                      <p className="text-xs font-bold uppercase tracking-widest text-primary">
                        {data.title}
                      </p>
                    )}
                  </div>
                </div>
                <p className="text-on-surface-variant font-medium leading-relaxed">
                  {data.longDesc || data.description || "Deskripsi desa ini belum ditambahkan admin."}
                </p>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-xl border-2 border-on-surface bg-surface-container-low p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-label-sm font-black uppercase tracking-widest text-tertiary">
                    <Users className="size-3.5" aria-hidden="true" /> Populasi
                  </div>
                  <p className="font-serif text-lg font-black text-on-surface">
                    {data.population != null ? `${data.population.toLocaleString("id-ID")} Jiwa` : "—"}
                  </p>
                </div>
                <div className="rounded-xl border-2 border-on-surface bg-surface-container-low p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-label-sm font-black uppercase tracking-widest text-primary">
                    <Maximize2 className="size-3.5" aria-hidden="true" /> Wilayah
                  </div>
                  <p className="font-serif text-lg font-black text-on-surface">
                    {data.areaKm2 != null ? `${data.areaKm2.toLocaleString("id-ID")} km²` : "—"}
                  </p>
                </div>
                <div className="rounded-xl border-2 border-on-surface bg-surface-container-low p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-label-sm font-black uppercase tracking-widest text-tertiary">
                    <Home className="size-3.5" aria-hidden="true" /> KK
                  </div>
                  <p className="font-serif text-lg font-black text-on-surface">
                    {data.households != null ? data.households.toLocaleString("id-ID") : "—"}
                  </p>
                </div>
                <div className="rounded-xl border-2 border-on-surface bg-surface-container-low p-3">
                  <div className="mb-1 flex items-center gap-1.5 text-label-sm font-black uppercase tracking-widest text-primary">
                    <MapPinned className="size-3.5" aria-hidden="true" /> Dusun
                  </div>
                  <p className="font-serif text-lg font-black text-on-surface">
                    {data.hamlets != null ? data.hamlets.toLocaleString("id-ID") : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
