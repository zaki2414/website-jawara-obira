// lib/auth.ts
import { createClient } from "@/lib/supabase/server";

export async function getAdminUser() {
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
}
