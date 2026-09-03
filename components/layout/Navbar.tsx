"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { createClient as createBrowserClient } from "@/lib/supabase/client";
import { Menu, X, ShieldAlert } from "lucide-react";
import { NAV_LINKS } from "@/constants/nav";

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
          data: { session },
        } = await supabase.auth.getSession();
        if (!session?.user) {
          setCheckingAdmin(false);
          return;
        }

        const { data, error } = await supabase
          .from("admin_users")
          .select("role")
          .eq("id", session.user.id)
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
    <header className="sticky top-0 z-50 bg-background border-b-4 border-on-surface">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* BRAND LOGO BRUTALIST */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="p-2 bg-primary border-2 border-on-surface rounded-xl text-background hard-shadow-sm group-hover:-translate-x-px group-hover:-translate-y-px group-hover:hard-shadow-md transition-all duration-150">
              <Image
                src="/Logo Obi.svg"
                alt="Logo Jawara Obira"
                width={20}
                height={20}
                className="w-6 h-6"
              />
            </div>
            <span className="font-serif text-2xl font-black text-on-surface tracking-tight">
              Jawara Obira
            </span>
          </Link>

          {/* DESKTOP NAVIGATION LINKS */}
          <div className="hidden md:flex items-center gap-1.5">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 text-xs font-black uppercase tracking-wider transition-all duration-150 border-2 ${
                    isActive
                      ? "bg-surface-container border-on-surface text-on-surface rounded-xl"
                      : "border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-xl"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {/* ADMIN PANEL ACTION PIN */}
            {isAdmin && (
              <Link
                href="/admin"
                className="ml-2 px-3.5 py-2 bg-error text-on-error text-xs font-black uppercase tracking-wider rounded-xl border-2 border-on-surface hard-shadow-sm hover:-translate-x-px hover:-translate-y-px hover:hard-shadow-md active:translate-x-0 active:translate-y-0 transition-all duration-150 flex items-center gap-1.5"
              >
                <ShieldAlert className="w-4 h-4" /> Admin
              </Link>
            )}
          </div>

          {/* MOBILE TOGGLE TRIGGER BUTTON */}
          <button
            className="md:hidden p-2.5 bg-background border-2 border-on-surface rounded-xl hard-shadow-sm active:translate-y-0.5 transition-all text-on-surface"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
          </button>
        </div>

        {/* MOBILE NAVIGATION DROPDOWN OVERLAY */}
        {open && (
          <div className="md:hidden py-4 border-t-2 border-dashed border-outline-variant space-y-1.5 bg-background mb-2">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href || pathname?.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`block px-4 py-3 text-sm font-black uppercase tracking-wider border-2 mx-1 transition-all ${
                    isActive 
                      ? "bg-surface-container border-on-surface text-on-surface rounded-xl" 
                      : "border-transparent text-on-surface-variant hover:bg-surface-container-low rounded-xl"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            
            {isAdmin && (
              <Link
                href="/admin"
                className="block mx-2 mt-4 px-4 py-3.5 bg-error text-on-error text-center font-black uppercase tracking-widest text-xs rounded-xl border-2 border-on-surface hard-shadow-sm"
                onClick={() => setOpen(false)}
              >
                Masuk Panel Admin
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}