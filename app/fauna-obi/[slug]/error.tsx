"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCw, ArrowLeft } from "lucide-react";

export default function FaunaDetailError({
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
    <article className="relative bg-aged-paper py-12 border-b-4 border-on-surface min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center p-6 bg-background border-4 border-error rounded-2xl hard-shadow">
        <div className="inline-flex p-2.5 bg-error-container text-error rounded-full mb-3 border-2 border-error">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h2 className="text-headline-md font-serif font-black text-on-surface mb-1.5">
          Spesimen Gagal Dimuat
        </h2>
        <p className="text-body-md text-on-surface-variant mb-5">
          Terjadi kendala saat mengambil data spesimen ini. Silakan coba lagi.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => unstable_retry()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-11 w-full sm:w-auto bg-primary text-on-primary font-black uppercase tracking-wide text-label-md rounded-xl border-2 border-on-surface hard-shadow-sm hover:hard-shadow-md press-effect transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <RotateCw className="w-4 h-4" />
            Coba Lagi
          </button>
          <Link
            href="/fauna-obi"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 min-h-11 w-full sm:w-auto bg-background text-on-surface font-black uppercase tracking-wide text-label-md rounded-xl border-2 border-on-surface hover:bg-surface-container-low press-effect transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </div>
    </article>
  );
}
