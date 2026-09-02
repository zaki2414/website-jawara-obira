// components/admin/KKNProkerForm.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/utils";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  FileText,
  BarChart3,
  Images,
  Save,
  Trash2,
  Plus,
  CheckCircle2,
  AlertCircle,
  Eye,
  Rocket,
} from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import { getJournalVillageTags, KKN_ACCENT_BORDERS } from "./kkn/kknCardStyles";

type KKNProkerDoc = { url: string; caption: string };
type KKNProkerVillage = { id: string; name: string; slug: string };

export interface KKNProkerData {
  id: string;
  title: string;
  slug: string;
  village_slug?: string | null;
  villages?: { slug: string; name?: string } | null;
  short_description?: string | null;
  goals?: string | null;
  image_url?: string | null;
  impact_metrics?: Record<string, string> | null;
  documentation?: KKNProkerDoc[] | string | null;
}

type KKNProkerFormProps = {
  initialData?: KKNProkerData | null;
  isNew: boolean;
};

export default function KKNProkerForm({
  initialData,
  isNew,
}: KKNProkerFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [villages, setVillages] = useState<KKNProkerVillage[]>([]);

  // Form state
  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [village, setVillage] = useState(
    initialData?.village_slug || initialData?.villages?.slug || "",
  );
  const [shortDesc, setShortDesc] = useState(
    initialData?.short_description || "",
  );
  const [content, setContent] = useState(initialData?.goals || "");

  // Cover image (single)
  const [coverUrl, setCoverUrl] = useState(initialData?.image_url || "");

  // Metrics (3 boxes)
  const [metric1Num, setMetric1Num] = useState(
    initialData?.impact_metrics?.m1_num || "",
  );
  const [metric1Label, setMetric1Label] = useState(
    initialData?.impact_metrics?.m1_label || "",
  );
  const [metric2Num, setMetric2Num] = useState(
    initialData?.impact_metrics?.m2_num || "",
  );
  const [metric2Label, setMetric2Label] = useState(
    initialData?.impact_metrics?.m2_label || "",
  );
  const [metric3Num, setMetric3Num] = useState(
    initialData?.impact_metrics?.m3_num || "",
  );
  const [metric3Label, setMetric3Label] = useState(
    initialData?.impact_metrics?.m3_label || "",
  );

  // Extra images (documentation JSONB array)
  const defaultDocs: KKNProkerDoc[] =
    typeof initialData?.documentation === "string"
      ? (JSON.parse(initialData.documentation) as KKNProkerDoc[])
      : (initialData?.documentation ?? []);
  const [extraImages, setExtraImages] = useState<KKNProkerDoc[]>(
    defaultDocs.length > 0
      ? defaultDocs
      : [
          { url: "", caption: "" },
          { url: "", caption: "" },
        ],
  );

  // Toast auto-hide
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Fetch villages dynamically
  useEffect(() => {
    const fetchVillages = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("villages")
        .select("id, name, slug")
        .order("name")
        .returns<KKNProkerVillage[]>();
      if (data) setVillages(data);
    };
    fetchVillages();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setShortDesc("");
    setContent("");
    setCoverUrl("");
    setVillage("");
    setMetric1Num("");
    setMetric1Label("");
    setMetric2Num("");
    setMetric2Label("");
    setMetric3Num("");
    setMetric3Label("");
    setExtraImages([
      { url: "", caption: "" },
      { url: "", caption: "" },
    ]);
    setFormKey((prev) => prev + 1);
  };

  // Handler untuk auto-generate slug saat judul berubah
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!initialData?.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  // Extra images handlers
  const addExtraImage = () =>
    setExtraImages([...extraImages, { url: "", caption: "" }]);
  const updateExtraImage = (
    i: number,
    field: "url" | "caption",
    val: string,
  ) => {
    const newImages = [...extraImages];
    newImages[i] = { ...newImages[i], [field]: val };
    setExtraImages(newImages);
  };
  const removeExtraImage = (i: number) =>
    setExtraImages(extraImages.filter((_, idx) => idx !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content)
      return setMessage({
        type: "error",
        text: "Judul dan detail proker wajib diisi.",
      });

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();

      // Get village_id
      let villageId = null;
      if (village) {
        const { data } = await supabase
          .from("villages")
          .select("id")
          .eq("slug", village)
          .single();
        villageId = data?.id || null;
      }

      // Filter extra images: hanya yang ada URL-nya
      const validExtraImages = extraImages.filter((img) => img.url);

      // Payload
      const payload = {
        title,
        slug,
        short_description: shortDesc,
        goals: content,
        impact_metrics: {
          m1_num: metric1Num,
          m1_label: metric1Label,
          m2_num: metric2Num,
          m2_label: metric2Label,
          m3_num: metric3Num,
          m3_label: metric3Label,
        },
        documentation: validExtraImages.length > 0 ? validExtraImages : null,
        image_url: coverUrl || null,
        village_id: villageId,
        published: true,
      };

      if (isNew) {
        const { error } = await supabase.from("kkn_prokers").insert(payload);
        if (error) throw error;
        resetForm();
      } else {
        const { error } = await supabase
          .from("kkn_prokers")
          .update(payload)
          .eq("id", initialData!.id);
        if (error) throw error;
      }

      setMessage({
        type: "success",
        text: `Proker berhasil ${isNew ? "dibuat" : "diperbarui"}!`,
      });
      setShowSuccess(true);

      // ✅ Tambahkan router.refresh() agar list otomatis update
      setTimeout(() => {
        router.refresh();
        if (!isNew) {
          router.push("/admin/kkn/proker");
        }
      }, 1500);
    } catch (err) {
      const errMessage = err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      console.error("Submit error:", err);
      setMessage({ type: "error", text: `Gagal: ${errMessage}` });
    } finally {
      setLoading(false);
    }
  };

  const selectedVillageName = villages.find((v) => v.slug === village)?.name || null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2"
      >
        {message && (
          <div
            role="alert"
            className={`flex items-center gap-2 p-3 rounded-lg border-2 text-sm font-bold ${message.type === "success" ? "bg-success/10 text-success border-success/30" : "bg-error-container text-error border-error/30"}`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />
            ) : (
              <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            )}
            {message.text}
          </div>
        )}

        {/* 1. Cover Utama */}
        <section>
          <h3 className="flex items-center gap-2 font-serif text-lg font-black text-on-surface mb-3">
            <ImageIcon className="size-5" aria-hidden="true" />
            Cover Utama Proker
          </h3>
          <ImageUploader
            key={`proker-cover-${formKey}`}
            value={coverUrl}
            onChange={setCoverUrl}
            label="Gambar Banner Utama"
          />
        </section>

        {/* 2. Metadata Dasar */}
        <section className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Judul Proker *
            </label>
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Digitalisasi Pemetaan Wilayah Desa"
              required
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
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="digitalisasi-pemetaan-wilayah-desa"
              required
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Lokasi Wilayah Desa
            </label>
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">Umum / Kedua Desa</option>
              {villages.map((v) => (
                <option key={v.id} value={v.slug}>
                  {v.name}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* 3. Ringkasan & Rich Text Konten */}
        <section className="space-y-4">
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Sub-judul / Deskripsi Pendek
            </label>
            <input
              type="text"
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="1 kalimat penjelas di bawah judul utama..."
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-2">
              <FileText className="size-4" aria-hidden="true" />
              Detail Narasi & Cerita Proker *
            </label>
            <RichTextEditor
              key={`proker-rte-${formKey}`}
              content={content}
              onChange={setContent}
            />
          </div>
        </section>

        {/* 4. 3 Kotak Metrik Dampak */}
        <section className="border-t-2 border-dashed border-outline-variant pt-6">
          <h3 className="flex items-center gap-2 font-serif text-lg font-black text-on-surface mb-3">
            <BarChart3 className="size-5" aria-hidden="true" />
            Dampak Program Kerja
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-xl border-2 border-on-surface hard-shadow-sm">
              <span className="text-xs font-bold text-primary block mb-2 uppercase tracking-wider">
                Kotak Kiri
              </span>
              <input
                type="text"
                value={metric1Num}
                onChange={(e) => setMetric1Num(e.target.value)}
                placeholder="Angka (e.g. 50+)"
                className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm font-bold mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <input
                type="text"
                value={metric1Label}
                onChange={(e) => setMetric1Label(e.target.value)}
                placeholder="Label (e.g. Warga Terlibat)"
                className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="p-4 bg-background rounded-xl border-2 border-on-surface hard-shadow-sm">
              <span className="text-xs font-bold text-on-tertiary block mb-2 uppercase tracking-wider">
                Kotak Tengah
              </span>
              <input
                type="text"
                value={metric2Num}
                onChange={(e) => setMetric2Num(e.target.value)}
                placeholder="Angka (e.g. 12)"
                className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm font-bold mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <input
                type="text"
                value={metric2Label}
                onChange={(e) => setMetric2Label(e.target.value)}
                placeholder="Label (e.g. Buku Didonasikan)"
                className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
            <div className="p-4 bg-background rounded-xl border-2 border-on-surface hard-shadow-sm">
              <span className="text-xs font-bold text-primary block mb-2 uppercase tracking-wider">
                Kotak Kanan
              </span>
              <input
                type="text"
                value={metric3Num}
                onChange={(e) => setMetric3Num(e.target.value)}
                placeholder="Angka (e.g. 100%)"
                className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface text-sm font-bold mb-2 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
              <input
                type="text"
                value={metric3Label}
                onChange={(e) => setMetric3Label(e.target.value)}
                placeholder="Label (e.g. Sampah Diambil)"
                className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface-variant text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>
        </section>

        {/* 5. Gambar Pendukung */}
        <section className="border-t-2 border-dashed border-outline-variant pt-6">
          <h3 className="flex items-center gap-2 font-serif text-lg font-black text-on-surface mb-2">
            <Images className="size-5" aria-hidden="true" />
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
                key={`proker-extra-0-${formKey}`}
                value={extraImages[0]?.url || ""}
                onChange={(url) => updateExtraImage(0, "url", url)}
                label="Upload Foto 1"
              />
              <input
                type="text"
                value={extraImages[0]?.caption || ""}
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
                key={`proker-extra-1-${formKey}`}
                value={extraImages[1]?.url || ""}
                onChange={(url) => updateExtraImage(1, "url", url)}
                label="Upload Foto 2"
              />
              <input
                type="text"
                value={extraImages[1]?.caption || ""}
                onChange={(e) => updateExtraImage(1, "caption", e.target.value)}
                placeholder="Caption Foto 2 (opsional)"
                className="w-full p-2.5 border-2 border-on-surface rounded-lg text-sm bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              />
            </div>
          </div>

          {extraImages.length > 2 && (
            <div className="mt-4 space-y-4">
              {extraImages.slice(2, 6).map((img, i) => {
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
            <Button type="button" variant="ghost" size="sm" onClick={addExtraImage}>
              <Plus className="size-3.5" aria-hidden="true" />
              Tambah Foto Tambahan
            </Button>
          </div>
        </section>

        {/* 6. Actions */}
        <div className="flex gap-4 pt-4 border-t-2 border-dashed border-outline-variant">
          <Button type="submit" variant="tertiary" loading={loading}>
            {!loading && <Save className="size-4" aria-hidden="true" />}
            {loading ? "Menyimpan..." : isNew ? "Publish Program Kerja" : "Simpan Perubahan"}
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
          className={`overflow-hidden rounded-2xl border-4 bg-background hard-shadow-md lg:sticky lg:top-6 ${KKN_ACCENT_BORDERS[0]}`}
        >
          <div className="flex items-center gap-2 border-b-2 border-on-surface bg-surface-container-low px-4 py-3">
            <Eye className="size-4 text-on-surface-variant" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Pratinjau Kartu
            </span>
          </div>

          <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={title || "Pratinjau cover proker"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <ImageIcon className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
            <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1.5">
              {getJournalVillageTags(selectedVillageName).map((tag) => (
                <Badge key={tag} variant="solid-outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1 p-4">
            <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
              {title || "Judul Program Kerja"}
            </h3>
            <p className="line-clamp-2 text-sm text-on-surface-variant">
              {shortDesc || "Belum ada deskripsi singkat."}
            </p>
          </div>
        </div>
      </div>

      <Toast show={showSuccess} message={`Program Kerja berhasil ${isNew ? "dibuat" : "diperbarui"}!`} />
    </div>
  );
}
