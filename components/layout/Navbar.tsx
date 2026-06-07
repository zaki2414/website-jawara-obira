"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/profil", label: "Profil" },
  { href: "/berita", label: "Berita" },
  { href: "/budaya", label: "Budaya" },
  { href: "/galeri", label: "Galeri" },
  { href: "/umkm", label: "UMKM" },
  { href: "/fauna-obi", label: "Fauna Obi" },
  { href: "/toga", label: "Toga" },
  { href: "/kkn", label: "Tim Kami" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const supabase = createBrowserClient();

    async function checkAdmin() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          setCheckingAdmin(false);
          return;
        }

        const { data, error } = await supabase
          .from("admin_users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!error && data?.role === "admin") setIsAdmin(true);
      } catch (err) {
        // ignore and treat as non-admin
      } finally {
        setCheckingAdmin(false);
      }
    }

    checkAdmin();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-sand-200 shadow-sm">
      <nav className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🌴</span>
            <span className="font-serif text-xl font-bold text-ocean-700">
              Jawara Obira
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-ocean-50 text-ocean-700"
                      : "text-gray-600 hover:text-ocean-600 hover:bg-sand-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className="ml-2 px-4 py-2 bg-ocean-600 text-ocean-700 text-sm font-semibold rounded-lg hover:bg-ocean-700 transition"
              >
                Admin
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded-lg hover:bg-sand-100"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <div className="md:hidden py-3 border-t border-sand-200 space-y-1">
            {navLinks.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 rounded-lg font-medium ${isActive ? "bg-ocean-50 text-ocean-700" : "text-gray-700 hover:bg-sand-100"}`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            {isAdmin && (
              <Link
                href="/admin"
                className="block mx-4 mt-2 px-4 py-3 bg-ocean-600 text-white text-center rounded-lg font-semibold hover:bg-ocean-700"
                onClick={() => setOpen(false)}
              >
                Admin
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
