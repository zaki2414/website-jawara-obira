// app/admin/layout.tsx
import { getAdminUser } from "@/lib/auth";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

// Chrome persisten untuk seluruh /admin/** — navigasi & branding sudah dipegang
// oleh Navbar global (components/layout/Navbar.tsx, termasuk pin "Admin"), jadi
// di sini cukup satu tombol keluar; tidak perlu logo/breadcrumb/header kedua.
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAdminUser();

  return (
    <div className="min-h-screen bg-surface-container-low">
      {user && (
        <div className="mx-auto flex max-w-7xl justify-end px-4 pt-4 sm:px-6 lg:px-8">
          <form action="/api/auth/logout" method="POST">
          </form>
        </div>
      )}

      {children}
    </div>
  );
}
