// components/admin/FaunaForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import ImageUploader from "./ImageUploader";

type FaunaFormProps = { initialData?: any; isNew: boolean };

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

  const defaultGallery = initialData?.documentations || [];
  const [gallery, setGallery] = useState<{ url: string; caption: string }[]>(
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

  // ✅ FIX: Hapus useEffect untuk auto-generate slug

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
          .eq("id", initialData.id);
        if (error) throw error;
      }

      setMessage({
        type: "success",
        text: `✅ Fauna berhasil ${isNew ? "ditambahkan" : "diperbarui"}!`,
      });
      setShowSuccess(true);

      // ✅ Tambahkan router.refresh() agar list otomatis update
      setTimeout(() => {
        router.refresh();
        if (!isNew) router.push("/admin/fauna-obi");
      }, 1500);
    } catch (err: any) {
      console.error("❌ Submit error:", err);
      setMessage({ type: "error", text: `❌ Gagal: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-xl shadow-sm border border-sand-200 space-y-6"
    >
      {message && (
        <div
          className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {message.text}
        </div>
      )}

      {/* Basic Info */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lokal *
          </label>
          <input
            type="text"
            value={nameLocal}
            onChange={handleNameLocalChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500 text-sm"
            placeholder="Contoh: Kakatua Putih"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Ilmiah *
          </label>
          <input
            type="text"
            value={nameScientific}
            onChange={(e) => setNameScientific(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded-lg italic focus:ring-2 focus:ring-ocean-500 text-sm"
            placeholder="Contoh: Cacatua alba"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Slug URL *
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(generateSlug(e.target.value))}
            required
            className="w-full p-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-ocean-500"
            placeholder="kakatua-putih"
          />
        </div>
      </div>

      {/* Classification */}
      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kelas
          </label>
          <input
            type="text"
            value={cls}
            onChange={(e) => setCls(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="Contoh: Aves"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ordo
          </label>
          <input
            type="text"
            value={orderName}
            onChange={(e) => setOrderName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="Contoh: Psittaciformes"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Famili
          </label>
          <input
            type="text"
            value={family}
            onChange={(e) => setFamily(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="Contoh: Cacatuidae"
          />
        </div>
      </div>

      {/* Conservation */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status IUCN
          </label>
          <select
            value={iucnStatus}
            onChange={(e) => setIucnStatus(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan Konservasi
          </label>
          <input
            type="text"
            value={conservationNotes}
            onChange={(e) => setConservationNotes(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="Contoh: Terancam punah akibat hilangnya habitat"
          />
        </div>
      </div>

      {/* Ecology */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Habitat
          </label>
          <input
            type="text"
            value={habitat}
            onChange={(e) => setHabitat(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="Contoh: Hutan hujan primer"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Makanan (Diet)
          </label>
          <input
            type="text"
            value={diet}
            onChange={(e) => setDiet(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="Contoh: Biji-bijian, buah beri"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Perilaku
          </label>
          <input
            type="text"
            value={behavior}
            onChange={(e) => setBehavior(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="Contoh: Hidup berpasangan"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sebaran di Obi
          </label>
          <input
            type="text"
            value={distribution}
            onChange={(e) => setDistribution(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg text-sm"
            placeholder="Contoh: Kawasan hutan Soligi"
          />
        </div>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Deskripsi Lengkap
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm"
          placeholder="Narasi lengkap mengenai profil hewan ini..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ciri-ciri Fisik
        </label>
        <textarea
          value={physical}
          onChange={(e) => setPhysical(e.target.value)}
          rows={3}
          className="w-full p-3 border border-gray-300 rounded-lg text-sm"
          placeholder="Contoh: Bulu putih, jambul kuning..."
        />
      </div>

      {/* Media - Thumbnail */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
      <section className="border-t border-sand-200 pt-6">
        <h3 className="font-serif text-lg font-bold text-ocean-800 mb-2">
          Gambar Pendukung (Opsional)
        </h3>
        <p className="text-sm text-gray-500 mb-4">
          Maks 2 gambar. Posisi & rotasi otomatis: Kiri (-3°) & Kanan (+3°).
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Slot 1 */}
          <div className="flex flex-col gap-2 p-4 border border-sand-200 rounded-xl bg-sand-50/30">
            <label className="block text-xs font-medium text-gray-500">
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
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-ocean-500 text-gray-700"
            />
          </div>

          {/* Slot 2 */}
          <div className="flex flex-col gap-2 p-4 border border-sand-200 rounded-xl bg-sand-50/30">
            <label className="block text-xs font-medium text-gray-500">
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
              className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-ocean-500 text-gray-700"
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
                  className="flex flex-col sm:flex-row gap-4 p-4 border border-sand-200 rounded-xl bg-sand-50/30 relative"
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
                      <label className="block text-xs font-medium text-gray-500 mb-1">
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
                        className="w-full p-2.5 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-ocean-500 text-gray-700"
                      />
                    </div>
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => removeExtraImage(actualIndex)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Hapus Entry
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={addExtraImage}
            className="text-sm font-medium text-ocean-600 hover:text-ocean-700 transition hover:underline"
          >
            + Tambah Foto Tambahan
          </button>
        </div>
      </section>

      {/* Actions */}
      <div className="flex gap-4 pt-4 border-t border-sand-200">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition disabled:opacity-50 text-sm"
        >
          {loading ? "Menyimpan..." : isNew ? "📤 Simpan Fauna" : "💾 Update"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition text-sm"
        >
          Batal
        </button>
      </div>

      {/* Toast Pop-up Success */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-up flex items-center gap-2 text-sm font-medium">
          <span>✅</span>
          <span>Fauna berhasil {isNew ? "ditambahkan" : "diperbarui"}!</span>
        </div>
      )}
    </form>
  );
}
