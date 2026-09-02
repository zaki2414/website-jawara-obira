"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCw } from "lucide-react";

export default function UMKMListError({
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
    <section className="relative bg-natural-paper py-16 px-6 border-b-4 border-on-surface min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md text-center p-6 bg-background border-4 border-error rounded-2xl hard-shadow">
        <div className="inline-flex p-2.5 bg-error-container text-error rounded-full mb-3 border-2 border-error">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h2 className="text-headline-md font-serif font-black text-on-surface mb-1.5">
          Direktori Gagal Dimuat
        </h2>
        <p className="text-body-md text-on-surface-variant mb-5">
          Data mitra UMKM tidak dapat dimuat saat ini. Silakan coba lagi.
        </p>
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="inline-flex items-center gap-2 px-5 py-3 min-h-11 bg-primary text-on-primary font-black uppercase tracking-wide text-label-md rounded-xl border-2 border-on-surface hard-shadow-sm hover:hard-shadow-md press-effect transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
        >
          <RotateCw className="w-4 h-4" />
          Coba Lagi
        </button>
      </div>
    </section>
  );
}
