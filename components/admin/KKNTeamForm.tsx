// components/admin/KKNTeamForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import ImageUploader from "./ImageUploader";

export default function KKNTeamForm({
  initialData,
  isNew,
}: {
  initialData?: any;
  isNew: boolean;
}) {
  const router = useRouter();
  const [photoUrl, setPhotoUrl] = useState(initialData?.photo_url || "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{
    t: "success" | "error";
    txt: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const fd = new FormData(e.currentTarget);

    const payload = {
      name: String(fd.get("name")),
      cluster: String(fd.get("cluster")),
      study_program: String(fd.get("study_program")),
      village_placement: String(fd.get("village_placement")),
      photo_url: photoUrl || null,
    };

    try {
      const supabase = createClient();

      if (isNew) {
        const { error } = await supabase.from("kkn_members").insert(payload);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("kkn_members")
          .update(payload)
          .eq("id", initialData.id);
        if (error) throw error;
      }

      setMsg({ t: "success", txt: "✅ Tersimpan!" });

      setTimeout(() => {
        router.refresh();
        router.push("/admin/kkn/tim");
      }, 1000);
    } catch (err: any) {
      console.error("Error saving member:", err);
      setMsg({ t: "error", txt: `❌ Gagal: ${err.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 bg-white p-6 rounded-xl border border-sand-200 shadow-sm"
    >
      {msg && (
        <div
          className={`p-3 rounded-lg text-sm ${msg.t === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {msg.txt}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nama Lengkap *
          </label>
          <input
            name="name"
            defaultValue={initialData?.name}
            required
            placeholder="Nama Lengkap"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Klaster *
          </label>
          <input
            name="cluster"
            defaultValue={initialData?.cluster}
            required
            placeholder="Contoh: Saintek, Agro"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Program Studi *
          </label>
          <input
            name="study_program"
            defaultValue={initialData?.study_program}
            required
            placeholder="Contoh: Teknologi Informasi"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Penempatan Desa *
          </label>
          <select
            name="village_placement"
            defaultValue={initialData?.village_placement || "kawasi"}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-500"
          >
            <option value="kawasi">Kawasi</option>
            <option value="soligi">Soligi</option>
            <option value="both">Keduanya</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Foto Profil
        </label>
        <ImageUploader
          value={photoUrl}
          onChange={setPhotoUrl}
          label="Upload Foto"
        />
      </div>

      <div className="flex gap-4 pt-4 border-t border-sand-200">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-ocean-600 text-white font-semibold rounded-lg hover:bg-ocean-700 transition disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : isNew ? "Simpan Anggota" : "Update Data"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
