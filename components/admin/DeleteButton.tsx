// components/admin/DeleteButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  table: "news" | "culture_articles" | "galleries" | "kkn_documentations";
  id: string;
  title: string;
  redirectAfter?: string;
};

export default function DeleteButton({
  table,
  id,
  title,
  redirectAfter,
}: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    if (
      !confirm(
        `Yakin ingin menghapus "${title}"? Tindakan ini tidak dapat dibatalkan.`,
      )
    )
      return;

    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      if (redirectAfter) router.push(redirectAfter);
      else router.refresh();
    } catch (err: any) {
      alert(`Gagal menghapus: ${err.message}`);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2 text-red-600 text-sm">
        <button
          onClick={handleDelete}
          disabled={loading}
          className="font-medium hover:underline disabled:opacity-50"
        >
          {loading ? "Menghapus..." : "Ya, Hapus"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          Batal
        </button>
      </span>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-red-600 hover:text-red-700 text-sm font-medium"
    >
      Hapus
    </button>
  );
}
