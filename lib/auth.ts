// lib/auth.ts
import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

// Bypass lokal saat rate-limit Supabase Auth bikin /admin tidak bisa diakses
// untuk sekadar edit UI. Dobel-gate (dev + flag eksplisit) supaya mustahil
// ke-bawa ke production tanpa sengaja. Hapus DISABLE_ADMIN_AUTH dari
// .env.local begitu selesai edit.
const AUTH_BYPASSED =
  process.env.NODE_ENV === "development" &&
  process.env.DISABLE_ADMIN_AUTH === "true";

// cache() dedupe: layout.tsx DAN page.tsx tiap route /admin/** sama-sama
// panggil getAdminUser() untuk guard sendiri-sendiri; tanpa ini itu jadi 2
// request auth Supabase per navigasi (ikut andil ke rate-limit 429 saat
// banyak halaman admin dibuka berturut-turut).
export const getAdminUser = cache(async () => {
  if (AUTH_BYPASSED) {
    return {
      id: "dev-bypass",
      email: "dev@localhost",
      user_metadata: { full_name: "Dev (auth bypass)" },
    } as unknown as User;
  }

  const supabase = await createClient();

  // 1. Cek apakah ada user yang login
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // 2. Cek role di tabel admin_users
  const { data, error } = await supabase
    .from("admin_users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || data?.role !== "admin") return null;

  return user;
});
