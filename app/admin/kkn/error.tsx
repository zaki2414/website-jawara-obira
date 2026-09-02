// app/admin/kkn/error.tsx
"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function KKNAdminHubError({
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
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border-4 border-error bg-background p-6 text-center hard-shadow">
        <div className="mb-3 inline-flex rounded-full border-2 border-error bg-error/10 p-2.5 text-error">
          <AlertCircle className="size-5" aria-hidden="true" />
        </div>
        <h2 className="mb-1.5 font-serif text-headline-md font-black text-on-surface">
          KKN Hub Gagal Dimuat
        </h2>
        <p className="mb-5 text-body-md text-on-surface-variant">
          Terjadi kendala saat memuat data ringkasan KKN. Silakan coba lagi.
        </p>
        <Button onClick={() => unstable_retry()} className="w-full">
          <RotateCw className="size-4" aria-hidden="true" />
          Coba Lagi
        </Button>
      </div>
    </main>
  );
}
