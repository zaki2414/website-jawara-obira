// components/admin/KKNTeamForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, Eye, Save, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Toast } from "@/components/ui/Toast";
import { getVillageTags } from "./kkn/KKNTeamMemberCard";
import { KKN_ACCENT_BORDERS } from "./kkn/kknCardStyles";
import ImageUploader from "./ImageUploader";

export interface KKNTeamMemberData {
  id: string;
  name: string;
  cluster: string;
  study_program: string;
  village_placement: string;
  photo_url: string | null;
}

type KKNTeamFormProps = {
  initialData?: KKNTeamMemberData | null;
  isNew: boolean;
};

const inputClass =
  "w-full rounded-lg border-2 border-on-surface bg-background p-3 text-on-surface transition-colors focus:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary";

export default function KKNTeamForm({ initialData, isNew }: KKNTeamFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialData?.name || "");
  const [cluster, setCluster] = useState(initialData?.cluster || "");
  const [studyProgram, setStudyProgram] = useState(initialData?.study_program || "");
  const [villagePlacement, setVillagePlacement] = useState(
    initialData?.village_placement || "kawasi",
  );
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url || "");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const payload = {
      name,
      cluster,
      study_program: studyProgram,
      village_placement: villagePlacement,
      photo_url: photoUrl || null,
    };

    try {
      const supabase = createClient();

      if (isNew) {
        const { error } = await supabase.from("kkn_members").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("kkn_members")
          .update(payload)
          .eq("id", initialData?.id);
        if (error) throw error;
      }

      setMessage({ type: "success", text: "Anggota tim berhasil disimpan." });
      setShowSuccess(true);

      setTimeout(() => {
        router.refresh();
        router.push("/admin/kkn/tim");
      }, 1000);
    } catch (err) {
      const text = err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      console.error("Error saving member:", err);
      setMessage({ type: "error", text: `Gagal menyimpan: ${text}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2"
      >
        {message && (
          <div
            role="alert"
            className={`flex items-center gap-2 rounded-lg border-2 p-3 text-sm font-bold ${
              message.type === "success"
                ? "border-success bg-success/10 text-success"
                : "border-error bg-error-container text-error"
            }`}
          >
            <AlertTriangle className="size-4 shrink-0" aria-hidden="true" />
            {message.text}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant"
            >
              Nama Lengkap *
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Nama Lengkap"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="cluster"
              className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant"
            >
              Klaster *
            </label>
            <input
              id="cluster"
              name="cluster"
              value={cluster}
              onChange={(e) => setCluster(e.target.value)}
              required
              placeholder="Contoh: Saintek, Agro"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="study_program"
              className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant"
            >
              Program Studi *
            </label>
            <input
              id="study_program"
              name="study_program"
              value={studyProgram}
              onChange={(e) => setStudyProgram(e.target.value)}
              required
              placeholder="Contoh: Teknologi Informasi"
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="village_placement"
              className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant"
            >
              Penempatan Desa *
            </label>
            <select
              id="village_placement"
              name="village_placement"
              value={villagePlacement}
              onChange={(e) => setVillagePlacement(e.target.value)}
              required
              className={inputClass}
            >
              <option value="kawasi">Kawasi</option>
              <option value="soligi">Soligi</option>
            </select>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
            Foto Profil
          </label>
          <ImageUploader value={photoUrl} onChange={setPhotoUrl} label="Upload Foto" />
        </div>

        <div className="flex gap-4 border-t-2 border-dashed border-outline-variant pt-4">
          <Button type="submit" variant="tertiary" loading={loading}>
            {!loading && <Save className="size-4" aria-hidden="true" />}
            {isNew ? "Simpan Anggota" : "Update Data"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            <X className="size-4" aria-hidden="true" />
            Batal
          </Button>
        </div>
      </form>

      {/* Pratinjau kartu — mencerminkan tampilan roster secara langsung sambil
          admin mengisi form, dibungkus sticky supaya tetap terlihat saat scroll. */}
      <div className="lg:col-span-1">
        <div
          className={`overflow-hidden rounded-2xl border-4 bg-background hard-shadow-md lg:sticky lg:top-6 ${KKN_ACCENT_BORDERS[0]}`}
        >
          <div className="flex items-center gap-2 border-b-2 border-on-surface bg-surface-container-low px-4 py-3">
            <Eye className="size-4 text-on-surface-variant" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Pratinjau Kartu
            </span>
          </div>

          <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
            {photoUrl ? (
              <Image
                src={photoUrl}
                alt={name || "Pratinjau foto anggota"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <User className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
            <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1.5">
              {getVillageTags(villagePlacement).map((tag) => (
                <Badge key={tag} variant="solid-outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1 p-4">
            <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
              {name || "Nama Anggota"}
            </h3>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              {cluster || "Klaster"}
            </p>
            <p className="text-sm text-on-surface-variant">{studyProgram || "Program Studi"}</p>
          </div>
        </div>
      </div>

      <Toast
        show={showSuccess}
        message={`Anggota tim berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`}
      />
    </div>
  );
}
