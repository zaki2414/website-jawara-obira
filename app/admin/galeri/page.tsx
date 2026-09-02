import { getAdminUser } from "@/lib/auth";
import { getAllGalleries } from "@/lib/supabase/queries";
import { redirect } from "next/navigation";
import { AlertTriangle, Images } from "lucide-react";
import { FotoSectionBanner } from "@/components/admin/foto/FotoSectionBanner";
import { AdminFotoCard } from "@/components/admin/foto/AdminFotoCard";
import UploadForm from "@/components/admin/UploadForm";
import type { GalleryItem } from "@/constants/galeri";

export const dynamic = "force-dynamic";

export default async function AdminGallery() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  const { data, error } = await getAllGalleries();
  const photos = (data ?? []) as GalleryItem[];

  return (
    <main className="pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <FotoSectionBanner
          crumbs={[{ label: "Dashboard", href: "/admin" }, { label: "Galeri" }]}
          title="Manajemen Galeri Foto"
          subtitle="Unggah dan kelola dokumentasi foto alam, budaya, dan kegiatan Pulau Obi."
          badgeLabel="Galeri"
          badgeIcon={Images}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <UploadForm userType="gallery" />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-4 sm:px-6 lg:px-8">
        <h2 className="font-serif text-headline-md font-black text-on-surface">
          Foto Terunggah
        </h2>
        <p className="mt-1 text-body-md text-on-surface-variant">
          {photos.length > 0
            ? `${photos.length} foto tersimpan di galeri.`
            : "Belum ada foto yang diunggah."}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8">
        {error ? (
          <div className="flex items-center gap-3 rounded-xl border-2 border-error bg-error/10 p-4 font-bold text-error">
            <AlertTriangle className="size-5 shrink-0" aria-hidden="true" />
            Gagal memuat data galeri. Muat ulang halaman untuk mencoba lagi.
          </div>
        ) : photos.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-on-surface bg-background p-12 text-center hard-shadow-sm">
            <span className="inline-flex rounded-xl border-2 border-on-surface bg-tertiary-container text-on-tertiary p-3">
              <Images className="size-6" aria-hidden="true" />
            </span>
            <p className="font-serif text-lg font-black text-on-surface">Belum Ada Foto</p>
            <p className="max-w-sm text-sm text-on-surface-variant">
              Unggah foto lewat formulir di atas untuk mulai mengisi galeri dan menampilkannya di
              halaman publik.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((photo, index) => (
              <AdminFotoCard key={photo.id} photo={photo} index={index} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
