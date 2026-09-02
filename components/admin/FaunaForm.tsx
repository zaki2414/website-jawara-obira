// components/admin/FaunaForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, Save, Plus, Trash2, Eye, Bird } from "lucide-react";
import { getIucnBrutalistClass, parseFaunaImages, type Fauna, type FaunaImage } from "@/constants/fauna";
import { FAUNA_ACCENT_BORDERS } from "./fauna-obi/faunaCardStyles";
import ImageUploader from "./ImageUploader";

type FaunaFormProps = { initialData?: Fauna | null; isNew: boolean };

const IUCN_OPTIONS = [
  "Least Concern (LC)",
  "Near Threatened (NT)",
  "Vulnerable (VU)",
  "Endangered (EN)",
  "Critically Endangered (CR)",
  "Extinct in Wild (EW)",
  "Extinct (EX)",
];

export default function FaunaForm({ initialData, isNew }: FaunaFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const [nameLocal, setNameLocal] = useState(initialData?.name_local || "");
  const [nameScientific, setNameScientific] = useState(
    initialData?.name_scientific || "",
  );
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [cls, setCls] = useState(initialData?.class || "");
  const [orderName, setOrderName] = useState(initialData?.order_name || "");
  const [family, setFamily] = useState(initialData?.family || "");
  const [iucnStatus, setIucnStatus] = useState(initialData?.iucn_status || "");
  const [conservationNotes, setConservationNotes] = useState(
    initialData?.conservation_notes || "",
  );
  const [habitat, setHabitat] = useState(initialData?.habitat || "");
  const [diet, setDiet] = useState(initialData?.diet || "");
  const [behavior, setBehavior] = useState(initialData?.behavior || "");
  const [distribution, setDistribution] = useState(
    initialData?.distribution || "",
  );
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [physical, setPhysical] = useState(
    initialData?.physical_characteristics || "",
  );
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail_url || "");

  const defaultGallery = parseFaunaImages(initialData?.documentations);
  const [gallery, setGallery] = useState<FaunaImage[]>(
    defaultGallery.length > 0
      ? defaultGallery
      : [
          { url: "", caption: "" },
          { url: "", caption: "" },
        ],
  );

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // ✅ FIX: Pindahkan logika auto-generate slug ke event handler
  const handleNameLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setNameLocal(newName);
    if (isNew && !initialData?.slug) {
      setSlug(generateSlug(newName));
    }
  };

  const addExtraImage = () =>
    setGallery([...gallery, { url: "", caption: "" }]);
  const updateExtraImage = (
    i: number,
    field: "url" | "caption",
    val: string,
  ) => {
    const newGallery = [...gallery];
    newGallery[i] = { ...newGallery[i], [field]: val };
    setGallery(newGallery);
  };
  const removeExtraImage = (i: number) =>
    setGallery(gallery.filter((_, idx) => idx !== i));

  const resetForm = () => {
    setNameLocal("");
    setNameScientific("");
    setSlug("");
    setCls("");
    setOrderName("");
    setFamily("");
    setIucnStatus("");
    setConservationNotes("");
    setHabitat("");
    setDiet("");
    setBehavior("");
    setDistribution("");
    setDescription("");
    setPhysical("");
    setThumbnail("");
    setGallery([
      { url: "", caption: "" },
      { url: "", caption: "" },
    ]);
    setFormKey((prev) => prev + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameLocal || !nameScientific) {
      return setMessage({
        type: "error",
        text: "Nama Lokal dan Ilmiah wajib diisi.",
      });
    }

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const validGallery = gallery.filter((img) => img.url);

      // ✅ Payload disesuaikan dengan struktur database aslimu
      const payload = {
        name_local: nameLocal,
        name_scientific: nameScientific,
        slug,
        class: cls,
        order_name: orderName,
        family,
        iucn_status: iucnStatus,
        conservation_notes: conservationNotes,
        habitat,
        diet,
        behavior,
        distribution,
        description,
        physical_characteristics: physical,
        thumbnail_url: thumbnail || null,
        documentations: validGallery.length > 0 ? validGallery : null,
      };

      if (isNew) {
        const { error } = await supabase.from("fauna_obi").insert(payload);
        if (error) throw error;
        resetForm();
      } else {
        const { error } = await supabase
          .from("fauna_obi")
          .update(payload)
          .eq("id", initialData!.id);
        if (error) throw error;
      }

      setMessage({
        type: "success",
        text: `Fauna berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`,
      });
      setShowSuccess(true);

      // ✅ Tambahkan router.refresh() agar list otomatis update
      setTimeout(() => {
        router.refresh();
        if (!isNew) router.push("/admin/fauna-obi");
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      console.error("Submit error:", err);
      setMessage({ type: "error", text: `Gagal: ${errorMessage}` });
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
            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-bold ${message.type === "success" ? "bg-success/10 border-success text-success" : "bg-error-container border-error text-error"}`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            )}
            {message.text}
          </div>
        )}

        {/* Basic Info */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Nama Lokal *
            </label>
            <input
              type="text"
              value={nameLocal}
              onChange={handleNameLocalChange}
              required
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Kakatua Putih"
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Nama Ilmiah *
            </label>
            <input
              type="text"
              value={nameScientific}
              onChange={(e) => setNameScientific(e.target.value)}
              required
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface italic text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Cacatua alba"
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Slug URL *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              required
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="kakatua-putih"
            />
          </div>
        </div>

        {/* Classification */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Kelas
            </label>
            <input
              type="text"
              value={cls}
              onChange={(e) => setCls(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Aves"
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Ordo
            </label>
            <input
              type="text"
              value={orderName}
              onChange={(e) => setOrderName(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Psittaciformes"
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Famili
            </label>
            <input
              type="text"
              value={family}
              onChange={(e) => setFamily(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Cacatuidae"
            />
          </div>
        </div>

        {/* Conservation */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Status IUCN
            </label>
            <select
              value={iucnStatus}
              onChange={(e) => setIucnStatus(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">-- Pilih Status --</option>
              {IUCN_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Catatan Konservasi
            </label>
            <input
              type="text"
              value={conservationNotes}
              onChange={(e) => setConservationNotes(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Terancam punah akibat hilangnya habitat"
            />
          </div>
        </div>

        {/* Ecology */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Habitat
            </label>
            <input
              type="text"
              value={habitat}
              onChange={(e) => setHabitat(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Hutan hujan primer"
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Makanan (Diet)
            </label>
            <input
              type="text"
              value={diet}
              onChange={(e) => setDiet(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Biji-bijian, buah beri"
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Perilaku
            </label>
            <input
              type="text"
              value={behavior}
              onChange={(e) => setBehavior(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Hidup berpasangan"
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Sebaran di Obi
            </label>
            <input
              type="text"
              value={distribution}
              onChange={(e) => setDistribution(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Kawasan hutan Soligi"
            />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
            Deskripsi Lengkap
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Narasi lengkap mengenai profil hewan ini..."
          />
        </div>
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
            Ciri-ciri Fisik
          </label>
          <textarea
            value={physical}
            onChange={(e) => setPhysical(e.target.value)}
            rows={3}
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Contoh: Bulu putih, jambul kuning..."
          />
        </div>

        {/* Media - Thumbnail */}
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
            Thumbnail Utama
          </label>
          <ImageUploader
            key={`fauna-thumb-${formKey}`}
            value={thumbnail}
            onChange={setThumbnail}
            label="Upload Foto Utama"
          />
        </div>

        {/* Gallery Section */}
        <section className="border-t-2 border-dashed border-outline-variant pt-6">
          <h3 className="font-serif text-lg font-black text-on-surface mb-2">
            Gambar Pendukung (Opsional)
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Maks 2 gambar. Posisi & rotasi otomatis: Kiri (-3°) & Kanan (+3°).
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Slot 1 */}
            <div className="flex flex-col gap-2 p-4 border-2 border-outline-variant rounded-xl bg-surface-container-low">
              <label className="block text-label-sm font-bold text-on-surface-variant">
                Slot Foto 1 (Rotasi Kiri)
              </label>
              <ImageUploader
                key={`fauna-extra-0-${formKey}`}
                value={gallery[0]?.url || ""}
                onChange={(url) => updateExtraImage(0, "url", url)}
                label="Upload Foto 1"
              />
              <input
                type="text"
                value={gallery[0]?.caption || ""}
                onChange={(e) => updateExtraImage(0, "caption", e.target.value)}
                placeholder="Caption Foto 1 (opsional)"
                className="w-full p-2.5 border-2 border-on-surface rounded-lg text-sm bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>

            {/* Slot 2 */}
            <div className="flex flex-col gap-2 p-4 border-2 border-outline-variant rounded-xl bg-surface-container-low">
              <label className="block text-label-sm font-bold text-on-surface-variant">
                Slot Foto 2 (Rotasi Kanan)
              </label>
              <ImageUploader
                key={`fauna-extra-1-${formKey}`}
                value={gallery[1]?.url || ""}
                onChange={(url) => updateExtraImage(1, "url", url)}
                label="Upload Foto 2"
              />
              <input
                type="text"
                value={gallery[1]?.caption || ""}
                onChange={(e) => updateExtraImage(1, "caption", e.target.value)}
                placeholder="Caption Foto 2 (opsional)"
                className="w-full p-2.5 border-2 border-on-surface rounded-lg text-sm bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {gallery.length > 2 && (
            <div className="mt-4 space-y-4">
              {gallery.slice(2, 6).map((img, i) => {
                const actualIndex = i + 2;
                return (
                  <div
                    key={actualIndex}
                    className="flex flex-col sm:flex-row gap-4 p-4 border-2 border-outline-variant rounded-xl bg-surface-container-low relative"
                  >
                    <div className="w-full sm:w-36 shrink-0">
                      <ImageUploader
                        key={`extra-${actualIndex}-${formKey}`}
                        value={img.url}
                        onChange={(url) =>
                          updateExtraImage(actualIndex, "url", url)
                        }
                        label={`Foto ${actualIndex + 1}`}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between pt-1">
                      <div>
                        <label className="block text-label-sm font-bold text-on-surface-variant mb-1">
                          Keterangan Gambar tambahan
                        </label>
                        <input
                          type="text"
                          value={img.caption}
                          onChange={(e) =>
                            updateExtraImage(
                              actualIndex,
                              "caption",
                              e.target.value,
                            )
                          }
                          placeholder="Caption tambahan..."
                          className="w-full p-2.5 border-2 border-on-surface rounded-lg text-sm bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExtraImage(actualIndex)}
                          className="text-error hover:text-error hover:bg-error-container/20"
                        >
                          <Trash2 className="size-3.5" aria-hidden="true" />
                          Hapus Entry
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div className="flex justify-end mt-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addExtraImage}
            >
              <Plus className="size-3.5" aria-hidden="true" />
              Tambah Foto Tambahan
            </Button>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-4 pt-4 border-t-2 border-dashed border-outline-variant">
          <Button type="submit" variant="cream" loading={loading}>
            {!loading && <Save className="size-4" aria-hidden="true" />}
            {isNew ? "Simpan Fauna" : "Update Fauna"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>

      {/* Pratinjau kartu — mencerminkan tampilan roster secara langsung sambil
          admin mengisi form, dibungkus sticky supaya tetap terlihat saat scroll. */}
      <div className="lg:col-span-1">
        <div
          className={`overflow-hidden rounded-2xl border-4 bg-background hard-shadow-md lg:sticky lg:top-6 ${FAUNA_ACCENT_BORDERS[0]}`}
        >
          <div className="flex items-center gap-2 border-b-2 border-on-surface bg-surface-container-low px-4 py-3">
            <Eye className="size-4 text-on-surface-variant" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Pratinjau Kartu
            </span>
          </div>

          <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
            {thumbnail ? (
              <Image
                src={thumbnail}
                alt={nameLocal || "Pratinjau foto fauna"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <Bird className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
            {iucnStatus && (
              <span
                className={`absolute right-2 top-2 inline-flex rounded-full border-2 border-on-surface px-2.5 py-1 text-label-md font-black uppercase tracking-wide ${getIucnBrutalistClass(iucnStatus)}`}
              >
                {iucnStatus}
              </span>
            )}
          </div>

          <div className="space-y-1 p-4">
            <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
              {nameLocal || "Nama Lokal"}
            </h3>
            <p className="text-sm italic font-bold text-on-cream">
              {nameScientific || "Nama Ilmiah"}
            </p>
            <p className="text-sm text-on-surface-variant">{cls || "Kelas belum diisi"}</p>
          </div>
        </div>
      </div>

      <Toast show={showSuccess} message={`Fauna berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`} />
    </div>
  );
}
