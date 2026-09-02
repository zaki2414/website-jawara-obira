// components/admin/VillageForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle, Save, Eye, Landmark } from "lucide-react";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { VillagePayload, VillageStatisticsPayload } from "@/lib/supabase/queries";
import { VILLAGE_VISUAL_META, type VillageKey } from "@/constants/profil";
import ImageUploader from "./ImageUploader";

export type VillageFormInitialData = {
  id: string;
  slug: string;
  name: string;
  title: string | null;
  description: string | null;
  long_description: string | null;
  highlight: string | null;
  thumbnail_url: string | null;
  village_statistics: {
    population: number | null;
    households: number | null;
    hamlets: number | null;
    area_km2: number | null;
  } | null;
};

type VillageFormProps = {
  initialData: VillageFormInitialData;
};

// Edit-only — sama seperti PetaFacilityForm.tsx: baris `villages` sudah
// tetap (cuma Kawasi & Soligi, seed sekali, tidak ada isNew/create/delete
// di sini). Nama & slug SENGAJA tidak bisa diedit — slug dipakai sebagai
// VillageKey literal ("kawasi"/"soligi") di banyak tempat kode (peta
// kadaster, picker, dst.), mengubahnya lewat form akan memutus semua itu.
export default function VillageForm({ initialData }: VillageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [longDescription, setLongDescription] = useState(initialData.long_description || "");
  const [highlight, setHighlight] = useState(initialData.highlight || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(initialData.thumbnail_url || "");

  const [population, setPopulation] = useState(
    initialData.village_statistics?.population?.toString() || "",
  );
  const [households, setHouseholds] = useState(
    initialData.village_statistics?.households?.toString() || "",
  );
  const [hamlets, setHamlets] = useState(
    initialData.village_statistics?.hamlets?.toString() || "",
  );
  const [areaKm2, setAreaKm2] = useState(
    initialData.village_statistics?.area_km2?.toString() || "",
  );

  const Icon = VILLAGE_VISUAL_META[initialData.slug as VillageKey]?.icon ?? Landmark;

  const toIntOrNull = (val: string) => (val.trim() ? parseInt(val, 10) : null);
  const toFloatOrNull = (val: string) => (val.trim() ? parseFloat(val) : null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const payload: VillagePayload = {
        name: initialData.name,
        title: title.trim() || null,
        description: description.trim() || null,
        long_description: longDescription.trim() || null,
        highlight: highlight.trim() || null,
        thumbnail_url: thumbnailUrl || null,
      };
      const statsPayload: VillageStatisticsPayload = {
        population: toIntOrNull(population),
        households: toIntOrNull(households),
        hamlets: toIntOrNull(hamlets),
        area_km2: toFloatOrNull(areaKm2),
      };

      const supabase = createClient();
      const { error: villageError } = await supabase
        .from("villages")
        .update(payload)
        .eq("id", initialData.id);
      if (villageError) throw villageError;

      const { error: statsError } = await supabase
        .from("village_statistics")
        .update(statsPayload)
        .eq("village_id", initialData.id);
      if (statsError) throw statsError;

      setShowSuccess(true);
      setTimeout(() => {
        router.refresh();
        router.push("/admin/desa");
      }, 1200);
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setMessage({ type: "error", text: `Gagal: ${errMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2"
      >
        {message && (
          <div
            role="alert"
            className="flex items-center gap-2 rounded-lg border-2 border-error/30 bg-error-container p-3 text-sm font-bold text-error"
          >
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {message.text}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Nama Desa
          </label>
          <input
            value={initialData.name}
            disabled
            className="w-full cursor-not-allowed rounded-lg border-2 border-outline-variant bg-surface-container-low p-3 text-on-surface-variant"
          />
          <p className="mt-1.5 text-xs text-on-surface-variant/70">
            Nama & slug desa tidak bisa diubah dari sini — dipakai sebagai kunci internal di kode
            (peta kadaster, dsb).
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Julukan / Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Penjaga Samudera"
            className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Highlight (badge di foto)
          </label>
          <input
            value={highlight}
            onChange={(e) => setHighlight(e.target.value)}
            placeholder="Contoh: Potensi Maritim"
            className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Deskripsi Singkat
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Deskripsi Lengkap (tampil di panel detail /profil)
          </label>
          <textarea
            value={longDescription}
            onChange={(e) => setLongDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        <div className="border-t-2 border-dashed border-outline-variant pt-4">
          <h3 className="mb-3 font-black text-on-surface">Statistik Desa</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
                Populasi (jiwa)
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={population}
                onChange={(e) => setPopulation(e.target.value)}
                className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
                Jumlah KK
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={households}
                onChange={(e) => setHouseholds(e.target.value)}
                className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
                Jumlah Dusun
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={hamlets}
                onChange={(e) => setHamlets(e.target.value)}
                className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
                Luas Wilayah (km²)
              </label>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                value={areaKm2}
                onChange={(e) => setAreaKm2(e.target.value)}
                className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-outline-variant pt-4">
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Foto Desa
          </label>
          <ImageUploader value={thumbnailUrl} onChange={setThumbnailUrl} label="Upload Foto Desa" />
        </div>

        <div className="flex gap-4 border-t-2 border-dashed border-outline-variant pt-4">
          <Button type="submit" variant="primary" loading={loading}>
            {!loading && <Save className="size-4" aria-hidden="true" />}
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>

      {/* Pratinjau kartu — mencerminkan tampilan panel detail /profil secara
          langsung sambil admin mengisi form, dibungkus sticky supaya tetap
          terlihat saat scroll (pola sama dengan PetaFacilityForm/UMKMForm). */}
      <div className="lg:col-span-1">
        <div className="overflow-hidden rounded-2xl border-4 border-on-surface bg-background hard-shadow-md lg:sticky lg:top-6">
          <div className="flex items-center gap-2 border-b-2 border-on-surface bg-surface-container-low px-4 py-3">
            <Eye className="size-4 text-on-surface-variant" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Pratinjau Panel Detail
            </span>
          </div>

          <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
            {thumbnailUrl ? (
              <Image src={thumbnailUrl} alt={initialData.name} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <Icon className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="space-y-1 p-4">
            <h3 className="flex items-center gap-2 font-serif text-lg font-black leading-snug text-on-surface">
              <Icon className="size-4 shrink-0 text-primary" aria-hidden="true" />
              {initialData.name}
            </h3>
            {title && (
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{title}</p>
            )}
            <p className="line-clamp-3 text-sm text-on-surface-variant">
              {longDescription || "Deskripsi lengkap akan tampil di sini."}
            </p>
          </div>
        </div>
      </div>

      <Toast show={showSuccess} message="Data desa berhasil diperbarui!" />
    </div>
  );
}
