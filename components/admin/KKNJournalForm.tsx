// components/admin/KKNJournalForm.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client"; // ✅ Gunakan browser client untuk mutasi di form
import { generateSlug, formatDate } from "@/lib/utils";
import { Toast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ImageIcon,
  FileText,
  Images,
  Save,
  CheckCircle2,
  AlertCircle,
  Eye,
  NotebookPen,
} from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import ExtraImageUploader from "./ExtraImageUploader";
import { getJournalVillageTags, KKN_ACCENT_BORDERS } from "./kkn/kknCardStyles";

type KKNJournalImage = { image_url: string; caption: string | null };
type KKNJournalVillage = { id: string; name: string; slug: string };

export interface KKNJournalData {
  id: string;
  title: string;
  slug: string;
  village_slug?: string | null;
  villages?: { slug: string; name?: string } | null;
  activity_date: string;
  content: string;
  cover_image?: string | null;
  images?: KKNJournalImage[] | string | null;
}

type KKNJournalFormProps = {
  initialData?: KKNJournalData | null;
  isNew: boolean;
  // Prefill tanggal saat "Tambah Jurnal" dipicu dari klik tanggal tertentu
  // di kalender (app/admin/kkn/jurnal -> KKNJournalCalendar.tsx).
  defaultDate?: string;
};

