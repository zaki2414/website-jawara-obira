// app/admin/layout.tsx

// Chrome persisten untuk seluruh /admin/** — navigasi & branding sudah dipegang
// oleh Navbar global (components/layout/Navbar.tsx, termasuk pin "Admin"), jadi
// di sini cukup bidang latarnya saja; tidak perlu logo/breadcrumb/header kedua.
//
// Latar sengaja surface-container-low, satu tingkat lebih redup dari kertas
// `background` yang dipakai panel & kartu di atasnya. Itu yang membuat panel
// admin terbaca sebagai lembar yang DILETAKKAN di atas meja, bukan menyatu
// dengan halamannya — lapisan netral kedua yang memang diminta untuk
// permukaan kerja.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-surface-container-low">{children}</div>;
}
