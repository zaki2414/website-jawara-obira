// components/home/HomeFadeIn.tsx
"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

// Leaf "use client" khusus untuk transisi fade-in level halaman — dipisah
// dari app/page.tsx supaya page.tsx bisa jadi Server Component (fetch data
// lewat lib/supabase/queries.ts), sesuai migrasi yang diminta CLAUDE.md
// §1.1 untuk halaman ini. Pola sama dengan components/profil/ProfilFadeIn.tsx.
export function HomeFadeIn({ children }: { children: ReactNode }) {
  return (
    <motion.div
      className="min-h-screen bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
