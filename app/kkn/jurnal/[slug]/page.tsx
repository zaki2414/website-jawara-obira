// app/kkn/jurnal/[slug]/page.tsx
import { getKKNJournalBySlug } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default async function KKNJournalDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: journal, error } = await getKKNJournalBySlug(slug);

  if (error || !journal) {
    return notFound();
  }

  return (
    <article className="max-w-4xl mx-auto p-4">
      <Link
        href="/kkn/jurnal"
        className="text-sm text-ocean-600 hover:underline mb-4 inline-block"
      >
        ← Kembali ke Kalender
      </Link>

      <h1 className="text-2xl font-bold mb-2">{journal.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        📅 {journal.activity_date} • 📍 {journal.villages?.name || "Umum"}
      </p>

      {/* Cover Image */}
      {journal.cover_image && (
        <div className="relative w-full h-64 md:h-96 mb-6 bg-gray-200 rounded-lg overflow-hidden">
          <Image
            src={journal.cover_image}
            alt={journal.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content */}
      <div
        className="prose prose-sm max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: journal.content }}
      />

      {/* Gallery (extra images) */}
      {journal.images && journal.images.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">Dokumentasi</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {journal.images.map(
              (
                img: { image_url: string; caption: string | null },
                i: number,
              ) => (
                <div
                  key={i}
                  className="relative h-32 bg-gray-200 rounded overflow-hidden"
                >
                  <Image
                    src={img.image_url}
                    alt={img.caption || "Dokumentasi KKN"}
                    fill
                    className="object-cover"
                  />
                  {img.caption && (
                    <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate">
                      {img.caption}
                    </p>
                  )}
                </div>
              ),
            )}
          </div>
        </div>
      )}
    </article>
  );
}
