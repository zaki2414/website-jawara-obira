export type NavLink = {
  href: string;
  label: string;
};

// Satu sumber kebenaran untuk link navigasi utama — dipakai Navbar (desktop + mobile).
export const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/budaya", label: "Budaya" },
  { href: "/galeri", label: "Galeri" },
  { href: "/umkm", label: "UMKM" },
  { href: "/fauna-obi", label: "Fauna Obi" },
  { href: "/toga", label: "Toga" },
  { href: "/kkn", label: "Tim Kami" },
];

// Daftar link kurasi untuk Footer — label sengaja lebih deskriptif daripada
// NAV_LINKS. Dipisah dari NAV_LINKS secara sengaja, tapi hidup di satu file
// yang sama supaya tidak ada lagi array link yang di-hardcode ulang di dalam
// komponen.
export const FOOTER_LINKS: NavLink[] = [
  { href: "/budaya", label: "Dokumentasi Budaya Obi" },
  { href: "/galeri", label: "Galeri Foto Ekspedisi" },
  { href: "/kkn", label: "Log Personel KKN UGM" },
];
