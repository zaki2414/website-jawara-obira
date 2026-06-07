import { getAdminUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import UploadForm from "@/components/admin/UploadForm";

export default async function AdminGallery() {
  const user = await getAdminUser();
  if (!user) redirect("/login");

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="font-serif text-2xl font-bold text-ocean-800 mb-6">
        📸 Upload Galeri
      </h1>
      <UploadForm userType="gallery" />
    </div>
  );
}
