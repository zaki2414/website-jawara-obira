// app/api/toga/plants/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("toga_plants")
      .select("*")
      .order("name_id", { ascending: true });

    if (error) throw error;

    return NextResponse.json(data || []);
  } catch (error: unknown) {
    // Pesan error Postgres TIDAK dikembalikan ke client — isinya bisa
    // membocorkan nama tabel/kolom dan detail internal lain. Detailnya cukup
    // masuk log server; pemanggil hanya perlu tahu permintaannya gagal.
    console.error("[api/toga/plants]", error);
    return NextResponse.json(
      { error: "Gagal memuat data tanaman obat." },
      { status: 500 },
    );
  }
}
