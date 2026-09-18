"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

type ToastProps = {
  show: boolean;
  message: string;
};

/**
 * Toast konfirmasi sukses — dipakai form admin (CultureForm, FaunaForm, KKNJournalForm,
 * KKNProkerForm, UMKMForm) yang sebelumnya masing-masing menulis ulang div
 * `fixed bottom-6 right-6 ...` yang sama persis (salah satunya bahkan salah pasang warna
 * teks sehingga kontrasnya buruk).
 */
export function Toast({ show, message }: ToastProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-6 bg-success text-on-success px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 text-sm font-medium"
        >
          <CheckCircle2 className="w-5 h-5 shrink-0" aria-hidden="true" />
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
