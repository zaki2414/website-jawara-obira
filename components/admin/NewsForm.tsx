// components/admin/NewsForm.tsx
"use client";
import { useState, useEffect } from "react";
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
  Newspaper,
} from "lucide-react";
import RichTextEditor from "./RichTextEditor";
import ImageUploader from "./ImageUploader";
import ExtraImageUploader from "./ExtraImageUploader";
import { BERITA_ACCENT_BORDERS } from "./berita/beritaCardStyles";

export type NewsExtraImage = {
  url: string;
  caption: string;
};

export type NewsRecord = {
  id: string;
  title: string;
  slug: string;
  village_slug?: string | null;
  villages?: { slug: string } | null;
  content: string;
  thumbnail_url?: string | null;
  author_name?: string | null;
  extra_images?: NewsExtraImage[] | string | null;
  published_at?: string | null;
};

type NewsFormProps = {
  initialData?: NewsRecord | null;
  isNew: boolean;
};

export default function NewsForm({ initialData, isNew }: NewsFormProps) {
  const router = useRouter();
  const defaultExtra: NewsExtraImage[] =
    typeof initialData?.extra_images === "string"
      ? (JSON.parse(initialData.extra_images) as NewsExtraImage[])
      : (initialData?.extra_images ?? []);

  const [title, setTitle] = useState(initialData?.title || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [village, setVillage] = useState(
    initialData?.village_slug || initialData?.villages?.slug || "kawasi",
  );
  const [content, setContent] = useState(initialData?.content || "");
  const [thumbnail, setThumbnail] = useState(initialData?.thumbnail_url || "");
  const [author, setAuthor] = useState(initialData?.author_name || "Admin");
  const [showSuccess, setShowSuccess] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [extraImages, setExtraImages] = useState<NewsExtraImage[]>([
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

  // ✅ FIX: Pindahkan auto-generate slug ke event handler untuk menghindari warning React
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
    setContent("");
    setThumbnail("");
    setAuthor("Admin");
    setVillage("kawasi");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content)
      return setMessage({
        type: "error",
        text: "Judul dan konten wajib diisi.",
      });
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

      const payload = {
        title,
        slug,
        content,
        thumbnail_url: thumbnail || null,
        author_name: author,
        village_id: villageId,
        extra_images: extraImages.filter((img) => img.url),
        published_at: initialData?.published_at || new Date().toISOString(),
      };

      // ✅ Lakukan mutasi langsung menggunakan browser client
      const { error } = isNew
        ? await supabase.from("news").insert(payload)
        : await supabase.from("news").update(payload).eq("id", initialData!.id);

      if (error) throw error;

      const successText = `Berita berhasil ${isNew ? "dibuat" : "diperbarui"}!`;
      setMessage({ type: "success", text: successText });
      setShowSuccess(true);

      if (isNew) {
        resetForm();
      } else {
        setTimeout(() => {
          router.refresh(); // ✅ Auto refresh list halaman admin
          router.push("/admin/berita");
        }, 1500);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      setMessage({ type: "error", text: `Gagal: ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  };

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
        <ImageUploader
          key={`news-thumb-${formKey}`}
          value={thumbnail}
          onChange={setThumbnail}
          label="Gambar Cover Berita"
        />
      </section>

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
            placeholder="Contoh: Festival Bahari Obi 2026"
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
            placeholder="festival-bahari-obi-2026"
            required
          />
        </div>
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
            Desa *
          </label>
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            required
          >
            <option value="kawasi">Kawasi</option>
            <option value="soligi">Soligi</option>
          </select>
        </div>
        <div>
          <label className="block text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-1.5">
            Penulis
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-3 border-2 border-on-surface rounded-lg bg-background text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            placeholder="Nama penulis"
          />
        </div>
      </section>

      <section>
        <label className="flex items-center gap-2 text-label-sm font-black uppercase tracking-wide text-on-surface-variant mb-2">
          <FileText className="size-4" aria-hidden="true" />
          Isi Berita *
        </label>
        <RichTextEditor
          key={`news-rte-${formKey}`}
          content={content}
          onChange={setContent}
        />
      </section>

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
            key={`news-extra-0-${formKey}`}
            slotNumber={1}
            value={extraImages[0].url}
            caption={extraImages[0].caption}
            onChange={(url, caption) => handleExtraImageChange(0, url, caption)}
          />
          <ExtraImageUploader
            key={`news-extra-1-${formKey}`}
            slotNumber={2}
            value={extraImages[1].url}
            caption={extraImages[1].caption}
            onChange={(url, caption) => handleExtraImageChange(1, url, caption)}
          />
        </div>
      </section>

      <div className="flex gap-4 pt-4 border-t-2 border-dashed border-outline-variant">
        <Button type="submit" variant="cream" loading={loading}>
          {!loading && <Save className="size-4" aria-hidden="true" />}
          {loading
            ? "Menyimpan..."
            : isNew
              ? "Publish Berita"
              : "Simpan Perubahan"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Batal
        </Button>
      </div>
      </form>

      {/* Pratinjau kartu — mencerminkan tampilan listing berita secara
          langsung sambil admin mengisi form, dibungkus sticky supaya tetap
          terlihat saat scroll (pola sama dengan FaunaForm/CultureForm/UMKMForm). */}
      <div className="lg:col-span-1">
        <div
          className={`overflow-hidden rounded-2xl border-4 bg-background hard-shadow-md lg:sticky lg:top-6 ${BERITA_ACCENT_BORDERS[0]}`}
        >
          <div className="flex items-center gap-2 border-b-2 border-on-surface bg-surface-container-low px-4 py-3">
            <Eye className="size-4 text-on-surface-variant" aria-hidden="true" />
            <span className="text-label-sm font-black uppercase tracking-wide text-on-surface-variant">
              Pratinjau Kartu
            </span>
          </div>

          <div className="relative h-48 border-b-2 border-on-surface bg-surface-container-high">
            {thumbnail ? (
              <Image src={thumbnail} alt={title || "Pratinjau berita"} fill className="object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-on-surface-variant/40">
                <Newspaper className="size-14 stroke-[1.25]" aria-hidden="true" />
              </div>
            )}
            <Badge variant="solid-outline" className="absolute right-2 top-2">
              {village === "soligi" ? "Soligi" : "Kawasi"}
            </Badge>
          </div>

          <div className="space-y-1 p-4">
            <h3 className="line-clamp-2 font-serif text-lg font-black leading-snug text-on-surface">
              {title || "Judul Berita"}
            </h3>
            <p className="text-sm font-bold uppercase tracking-wide text-on-cream">
              {author || "Admin"}
            </p>
          </div>
        </div>
      </div>

      <Toast show={showSuccess} message={`Berita berhasil ${isNew ? "dibuat" : "diperbarui"}!`} />
    </div>
  );
}
