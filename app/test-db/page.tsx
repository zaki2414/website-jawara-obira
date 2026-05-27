// app/test-db/page.tsx
import { createClient } from "@/lib/supabase/server";

export default async function TestDB() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("villages").select("id");

  if (error) {
    return (
      <main className="p-10 font-mono bg-red-50 text-red-700">
        ❌ Gagal Koneksi: {error.message}
      </main>
    );
  }

  return (
    <main className="p-10 font-mono bg-green-50 text-green-700">
      ✅ Koneksi Backend Berhasil!
      <br />
      Jumlah data di tabel 'villages': {data.length}
    </main>
  );
}