export default function KKNJournalForm({
  initialData,
  isNew,
  defaultDate,
}: KKNJournalFormProps) {
  const router = useRouter();

  const defaultExtra: { url: string; caption: string }[] =
    typeof initialData?.images === "string"
      ? JSON.parse(initialData.images)
      : initialData?.images?.map((img) => ({
          url: img.image_url,
          caption: img.caption ?? "",
        })) || [];

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [village, setVillage] = useState(
    initialData?.village_slug || initialData?.villages?.slug || "",
  );
  const [activityDate, setActivityDate] = useState(
    initialData?.activity_date ? initialData.activity_date.split("T")[0] : defaultDate || "",
  );
  const [content, setContent] = useState(initialData?.content || "");
  const [coverImage, setCoverImage] = useState(initialData?.cover_image || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [villages, setVillages] = useState<KKNJournalVillage[]>([]);
  const [extraImages, setExtraImages] = useState([
    {
      url: defaultExtra[0]?.url || "",
      caption: defaultExtra[0]?.caption || "",
    },
    {
      url: defaultExtra[1]?.url || "",
      caption: defaultExtra[1]?.caption || "",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Fetch villages menggunakan browser client
  useEffect(() => {
    const fetchVillages = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("villages")
        .select("id, name, slug")
        .order("name")
        .returns<KKNJournalVillage[]>();
      if (data) setVillages(data);
    };
    fetchVillages();
  }, []);

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setContent("");
    setCoverImage("");
    setActivityDate("");
    setVillage("");
    setExtraImages([
      { url: "", caption: "" },
      { url: "", caption: "" },
    ]);
    setFormKey((prev) => prev + 1);
  };

  const handleExtraImageChange = (
    index: number,
    url: string,
    caption: string,
  ) => {
    const newExtra = [...extraImages];
    newExtra[index] = { url, caption };
    setExtraImages(newExtra);
  };

  // ✅ FIX: Pindahkan logika auto-generate slug ke event handler onChange
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Hanya auto-generate jika ini form baru (tidak ada initial slug)
    if (!initialData?.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !activityDate) {
      return setMessage({
        type: "error",
        text: "Judul, tanggal kegiatan, dan isi jurnal wajib diisi.",
      });
    }
    if (!slug) return setMessage({ type: "error", text: "Slug wajib diisi." });

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient(); // ✅ Browser client
      let villageId = null;

      if (village) {
        const { data: villageData } = await supabase
          .from("villages")
          .select("id")
          .eq("slug", village)
          .single();
        villageId = villageData?.id || null;
      }

      const journalPayload = {
        title,
        slug,
        content,
        cover_image: coverImage || null,
        activity_date: activityDate,
        village_id: villageId,
        published: true,
      };

      let journalId = initialData?.id;

      // ✅ Lakukan mutasi langsung menggunakan browser client
      if (isNew) {
        const { data, error } = await supabase
          .from("kkn_journals")
          .insert(journalPayload)
          .select()
          .single();
        if (error) throw error;
        journalId = data.id;
      } else {
        const { error } = await supabase
          .from("kkn_journals")
          .update(journalPayload)
          .eq("id", initialData!.id);
        if (error) throw error;
      }

      // Handle extra images di tabel terpisah: kkn_journal_images
      const validExtraImages = extraImages.filter((img) => img.url);

      if (validExtraImages.length > 0) {
        if (!isNew) {
          await supabase
            .from("kkn_journal_images")
            .delete()
            .eq("journal_id", journalId);
        }

        const imagesPayload = validExtraImages.map((img) => ({
          journal_id: journalId,
          image_url: img.url,
          caption: img.caption || null,
        }));

        const { error: imgError } = await supabase
          .from("kkn_journal_images")
          .insert(imagesPayload);

        if (imgError) console.warn("⚠️ Extra images insert warning:", imgError);
      }

      const successText = `Jurnal KKN berhasil ${isNew ? "dibuat" : "diperbarui"}!`;
      setMessage({ type: "success", text: successText });
      setShowSuccess(true);

      if (isNew) {
        resetForm();
      } else {
        setTimeout(() => router.push("/admin/kkn/jurnal"), 1500);
      }
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
            Cover Utama Jurnal
          </h3>
          <ImageUploader
            key={`journal-cover-${formKey}`}
            value={coverImage}
            onChange={setCoverImage}
            label="Gambar Cover Jurnal"
          />
        </section>

        {/* 2. Metadata Dasar */}
        <section className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Judul *
            </label>
            {/* ✅ Gunakan handleTitleChange di sini */}
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="Contoh: Log Harian Hari Ke-14 Pengajaran"
              required
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Slug *
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(generateSlug(e.target.value))}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="log-harian-hari-ke-14"
              required
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Tanggal Kegiatan *
            </label>
            <input
              type="date"
              value={activityDate}
              onChange={(e) => setActivityDate(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
              Lokasi Desa *
            </label>
            <select
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              <option value="">Umum / Kedua Desa</option>
              {villages.map((v) => (
                <option key={v.id} value={v.slug}>
                  {v.name}
                </option>
              ))}
            </select>
            {villages.length === 0 && (
              <p className="text-xs text-on-surface-variant/60 mt-1">Memuat data desa...</p>
            )}
          </div>
        </section>

        {/* 3. Konten Teks */}
        <section>
          <label className="flex items-center gap-2 text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-2">
            <FileText className="size-4" aria-hidden="true" />
            Isi Cerita Jurnal *
          </label>
          <RichTextEditor
            key={`journal-rte-${formKey}`}
            content={content}
            onChange={setContent}
          />
        </section>

        {/* 4. Gambar Pendukung */}
        <section className="border-t-2 border-dashed border-outline-variant pt-6">
          <h3 className="flex items-center gap-2 font-serif text-lg font-black text-on-surface mb-2">
            <Images className="size-5" aria-hidden="true" />
            Gambar Pendukung (Opsional)
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Maks 2 gambar. Posisi & rotasi otomatis: Kiri (-3°) & Kanan (+3°).
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <ExtraImageUploader
              key={`journal-extra-0-${formKey}`}
              slotNumber={1}
              value={extraImages[0].url}
              caption={extraImages[0].caption}
              onChange={(url, caption) => handleExtraImageChange(0, url, caption)}
            />
            <ExtraImageUploader
              key={`journal-extra-1-${formKey}`}
              slotNumber={2}
              value={extraImages[1].url}
              caption={extraImages[1].caption}
              onChange={(url, caption) => handleExtraImageChange(1, url, caption)}
            />
          </div>
        </section>

        {/* 5. Aksi */}
        <div className="flex gap-4 pt-4 border-t-2 border-dashed border-outline-variant">
          <Button type="submit" variant="tertiary" loading={loading}>
            {!loading && <Save className="size-4" aria-hidden="true" />}
            {loading ? "Menyimpan..." : isNew ? "Publish Jurnal" : "Simpan Perubahan"}
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
            {coverImage ? (
              <Image
                src={coverImage}
                alt={title || "Pratinjau cover jurnal"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <NotebookPen className="size-14 stroke-[1.25]" aria-hidden="true" />
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
              {title || "Judul Jurnal"}
            </h3>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              {activityDate ? formatDate(activityDate, { month: "short" }) : "Tanggal Kegiatan"}
            </p>
          </div>
        </div>
      </div>

      <Toast show={showSuccess} message={`Jurnal berhasil ${isNew ? "dibuat" : "diperbarui"}!`} />
    </div>
  );
}
