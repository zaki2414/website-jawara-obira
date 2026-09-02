// components/admin/DeleteButton.tsx
"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

type DeleteableTable =
  | "news"
  | "culture_articles"
  | "galleries"
  | "kkn_documentations"
  | "kkn_members"
  | "kkn_journals"
  | "kkn_prokers"
  | "toga_plants"
  | "fauna_obi"
  | "umkm";

type DeleteButtonProps = {
  table: DeleteableTable;
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
    // Konfirmasi sudah ditangani oleh state `confirming` (langkah "Ya, Hapus" / "Batal"
    // di bawah) — jangan tambah confirm() browser lagi di sini, dobel konfirmasi.
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;

      if (redirectAfter) router.push(redirectAfter);
      else router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan tidak dikenal";
      alert(`Gagal menghapus: ${message}`);
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  if (confirming) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="hidden sm:inline text-label-sm text-on-surface-variant truncate max-w-40">
          Hapus &ldquo;{title}&rdquo;?
        </span>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          loading={loading}
        >
          {!loading && <Check className="size-3.5" aria-hidden="true" />}
          Ya, Hapus
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => setConfirming(false)}>
          <X className="size-3.5" aria-hidden="true" />
          Batal
        </Button>
      </span>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setConfirming(true)}
      className="text-error hover:text-error hover:bg-error-container/20"
    >
      <Trash2 className="size-3.5" aria-hidden="true" />
      Hapus
    </Button>
  );
}
