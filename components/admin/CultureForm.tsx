// components/admin/CultureForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client"; // ✅ Gunakan browser client
import { generateSlug } from "@/lib/utils";
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
  Landmark,
} from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import ExtraImageUploader from "./ExtraImageUploader";
import { BUDAYA_ACCENT_BORDERS, getCultureVillageTags } from "./budaya/budayaCardStyles";

export type CultureExtraImage = {
  url: string;
  caption: string;
};

export type CultureRecord = {
  id: string;
  title: string;
  slug: string;
  category: string;
  village_slug?: string | null;
  villages?: { slug: string } | null;
  content: string;
  thumbnail_url?: string | null;
  extra_images?: CultureExtraImage[] | string | null;
  published_at?: string | null;
};

type CultureFormProps = {
  initialData?: CultureRecord | null;
  isNew: boolean;
};

const VILLAGE_SLUG_LABEL: Record<string, string> = {
  kawasi: "Kawasi",
  soligi: "Soligi",
};

export default function CultureForm({ initialData, isNew }: CultureFormProps) {
  const router = useRouter();
  const defaultExtra: CultureExtraImage[] =
    typeof initialData?.extra_images === "string"
      ? (JSON.parse(initialData.extra_images) as CultureExtraImage[])
      : (initialData?.extra_images ?? []);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [category, setCategory] = useState(initialData?.category || "");
  const [village, setVillage] = useState(initialData?.village_slug || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail_url || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [extraImages, setExtraImages] = useState<CultureExtraImage[]>([
    { url: defaultExtra[0]?.url || "", caption: defaultExtra[0]?.caption || "" },
    { url: defaultExtra[1]?.url || "", caption: defaultExtra[1]?.caption || "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // ✅ FIX: Pindahkan auto-generate slug ke event handler
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (isNew && !initialData?.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setCategory("");
    setVillage("");
    setContent("");
    setThumbnail("");
    setExtraImages([{ url: "", caption: "" }, { url: "", caption: "" }]);
    setFormKey((prev) => prev + 1);
  };

  const handleExtraImageChange = (index: number, url: string, caption: string) => {
    const newExtra = [...extraImages];
    newExtra[index] = { url, caption };
    setExtraImages(newExtra);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content || !category) return setMessage({ type: "error", text: "Judul, Kategori, dan Konten wajib diisi." });
    if (!slug) return setMessage({ type: "error", text: "Slug wajib diisi." });

    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient(); // ✅ Browser client
      let villageId = null;
      if (village) {
        const { data: villageData } = await supabase.from("villages").select("id").eq("slug", village).single();
        villageId = villageData?.id || null;
      }

      const payload = {
        title,
        slug,
        category,
        content,
        thumbnail_url: thumbnail || null,
        village_id: villageId,
        extra_images: extraImages.filter((img) => img.url),
        published_at: initialData?.published_at || new Date().toISOString(),
      };

      // ✅ Lakukan mutasi langsung menggunakan browser client
      const { error } = isNew
        ? await supabase.from("culture_articles").insert(payload)
        : await supabase.from("culture_articles").update(payload).eq("id", initialData!.id);

      if (error) throw error;

      setShowSuccess(true);
      setMessage({ type: "success", text: `Artikel budaya ${isNew ? "dibuat" : "diperbarui"}!` });

      resetForm();

      setTimeout(() => {
        router.refresh(); // ✅ Auto refresh list halaman admin
        if (!isNew) {
          router.push("/admin/budaya");
        }
      }, 1500);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setMessage({ type: "error", text: `Gagal: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

  const villageLabel = VILLAGE_SLUG_LABEL[village] ?? null;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border-2 border-on-surface bg-background p-6 hard-shadow-md lg:col-span-2"
      >
        {message && (
          <div
            role="status"
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

        <section>
          <h3 className="flex items-center gap-2 font-serif text-lg font-black text-on-surface mb-3">
            <ImageIcon className="size-5" aria-hidden="true" />
            Thumbnail Utama
          </h3>
          <ImageUploader key={`thumb-${formKey}`} value={thumbnail} onChange={setThumbnail} label="Gambar Cover Budaya" />
        </section>

        <section className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">Judul *</label>
            {/* ✅ Gunakan handleTitleChange di sini */}
            <input type="text" value={title} onChange={handleTitleChange} className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="Contoh: Tari Cakalele Obi" required />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">Slug *</label>
            <input type="text" value={slug} onChange={(e) => setSlug(generateSlug(e.target.value))} className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" placeholder="tari-cakalele-obi" required />
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">Kategori *</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary" required>
              <option value="">Pilih kategori</option>
              <option value="Tradisi">Tradisi & Adat</option>
              <option value="Kuliner">Kuliner Khas</option>
              <option value="Bahari">Kearifan Bahari</option>
              <option value="Kerajinan">Kerajinan Tangan</option>
              <option value="Cerita Rakyat">Cerita Rakyat</option>
              <option value="Seni">Seni & Musik</option>
            </select>
          </div>
          <div>
            <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">Asal Desa (Opsional)</label>
            <select value={village} onChange={(e) => setVillage(e.target.value)} className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary">
              <option value="">Umum / Seluruh Pulau Obi</option>
              <option value="kawasi">Desa Kawasi</option>
              <option value="soligi">Desa Soligi</option>
            </select>
          </div>
        </section>

        <section>
          <label className="flex items-center gap-2 text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-2">
            <FileText className="size-4" aria-hidden="true" />
            Isi Artikel *
          </label>
          <RichTextEditor key={`rte-${formKey}`} content={content} onChange={setContent} placeholder="Tulis detail sejarah, makna, atau deskripsi budaya..." />
        </section>

        <section className="border-t-2 border-dashed border-outline-variant pt-6">
          <h3 className="flex items-center gap-2 font-serif text-lg font-black text-on-surface mb-2">
            <Images className="size-5" aria-hidden="true" />
            Gambar Pendukung (Opsional)
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">Maks 2 gambar. Posisi & rotasi otomatis: Kiri (-3°) & Kanan (+3°).</p>
          <div className="grid md:grid-cols-2 gap-6">
            <ExtraImageUploader key={`extra-0-${formKey}`} slotNumber={1} value={extraImages[0].url} caption={extraImages[0].caption} onChange={(url, caption) => handleExtraImageChange(0, url, caption)} />
            <ExtraImageUploader key={`extra-1-${formKey}`} slotNumber={2} value={extraImages[1].url} caption={extraImages[1].caption} onChange={(url, caption) => handleExtraImageChange(1, url, caption)} />
          </div>
        </section>

        <div className="flex gap-4 pt-4 border-t-2 border-dashed border-outline-variant">
          <Button type="submit" variant="primary" loading={loading}>
            {!loading && <Save className="size-4" aria-hidden="true" />}
            {loading ? "Menyimpan..." : isNew ? "Publish Budaya" : "Simpan Perubahan"}
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
          className={`overflow-hidden rounded-2xl border-4 bg-background hard-shadow-md lg:sticky lg:top-6 ${BUDAYA_ACCENT_BORDERS[0]}`}
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
                alt={title || "Pratinjau thumbnail budaya"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <Landmark className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
            <div className="absolute right-2 top-2 flex flex-wrap justify-end gap-1.5">
              {getCultureVillageTags(villageLabel).map((tag) => (
                <Badge key={tag} variant="solid-outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-1 p-4">
            <h3 className="font-serif text-lg font-black leading-snug text-on-surface">
              {title || "Judul Artikel"}
            </h3>
            <p className="text-sm font-bold uppercase tracking-wide text-primary">
              {category || "Kategori"}
            </p>
          </div>
        </div>
      </div>

      <Toast show={showSuccess} message={`Artikel berhasil ${isNew ? "dibuat" : "diperbarui"}!`} />
    </div>
  );
}
