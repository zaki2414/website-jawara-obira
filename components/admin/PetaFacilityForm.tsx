// components/admin/PetaFacilityForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Save, Eye, MapPin } from "lucide-react";
import { FACILITY_ICON_BY_NAME, DEFAULT_FACILITY_ICON, type MapFacility } from "@/constants/peta";
import { PETA_ACCENT_BORDERS } from "./peta/petaCardStyles";
import ImageUploader from "./ImageUploader";
import FacilityLocationMapLoader from "./peta/FacilityLocationMapLoader";

type PetaFacilityFormProps = {
  initialData: MapFacility;
};

// Edit-only — tidak ada isNew/create di sini, baris map_facilities sudah
// tetap 1:1 dengan feature_id di public/data/fasum.geojson dan
// fasum-soligi.geojson (lihat catatan di lib/supabase/queries.ts::updateMapFacility).
export default function PetaFacilityForm({ initialData }: PetaFacilityFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [name, setName] = useState(initialData.name);
  const [description, setDescription] = useState(initialData.description || "");
  const [photoUrl, setPhotoUrl] = useState(initialData.photo_url || "");

  const Icon = FACILITY_ICON_BY_NAME[initialData.name] ?? DEFAULT_FACILITY_ICON;

  useEffect(() => {
    if (!showSuccess) return;
    const timer = setTimeout(() => setShowSuccess(false), 3000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return setMessage({ type: "error", text: "Nama fasilitas wajib diisi." });
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("map_facilities")
        .update({
          name: name.trim(),
          description: description.trim() || null,
          photo_url: photoUrl || null,
        })
        .eq("id", initialData.id);
      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => {
        router.refresh();
        router.push("/admin/peta");
      }, 1200);
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setMessage({ type: "error", text: `Gagal: ${errMessage}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Peta lokasi read-only — bukan pengganti VillageCadastralMap.tsx yang
          interaktif (peta publik /profil), cuma penunjuk visual supaya admin
          tidak menebak-nebak posisi poligon fitur yang sedang diedit. */}
      <div className="rounded-2xl border-2 border-on-surface bg-background p-4 hard-shadow-sm">
        <p className="mb-3 flex items-center gap-2 text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
          <MapPin className="size-4 shrink-0 text-on-tertiary" aria-hidden="true" />
          Lokasi &ldquo;{initialData.name}&rdquo; di Peta
        </p>
        <FacilityLocationMapLoader featureId={initialData.feature_id} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2"
      >
        {message && (
          <div
            role="alert"
            className={`flex items-center gap-2 rounded-lg border-2 p-3 text-sm font-bold ${message.type === "success" ? "border-success/30 bg-success/10 text-success" : "border-error/30 bg-error-container text-error"}`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            )}
            {message.text}
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Nama Fasilitas *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <p className="mt-1.5 text-xs text-on-surface-variant/70">
            Default terisi dari data peta (&ldquo;{initialData.name}&rdquo;) — ubah kalau perlu
            nama yang lebih lengkap, mis. &ldquo;Masjid Al-Ikhlas&rdquo;.
          </p>
        </div>

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Deskripsi
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Ceritakan sedikit tentang fasilitas ini — akan tampil di pop-up peta."
          />
        </div>

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Foto
          </label>
          <ImageUploader value={photoUrl} onChange={setPhotoUrl} label="Upload Foto Fasilitas" />
        </div>

        <div className="flex gap-4 border-t-2 border-dashed border-outline-variant pt-4">
          <Button type="submit" variant="tertiary" loading={loading}>
            {!loading && <Save className="size-4" aria-hidden="true" />}
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>

      {/* Pratinjau kartu — mencerminkan tampilan pop-up peta secara langsung
          sambil admin mengisi form, dibungkus sticky supaya tetap terlihat
          saat scroll (pola sama dengan FaunaForm/CultureForm/UMKMForm). */}
      <div className="lg:col-span-1">
        <div
          className={`overflow-hidden rounded-2xl border-4 bg-background hard-shadow-md lg:sticky lg:top-6 ${PETA_ACCENT_BORDERS[0]}`}
        >
          <div className="flex items-center gap-2 border-b-2 border-on-surface bg-surface-container-low px-4 py-3">
            <Eye className="size-4 text-on-surface-variant" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Pratinjau Pop-up
            </span>
          </div>

          <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
            {photoUrl ? (
              <Image src={photoUrl} alt={name || "Pratinjau fasilitas"} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <Icon className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
          </div>

          <div className="space-y-1 p-4">
            <h3 className="flex items-center gap-2 font-serif text-lg font-black leading-snug text-on-surface">
              <Icon className="size-4 shrink-0 text-on-tertiary" aria-hidden="true" />
              {name || "Nama Fasilitas"}
            </h3>
            <p className="line-clamp-3 text-sm text-on-surface-variant">
              {description || "Deskripsi akan tampil di sini."}
            </p>
          </div>
        </div>
      </div>
      </div>

      <Toast show={showSuccess} message="Fasilitas berhasil diperbarui!" />
    </div>
  );
}
