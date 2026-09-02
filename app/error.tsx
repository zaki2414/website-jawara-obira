"use client"; // Error boundary WAJIB Client Component

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

// Root error boundary — belum ada satupun error.tsx di app/ sebelum ini
// (CLAUDE.md §1.2), jadi ini juga jadi fallback generik untuk SEMUA segmen
// yang tidak punya error.tsx sendiri. unstable_retry (bukan reset) dipakai
// sesuai rekomendasi node_modules/next/dist/docs/.../error.md: re-fetch +
// re-render segmen yang gagal, bukan cuma clear error state.
export default function GlobalErrorBoundary({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-aged-paper px-4 py-12">
      <div className="w-full max-w-sm space-y-5 rounded-2xl border-4 border-on-surface bg-background p-6 text-center hard-shadow-lg md:p-8">
        <div className="mx-auto inline-flex rounded-2xl border-4 border-on-surface bg-error-container p-4 text-error hard-shadow-sm">
          <AlertTriangle className="size-8" aria-hidden="true" />
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-2xl font-black tracking-tight text-on-surface md:text-3xl">
            Terjadi Kesalahan
          </h1>
          <p className="text-sm font-medium leading-relaxed text-on-surface-variant">
            Halaman ini gagal dimuat. Coba lagi, atau kembali ke beranda kalau masalahnya terus
            terjadi.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <Button type="button" variant="primary" className="w-full" onClick={() => unstable_retry()}>
            <RotateCw className="size-4" aria-hidden="true" />
            Coba Lagi
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">
              <Home className="size-4" aria-hidden="true" />
              Kembali ke Beranda
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
